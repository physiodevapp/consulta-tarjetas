// Tarea 3: selector de región en el inicio (una sola URL). Tarea 4: añadir regiones
// una a una; las cinco ya tienen datos.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const { nombre: APP } = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'app.json'), 'utf8'));
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALLO:', m); } else console.log('ok:', m); };
const wait = ms => new Promise(r => setTimeout(r, ms));

function nueva() {
  const errs = [];
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true,
    beforeParse(w) { w.scrollTo = () => {}; w.addEventListener('error', e => errs.push(e.message)); w.console.error = (...a) => errs.push(a.join(' ')); } });
  return { w: dom.window, d: dom.window.document, errs };
}
const btn = (d, t) => [...d.querySelectorAll('#main button')].find(b => b.textContent.includes(t));
const click = b => { if (!b) throw new Error('botón no encontrado'); b.click(); };

(async () => {
  const { w, d, errs } = nueva();

  ok(d.title === APP, 'selector: título de la pestaña, sin región');
  ok(d.querySelector('#titulo').textContent === APP && d.querySelector('#back').hidden, 'selector: título en la cabecera y sin botón atrás');
  ok(d.querySelector('#regionCab').hidden, 'selector: sin nombre de región en la cabecera (todavía no se ha elegido ninguna)');

  const filas = [...d.querySelectorAll('#main .nav, #main .nav.pendiente')];
  ok(filas.length === 5, 'selector: las cinco regiones de CLAUDE.md: ' + filas.map(f => f.querySelector('b').textContent).join(', '));
  const nombres = filas.map(f => f.querySelector('b').textContent);
  ok(nombres.join('|') === 'Hombro|Lumbar|Cervical|Cadera|Rodilla', 'selector: orden de las regiones: ' + nombres.join('|'));

  ok(filas.every(f => f.tagName === 'BUTTON'), 'selector: las cinco regiones son clicables');
  ok(!d.querySelector('#main .nav.pendiente'), 'selector: ninguna región pendiente');

  click(btn(d, 'Hombro'));
  ok(d.title === APP + ' Hombro', 'home: título de la pestaña con la región');
  ok(d.querySelector('#titulo').textContent === 'Hombro' && !d.querySelector('#back').hidden, 'home: título de la región y botón atrás (vuelve al selector)');

  d.querySelector('#back').click(); await wait(50);
  ok(d.querySelector('#titulo').textContent === APP && d.querySelector('#back').hidden, 'atrás desde home: vuelve al selector, sin botón atrás');
  ok(d.title === APP, 'atrás desde home: título de la pestaña, sin región');

  // Volver a entrar conserva el recorrido de esa misma región (no es un cambio de región)
  click(btn(d, 'Hombro')); click(btn(d, 'Bisagra y árbol'));
  click(d.querySelector('#nodo-1 .marca [data-v="hecho"]'));
  d.querySelector('#back').click(); await wait(50);
  d.querySelector('#back').click(); await wait(50);
  click(btn(d, 'Hombro')); click(btn(d, 'Bisagra y árbol'));
  ok(d.querySelector('#nodo-1 .marca [data-v="hecho"]').getAttribute('aria-pressed') === 'true', 'volver a entrar en la misma región conserva las marcas del recorrido');

  // Cambiar de región: cadera abre con sus propios datos, no los de hombro
  d.querySelector('#back').click(); await wait(50); d.querySelector('#back').click(); await wait(50);
  click(btn(d, 'Cadera'));
  ok(d.querySelector('#titulo').textContent === 'Cadera' && d.title === APP + ' Cadera', 'selector → cadera: título de la región correcto');
  click(btn(d, 'Bisagra y árbol'));
  ok([...d.querySelectorAll('.nodo .n')].map(e => e.textContent).join('|') === '1|2|3|4|5|5b|6', 'cadera: nodos propios (no los de hombro)');

  d.querySelector('#back').click(); await wait(50); d.querySelector('#back').click(); await wait(50);
  click(btn(d, 'Lumbar'));
  click(btn(d, 'Bisagra y árbol'));
  ok([...d.querySelectorAll('.nodo .n')].map(e => e.textContent).join('|') === '1|2|3|3b|4', 'lumbar: nodos propios (no los de hombro ni cadera)');

  d.querySelector('#back').click(); await wait(50); d.querySelector('#back').click(); await wait(50);
  click(btn(d, 'Cervical'));
  click(btn(d, 'Bisagra y árbol'));
  ok([...d.querySelectorAll('.nodo .n')].map(e => e.textContent).join('|') === '1|2|3|3b|4|5|5b|6', 'cervical: nodos propios');

  d.querySelector('#back').click(); await wait(50); d.querySelector('#back').click(); await wait(50);
  click(btn(d, 'Rodilla'));
  click(btn(d, 'Bisagra y árbol'));
  ok([...d.querySelectorAll('.nodo .n')].map(e => e.textContent).join('|') === '1|2|3|4|5|6|7', 'rodilla: nodos propios');

  ok(w.sessionStorage.length === 0 && w.localStorage.length === 0, 'no guarda nada en el navegador');
  ok(errs.length === 0, 'sin errores de JS: ' + errs.join(' / '));
  console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
  process.exit(fails ? 1 : 0);
})();
