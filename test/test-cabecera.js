const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALLO:', m); } else console.log('ok:', m); };
const wait = ms => new Promise(r => setTimeout(r, ms));
let pasosBottom = 300;   // posición simulada de las cápsulas del panel respecto a la cabecera (bottom 56)
function nueva() {
  const errs = [];
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true,
    beforeParse(w) { w.scrollTo = () => {}; w.Element.prototype.scrollIntoView = function () {};
      w.Element.prototype.getBoundingClientRect = function () { return { top: 0, left: 0, right: 0, width: 0, height: 0, bottom: this.id === 'recPasos' ? pasosBottom : this.id === 'cab' ? 56 : 0 }; };
      w.addEventListener('error', e => errs.push(e.message)); w.console.error = (...a) => errs.push(a.join(' ')); } });
  return { w: dom.window, d: dom.window.document, errs };
}
const btn = (d, t) => [...d.querySelectorAll('#main button')].find(b => b.textContent.includes(t));
const click = b => { if (!b) throw new Error('botón no encontrado'); b.click(); };
const cab = d => ({ titulo: !d.querySelector('#titulo').hidden, rec: !d.querySelector('#cabRec').hidden, chips: [...d.querySelectorAll('#cabRec .paso')].map(b => b.textContent),
  region: d.querySelector('#regionCab').hidden ? null : d.querySelector('#regionCab').textContent });
const scroll = (w, y) => { pasosBottom = y; w.dispatchEvent(new w.Event('scroll')); };
// El inicio es el selector de región (tarea 3); hombro es la única disponible hoy
const entrarHombro = d => click(btn(d, 'Hombro'));

(async () => {
  const { w, d, errs } = nueva();
  let c = cab(d);
  ok(c.titulo && !c.rec && c.region === null, 'selector: título visible, sin recorrido y sin nombre de región (no hay ninguna elegida)');
  entrarHombro(d);
  c = cab(d); ok(c.titulo && !c.rec && c.region === null, 'home: título (ya es el nombre de la región) y sin nombre de región repetido');
  click(btn(d, 'Bisagra y árbol'));
  c = cab(d); ok(c.titulo && !c.rec && d.querySelector('#titulo').textContent === 'Bisagra y árbol' && c.region === 'Hombro', 'árbol arriba: título visible (las cápsulas del panel se ven) y nombre de región en la cabecera');
  scroll(w, 10);
  c = cab(d); ok(!c.titulo && c.rec && c.chips.join('|') === '1 ·|2 ·|2b ·|3 ·|4 ·', 'al salir las cápsulas del panel: la cabecera muestra el recorrido: ' + c.chips.join('|'));
  // tarea 3: con una sola paleta, el nombre de la región se ve siempre, también con las cápsulas
  ok(c.region === 'Hombro', 'con las cápsulas del recorrido, el nombre de la región sigue en la cabecera');
  ok(!d.querySelector('#back').hidden, 'el botón atrás sigue en la cabecera');
  scroll(w, 200);
  c = cab(d); ok(c.titulo && !c.rec, 'al volver a verse las cápsulas: vuelve el título');
  scroll(w, 10);
  // marcar con la cabecera en modo recorrido: las cápsulas de la cabecera se actualizan y el modo se mantiene
  click(d.querySelector('#nodo-3 .marca [data-v="dudoso"]'));
  c = cab(d); ok(!c.titulo && c.rec && c.chips[3] === '3 ?', 'marcar con la cabecera en modo recorrido: chips actualizados: ' + c.chips.join('|'));
  click(d.querySelector('#nodo-1 .marca [data-v="hecho"]'));
  c = cab(d); ok(c.chips.join('|') === '1 ✓|2 ·|2b ·|3 ?|4 ·', 'chips de la cabecera reflejan todas las marcas');
  // pulsar chip de la cabecera salta al nodo
  let salto = null; w.Element.prototype.scrollIntoView = function () { salto = this.id; };
  click(d.querySelectorAll('#cabRec .paso')[3]); ok(salto === 'nodo-3', 'pulsar una cápsula de la cabecera salta al nodo');
  // en otras pantallas, la cabecera vuelve al título aunque el scroll sea "grande"
  click(btn(d, 'Dolor subacromial (SAPS)'));
  c = cab(d); ok(c.titulo && !c.rec && d.querySelector('#titulo').textContent === 'Dolor subacromial (SAPS)' && c.region === 'Hombro', 'en la ficha: título del síndrome, sin cápsulas, y nombre de región');
  pasosBottom = 300;   // al volver, la pantalla se coloca arriba y las cápsulas del panel se ven
  d.querySelector('#back').click(); await wait(50);
  c = cab(d); ok(d.querySelector('#titulo').textContent === 'Bisagra y árbol' && c.titulo && !c.rec, 'al volver al árbol arriba: título');
  ok(errs.length === 0, 'sin errores de JS: ' + errs.join(' / '));
  console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
  process.exit(fails ? 1 : 0);
})();
