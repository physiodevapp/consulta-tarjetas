const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALLO:', m); } else console.log('ok:', m); };
const norm = s => s.replace(/\s+/g, ' ').trim();
const wait = ms => new Promise(r => setTimeout(r, ms));
function nueva() {
  const errs = [], saltos = [];
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true,
    beforeParse(w) { w.scrollTo = () => {}; w.Element.prototype.scrollIntoView = function () { saltos.push(this.id); };
      w.addEventListener('error', e => errs.push(e.message)); w.console.error = (...a) => errs.push(a.join(' ')); } });
  return { w: dom.window, d: dom.window.document, errs, saltos };
}
const txt = d => norm(d.querySelector('#main').textContent);
const btn = (d, t) => [...d.querySelectorAll('#main button')].find(b => b.textContent.includes(t));
const click = b => { if (!b) throw new Error('botón no encontrado'); b.click(); };
const chips = d => [...d.querySelectorAll('.rec .paso')].map(b => b.textContent);
const marca = (d, n, e) => click(d.querySelector('#nodo-' + n + ' .marca [data-v="' + e + '"]'));
const pressed = (d, n) => [...d.querySelectorAll('#nodo-' + n + ' .marca button')].filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.v);

(async () => {
  const { w, d, errs, saltos } = nueva();
  click(btn(d, 'Bisagra y árbol'));
  ok(chips(d).join('|') === '1 ·|2 ·|2b ·|3 ·|4 ·', 'panel: 5 nodos sin marcar: ' + chips(d).join('|'));
  ok(txt(d).includes('Marca cada nodo al repasarlo'), 'panel: pista inicial');
  ok(d.querySelectorAll('.marca').length === 5 && d.querySelectorAll('.marca button').length === 15, 'cada nodo con 3 marcas');
  ok(!txt(d).includes('Limpiar recorrido'), 'sin botón de limpiar al empezar');

  marca(d, '1', 'hecho'); marca(d, '2', 'hecho');
  ok(chips(d).join('|') === '1 ✓|2 ✓|2b ·|3 ·|4 ·', 'chips tras marcar 1 y 2: ' + chips(d).join('|'));
  ok(txt(d).includes('Hechos 2 · Dudosos 0 · No aplica 0 · Sin marcar 3') && txt(d).includes('Sin marcar: 2b, 3, 4'), 'recuento y huecos');
  marca(d, '2b', 'na'); marca(d, '3', 'dudoso');
  ok(chips(d).join('|') === '1 ✓|2 ✓|2b –|3 ?|4 ·', 'chips con dudoso y no aplica: ' + chips(d).join('|'));
  ok(txt(d).includes('Hechos 2 · Dudosos 1 · No aplica 1 · Sin marcar 1'), 'recuento actualizado');
  ok(txt(d).includes('Revisar') && txt(d).includes('3 · ¿Los test cervicales reproducen el dolor de hombro?'), 'lista de dudosos con la pregunta literal de la tarjeta');
  ok(txt(d).includes('Sin marcar: 4') , 'hueco en el nodo 4');
  ok(pressed(d, '3').join() === 'dudoso' && d.querySelector('#nodo-3 .marca [data-v="dudoso"]').getAttribute('aria-pressed') === 'true', 'aria-pressed del nodo 3');
  marca(d, '3', 'dudoso'); ok(pressed(d, '3').length === 0 && chips(d)[3] === '3 ·', 'volver a pulsar quita la marca');
  marca(d, '3', 'hecho'); marca(d, '3', 'dudoso'); ok(pressed(d, '3').join() === 'dudoso', 'cambiar de estado sustituye al anterior');

  click(d.querySelectorAll('.rec .paso')[3]); ok(saltos.includes('nodo-3'), 'pulsar un nodo del panel salta a su tarjeta');

  // Persistencia durante la navegación
  click(btn(d, 'Dolor subacromial (SAPS)'));
  ok(d.querySelector('#titulo').textContent === 'Dolor subacromial (SAPS)', 'abre la ficha');
  d.querySelector('#back').click(); await wait(50);
  ok(d.querySelector('#titulo').textContent === 'Bisagra y árbol' && chips(d).join('|') === '1 ✓|2 ✓|2b –|3 ?|4 ·', 'al volver del síndrome las marcas siguen');
  ok(txt(d).includes('Fichas abiertas: Dolor subacromial (SAPS)'), 'registra la ficha abierta');
  click(btn(d, 'Rotura del manguito')); d.querySelector('#back').click(); await wait(50);
  ok(txt(d).includes('Fichas abiertas: Dolor subacromial (SAPS), Rotura del manguito'), 'registra varias fichas en orden');
  click(btn(d, 'Rigidez activa')); d.querySelector('#back').click(); await wait(50);
  ok(chips(d)[0] === '1 ✓', 'tras ir a rigidez y volver, siguen las marcas');

  // Limpiar
  click(btn(d, 'Limpiar recorrido'));
  ok(chips(d).join('|') === '1 ·|2 ·|2b ·|3 ·|4 ·' && !txt(d).includes('Fichas abiertas') && txt(d).includes('Marca cada nodo'), 'limpiar deja el árbol como nuevo');

  // Recarga: memoria solamente
  const n2 = nueva(); click(btn(n2.d, 'Bisagra y árbol'));
  ok(chips(n2.d).every(c => c.endsWith('·')), 'una página nueva empieza sin marcas');
  ok(w.sessionStorage.length === 0 && w.localStorage.length === 0 && n2.w.sessionStorage.length === 0, 'no guarda nada en el navegador');
  ok(errs.length === 0 && n2.errs.length === 0, 'sin errores de JS: ' + errs.concat(n2.errs).join(' / '));
  console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
  process.exit(fails ? 1 : 0);
})();
