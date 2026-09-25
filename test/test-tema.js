// Toggle claro/oscuro: por defecto sigue al sistema (decisión 5); este botón deja forzarlo.
// Como el recorrido del árbol y el wake lock, vive solo en memoria (decisión 1): se
// pierde al recargar. jsdom sí implementa matchMedia (a diferencia de wakeLock), así que
// se puede simular el cambio de preferencia del sistema con un MediaQueryList falso.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALLO:', m); } else console.log('ok:', m); };

// MediaQueryList falso para "(prefers-color-scheme: dark)": empieza en `oscuro` y permite
// simular un cambio de preferencia del sistema disparando 'change'.
function conPrefiereOscuro(w, oscuro) {
  const listeners = [];
  const mql = {
    matches: oscuro,
    media: '(prefers-color-scheme: dark)',
    addEventListener: (t, fn) => { if (t === 'change') listeners.push(fn); },
    removeEventListener: () => {}
  };
  w.matchMedia = q => (q === '(prefers-color-scheme: dark)' ? mql : { matches: false, addEventListener: () => {}, removeEventListener: () => {} });
  return { cambiar: v => { mql.matches = v; listeners.forEach(fn => fn({ matches: v })); } };
}

function nueva(oscuroSistema) {
  const errs = [];
  let sistema = null;
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true,
    beforeParse(w) {
      w.scrollTo = () => {};
      sistema = conPrefiereOscuro(w, !!oscuroSistema);
      w.addEventListener('error', e => errs.push(e.message)); w.console.error = (...a) => errs.push(a.join(' '));
    } });
  return { w: dom.window, d: dom.window.document, errs, sistema: () => sistema };
}

// ── Estado inicial: automático, sin forzar nada en el <html> ──
{
  const { d, errs } = nueva(false);
  const boton = d.querySelector('#tema');
  ok(!!boton, 'el botón de tema existe en la cabecera');
  ok(d.documentElement.dataset.theme === undefined, 'al cargar: sin data-theme (automático, según el sistema)');
  ok(boton.getAttribute('aria-pressed') === 'false', 'botón: aria-pressed false en automático');
  ok(boton.getAttribute('aria-label') === 'Tema: automático (según el sistema)', 'botón: aria-label dice "automático"');
  ok(boton.getAttribute('title') === 'Tema: automático (según el sistema)', 'botón: title (tooltip en hover de escritorio) dice lo mismo que aria-label');
  ok(d.querySelector('#temaColor').getAttribute('content') === '#FFFFFF', 'meta theme-color: --panel claro cuando el sistema no pide oscuro');
  ok(errs.length === 0, 'sin errores de JS: ' + errs.join(' / '));
}

// ── Ciclo del botón: automático → claro → oscuro → automático ──
{
  const { d, errs } = nueva(false);
  const boton = d.querySelector('#tema');
  boton.click();
  ok(d.documentElement.dataset.theme === 'light', 'primer clic: data-theme="light"');
  ok(boton.getAttribute('aria-pressed') === 'true', 'forzado: aria-pressed true');
  ok(boton.getAttribute('aria-label') === 'Tema: claro', 'aria-label dice "claro"');
  ok(boton.getAttribute('title') === 'Tema: claro', 'title dice "claro"');
  boton.click();
  ok(d.documentElement.dataset.theme === 'dark', 'segundo clic: data-theme="dark"');
  ok(boton.getAttribute('aria-label') === 'Tema: oscuro', 'aria-label dice "oscuro"');
  ok(boton.getAttribute('title') === 'Tema: oscuro', 'title dice "oscuro"');
  ok(d.querySelector('#temaColor').getAttribute('content') === '#162124', 'meta theme-color: --panel oscuro con el tema forzado a oscuro');
  boton.click();
  ok(d.documentElement.dataset.theme === undefined, 'tercer clic: vuelve a automático, sin data-theme');
  ok(boton.getAttribute('aria-pressed') === 'false', 'de vuelta a automático: aria-pressed false');
  ok(errs.length === 0, 'ciclo del botón: sin errores de JS: ' + errs.join(' / '));
}

// ── En automático, sigue al sistema si este cambia mientras la SPA está abierta ──
{
  const { d, errs, sistema } = nueva(false);
  ok(d.querySelector('#temaColor').getAttribute('content') === '#FFFFFF', 'antes del cambio: --panel claro');
  sistema().cambiar(true);
  ok(d.documentElement.dataset.theme === undefined, 'sigue automático: no se fuerza data-theme al cambiar el sistema');
  ok(d.querySelector('#temaColor').getAttribute('content') === '#162124', 'meta theme-color reacciona al cambio de preferencia del sistema');
  errs.length && ok(false, 'cambio de sistema: sin errores de JS: ' + errs.join(' / '));
}

// ── Si se ha forzado un tema, un cambio de preferencia del sistema no lo pisa ──
{
  const { d, sistema } = nueva(false);
  d.querySelector('#tema').click();   // -> light
  sistema().cambiar(true);
  ok(d.documentElement.dataset.theme === 'light', 'forzado a claro: un cambio del sistema no lo sobrescribe');
}

// ── Recargar (nueva sesión en memoria, decisión 1): no debe recordar el tema forzado ──
{
  const primera = nueva(false);
  primera.d.querySelector('#tema').click();
  ok(primera.d.documentElement.dataset.theme === 'light', 'primera sesión: tema forzado a claro');
  const otra = nueva(false);
  ok(otra.d.documentElement.dataset.theme === undefined, 'al recargar: no se recuerda el tema forzado anterior (solo memoria, decisión 1)');
}

console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
process.exit(fails ? 1 : 0);
