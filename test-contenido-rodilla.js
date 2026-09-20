// Tarea 4 · rodilla: el texto en pantalla coincide con el de su tarjeta. La más grande
// (13 síndromes + 8 entidades en ORIENTATIVA, que aquí es una segunda tabla de fichas
// con ①②, no una matriz comparativa ni una lista de entidades sin ellos) y con la
// correspondencia síndrome↔pronóstico menos trivial: 17 filas para 13 síndromes, con
// una fila combinada (LCP · LLE · EPL) y una síndrome sin fila (Lesión osteocondral).
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'rodilla.data.json'), 'utf8'));
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALLO:', m); } else console.log('ok:', m); };
const norm = s => s.replace(/\s+/g, ' ').trim();
const wait = ms => new Promise(r => setTimeout(r, ms));

function nueva() {
  const errs = [];
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true,
    beforeParse(w) { w.scrollTo = () => {}; w.addEventListener('error', e => errs.push(e.message)); w.console.error = (...a) => errs.push(a.join(' ')); } });
  return { w: dom.window, d: dom.window.document, errs };
}
const txt = d => norm(d.querySelector('#main').textContent);
const titulo = d => d.querySelector('#titulo').textContent;
// btn() exige coincidencia EXACTA del título del botón: «Menisco» y «LCP» se repiten
// en dos nodos, y varios botones de fichas distintas comparten palabras.
const btns = d => [...d.querySelectorAll('#main button')];
const btn = (d, t) => btns(d).find(b => { const n = b.querySelector('b'); return n && n.textContent === t; });
const click = b => { if (!b) throw new Error('botón no encontrado'); b.click(); };
const entrarRodilla = d => click(btn(d, 'Rodilla'));

(async () => {
  // ── Home: URGENCIA (TVP, artritis séptica, aparato extensor, bursa con fiebre, neurovascular) ──
  let { w, d, errs } = nueva();
  entrarRodilla(d);
  ok(titulo(d) === 'Rodilla', 'home: título');
  ok(d.querySelector('#main').firstElementChild.classList.contains('urgencia'), 'home: URGENCIA es lo primero que se ve');
  let t = txt(d);
  ok(t.includes(norm(data.URGENCIA.titulo)) && data.URGENCIA.lineas.every(l => t.includes(norm(l))), 'home: URGENCIA con título y las 5 líneas literales (incluida la regla de Ottawa)');

  // ── Banderas: 3 columnas, 9 filas ──
  click(btn(d, 'Banderas rojas de la región'));
  t = txt(d);
  const faltan = [];
  data.BANDERAS.filas.forEach(f => f.forEach(c => { if (!t.includes(norm(c))) faltan.push(c.slice(0, 30)); }));
  ok(faltan.length === 0, 'banderas: las 9 filas completas' + faltan.join('|'));
  ok(t.includes(norm(data.BANDERAS.nota)) && t.includes(norm(data.TITULOS.pieA2)), 'banderas: nota y pie (cara A2, SPLIT_A)');
  d.querySelector('#back').click(); await wait(50);

  // ── Árbol: bisagra, 7 nodos, texto completo de los nodos 4 y 7 (dos líneas, sin recortar) ──
  click(btn(d, 'Bisagra y árbol'));
  t = txt(d);
  ok(t.includes(norm(data.BISAGRA.pregunta)) && t.includes(norm(data.BISAGRA.apoyo)), 'árbol: bisagra completa');
  ok(['1', '2', '3', '4', '5', '6', '7'].every(n => [...d.querySelectorAll('.nodo .n')].some(e => e.textContent === n)), 'árbol: los 7 nodos de rodilla');
  ok(t.includes(norm(data.ARBOL.filas.find(f => f[0] === '4')[1])), 'árbol: nodo 4, las dos líneas literales (sin recortar; sin patrones limpios)');
  ok(t.includes(norm(data.ARBOL.filas.find(f => f[0] === '7')[1])), 'árbol: nodo 7, las dos líneas literales (otra gramática: minúsculas, sin flechas)');
  const accs = btns(d).map(b => b.querySelector('b') && b.querySelector('b').textContent).filter(Boolean);
  const sindromes = data.SINDROMES.filas.map(f => f[0]);
  ok(sindromes.every(s => accs.includes(s)), 'árbol: las 13 fichas de síndrome alcanzables: ' + accs.join(' | '));
  ok(accs.filter(a => a === 'Dolor persistente').length === 2, 'árbol: dos accesos a la orientativa (nodos 6 y 7)');
  ok(accs.filter(a => a === 'Menisco').length === 2 && accs.filter(a => a === 'LCP').length === 2, 'árbol: Menisco y LCP alcanzables desde los nodos 4 y 7, un botón por nodo');

  // ── Las 13 fichas: contenido literal, y pronóstico (con el mapa no trivial) ──
  const mapa = { 'LCP': 'LCP · LLE · EPL', 'Dolor femororrotuliano': 'Dolor FR', 'Apofisitis del adolescente': 'Apofisitis', 'Lesión osteocondral': null };
  for (const f of data.SINDROMES.filas) {
    const inst = nueva();
    entrarRodilla(inst.d);
    click(btn(inst.d, 'Bisagra y árbol')); click(btn(inst.d, f[0]));
    const tt = txt(inst.d);
    ok(titulo(inst.d) === f[0], 'ficha ' + f[0] + ': título');
    ok(f.slice(1).every(c => tt.includes(norm(c))), 'ficha ' + f[0] + ': contenido idéntico a la tarjeta');
    ok(tt.includes(norm(data.SINDROMES.aviso)), 'ficha ' + f[0] + ': aviso');
    // SINDROMES.nota es general en rodilla (como cadera): en las 13 fichas
    ok(tt.includes(norm(data.SINDROMES.nota)), 'ficha ' + f[0] + ': nota general de síndromes');
    const claveP = f[0] in mapa ? mapa[f[0]] : f[0];
    if (claveP === null) {
      ok(!tt.includes('Bloque 6 · horizonte y criterio'), 'ficha ' + f[0] + ': sin fila de pronóstico en la tarjeta → sin plegable de bloque 6');
    } else {
      const pr = data.PRONOSTICO.filas.find(x => x[0] === claveP);
      ok(!!pr, 'ficha ' + f[0] + ': tiene fila de pronóstico (' + claveP + ')');
      ok(tt.includes('Bloque 6 · horizonte y criterio') && [pr[1], pr[2]].every(c => tt.includes(norm(c))), 'ficha ' + f[0] + ': pronóstico completo (' + claveP + ')');
    }
    ok(inst.errs.length === 0, 'ficha ' + f[0] + ': sin errores');
  }

  // ── Orientativa: 3 grupos propios (medial/lateral/posterior), las 8 entidades con ①② ──
  ({ w, d, errs } = nueva());
  entrarRodilla(d);
  click(btn(d, 'Bisagra y árbol')); click(btn(d, 'Dolor persistente'));
  ok(titulo(d) === 'Dolor persistente', 'orientativa: se llega desde el árbol');
  t = txt(d);
  ok(data.ORIENTATIVA.filas.every(f => f.every(c => t.includes(norm(c)))), 'orientativa: las 8 entidades completas, con Explorar, ① y ②');
  const grupos = [...d.querySelectorAll('.grupo')].map(g => g.textContent);
  ok(grupos.join('|') === 'Medial|Lateral|Posterior', 'orientativa: agrupación propia por localización: ' + grupos.join('|'));
  const orden = [...d.querySelectorAll('#main > .grupo, #main > details')].map(e => e.matches('.grupo') ? '#' : e.querySelector('summary b').textContent);
  ok(orden.join('|') === '#|Artrosis|Bursitis anserina|Plica sinovial medial|#|Cintilla iliotibial|Tibioperonea proximal|Nervio peroneo común|#|Quiste poplíteo|Referido de cadera o lumbar', 'orientativa: orden dentro de cada grupo: ' + orden.join('|'));
  ok(t.includes(norm(data.ORIENTATIVA.nota)) && t.includes(norm(data.PRONOSTICO.pie)), 'orientativa: nota y pie (cara C, SPLIT_B)');
  ok(t.includes('Agrupación propia'), 'orientativa: avisa de la agrupación propia');
  ok(errs.length === 0, 'orientativa: sin errores de JS');

  // ── Sin almacenamiento ──
  ok(w.sessionStorage.length === 0 && w.localStorage.length === 0, 'no guarda nada en el navegador');
  console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
  process.exit(fails ? 1 : 0);
})();
