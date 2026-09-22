// Wake Lock (tarea 6): mantener la pantalla encendida. Falló dentro del visor de
// claude.ai (iframe); aquí se prueba como página propia, con navigator.wakeLock
// simulado (jsdom no lo implementa) para no depender de un navegador real.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALLO:', m); } else console.log('ok:', m); };

// Sentinel falso: EventTarget con release(), como el WakeLockSentinel real
function conWakeLock(w) {
  let solicitudes = 0;
  function Sentinel() {
    const t = new w.EventTarget();
    t.released = false;
    t.release = () => { t.released = true; t.dispatchEvent(new w.Event('release')); return Promise.resolve(); };
    return t;
  }
  w.navigator.wakeLock = { request: () => { solicitudes++; return Promise.resolve(Sentinel()); } };
  return { contar: () => solicitudes };
}

function nueva(conApi) {
  const errs = [];
  let api = null;
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true,
    beforeParse(w) {
      w.scrollTo = () => {};
      if (conApi) api = conWakeLock(w);
      w.addEventListener('error', e => errs.push(e.message)); w.console.error = (...a) => errs.push(a.join(' '));
    } });
  return { w: dom.window, d: dom.window.document, errs, api: () => api };
}
const wait = ms => new Promise(r => setTimeout(r, ms));

// ── Sin navigator.wakeLock (navegador sin soporte): el botón sigue oculto, sin errores ──
{
  const { d, errs } = nueva(false);
  ok(d.querySelector('#pantalla').hidden, 'sin soporte de Wake Lock: el botón sigue oculto');
  ok(errs.length === 0, 'sin soporte de Wake Lock: sin errores de JS: ' + errs.join(' / '));
}

// ── Con navigator.wakeLock: el botón aparece, y alterna pedir/soltar ──
(async () => {
  const { d, errs, api } = nueva(true);
  const boton = d.querySelector('#pantalla');
  ok(!boton.hidden, 'con soporte de Wake Lock: el botón se muestra');
  ok(boton.getAttribute('aria-pressed') === 'false', 'botón: empieza sin pedir la pantalla encendida');
  ok(boton.getAttribute('aria-label') === 'Mantener la pantalla encendida: desactivado', 'botón: aria-label dice el estado (desactivado), no solo aria-pressed');
  boton.click();
  await wait(20);
  ok(boton.getAttribute('aria-pressed') === 'true', 'al pulsar: pide el wake lock (aria-pressed true)');
  ok(boton.getAttribute('aria-label') === 'Mantener la pantalla encendida: activado', 'al pulsar: aria-label pasa a decir "activado"');
  ok(api().contar() === 1, 'al pulsar: llama a navigator.wakeLock.request una vez');
  boton.click();
  await wait(20);
  ok(boton.getAttribute('aria-pressed') === 'false', 'al pulsar otra vez: suelta el wake lock (aria-pressed false)');
  ok(errs.length === 0, 'con wake lock: sin errores de JS: ' + errs.join(' / '));

  // Recargar (nueva sesión en memoria, decisión 1): no debe recordar que estaba pedido
  const otra = nueva(true);
  ok(otra.d.querySelector('#pantalla').getAttribute('aria-pressed') === 'false', 'al recargar: no se recuerda el estado anterior (solo memoria, decisión 1)');

  // El navegador suelta el wake lock solo al ocultar la pestaña; si se sigue queriendo,
  // hay que volver a pedirlo cuando la pestaña se vuelve a ver
  const s = nueva(true);
  s.d.querySelector('#pantalla').click();
  await wait(20);
  ok(s.api().contar() === 1, 'tercera sesión: primer clic pide el wake lock');
  Object.defineProperty(s.d, 'visibilityState', { value: 'hidden', configurable: true });
  s.d.dispatchEvent(new s.w.Event('visibilitychange'));
  await wait(20);
  Object.defineProperty(s.d, 'visibilityState', { value: 'visible', configurable: true });
  s.d.dispatchEvent(new s.w.Event('visibilitychange'));
  await wait(20);
  ok(s.api().contar() >= 1, 'al volver a ver la pestaña con el wake lock aún querido: se puede volver a pedir sin errores');
  ok(s.errs.length === 0, 'visibilitychange: sin errores de JS: ' + s.errs.join(' / '));

  console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
  process.exit(fails ? 1 : 0);
})();
