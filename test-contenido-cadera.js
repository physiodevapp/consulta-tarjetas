// Tarea 4 · cadera: el texto en pantalla coincide con el de su tarjeta (como
// test-contenido.js con hombro), cubriendo lo que cadera tiene y hombro no: URGENCIA,
// BANDERAS con «Sospecha → derivación médica» en la cabecera, ORIENTATIVA genérica (entidades
// de Doha, sin la agrupación de rigidez de hombro), fila con { span } sin ① ni ②, y
// PRONOSTICO_DE explícito (con una síndrome, sensibilización central, sin fila de pronóstico).
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'cadera.data.json'), 'utf8'));
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
const btns = d => [...d.querySelectorAll('#main button')];
const btn = (d, t) => btns(d).find(b => b.textContent.includes(t));
const click = b => { if (!b) throw new Error('botón no encontrado'); b.click(); };
const entrarCadera = d => click(btn(d, 'Cadera'));

(async () => {
  // ── Home: URGENCIA es lo primero, y los dos accesos ──
  let { w, d, errs } = nueva();
  entrarCadera(d);
  ok(titulo(d) === 'Cadera', 'home: título');
  const main = d.querySelector('#main');
  ok(main.firstElementChild.classList.contains('urgencia'), 'home: URGENCIA es lo primero que se ve (cadera sí la tiene)');
  let t = txt(d);
  ok(t.includes(norm(data.URGENCIA.titulo)) && data.URGENCIA.lineas.every(l => t.includes(norm(l))), 'home: URGENCIA con título y líneas literales');
  ok(d.querySelectorAll('.nav').length === 2, 'home: 2 accesos (banderas y árbol)');

  // ── Banderas: 9 filas, 3 columnas, cabecera propia («Sospecha → derivación médica») ──
  click(btn(d, 'Banderas rojas'));
  t = txt(d);
  const faltan = [];
  data.BANDERAS.filas.forEach(f => f.forEach(c => { if (!t.includes(norm(c))) faltan.push(c.slice(0, 30)); }));
  ok(faltan.length === 0, 'banderas: las 9 filas completas' + faltan.join('|'));
  ok(t.includes(norm(data.BANDERAS.nota)) && t.includes(norm(data.TITULOS.pieA2)), 'banderas: nota y pie');
  ok(t.includes('Pistas en entrevista y exploración') && t.includes('Ayuda en consulta'), 'banderas: cabecera propia de cadera');
  d.querySelector('#back').click(); await wait(50);

  // ── Árbol: bisagra, 7 nodos, y las nueve fichas + orientativa alcanzables ──
  click(btn(d, 'Bisagra y árbol'));
  t = txt(d);
  ok(t.includes(norm(data.BISAGRA.pregunta)) && t.includes(norm(data.BISAGRA.apoyo)), 'árbol: bisagra completa');
  ok(['1', '2', '3', '4', '5', '5b', '6'].every(n => [...d.querySelectorAll('.nodo .n')].some(e => e.textContent === n)), 'árbol: los 7 nodos de cadera (no los de hombro)');
  const accs = btns(d).map(b => b.querySelector('b') && b.querySelector('b').textContent).filter(Boolean);
  const sindromes = data.SINDROMES.filas.map(f => f[0]);
  ok(sindromes.every(s => accs.includes(s)), 'árbol: las 9 fichas de síndrome alcanzables: ' + accs.join(' | '));
  ok(accs.includes('Ingle de larga evolución'), 'árbol: acceso a la tabla orientativa (entidades de Doha)');
  ok(t.includes(norm(data.ARBOL.filas.find(f => f[0] === '1')[1])) && t.includes(norm(data.ARBOL.filas.find(f => f[0] === '6')[1])), 'árbol: texto de los nodos 1 y 6 literal (no recortado)');

  // ── Las 9 fichas: contenido literal; sensibilización central con { span } y sin pronóstico ──
  const mapa = { 'Lesión aguda de ingle': 'Aductor y resto de Doha' };
  for (const f of data.SINDROMES.filas) {
    const inst = nueva();
    entrarCadera(inst.d);
    click(btn(inst.d, 'Bisagra y árbol')); click(btn(inst.d, f[0]));
    const tt = txt(inst.d);
    ok(titulo(inst.d) === f[0], 'ficha ' + f[0] + ': título');
    const esSpan = f[2] && typeof f[2] === 'object' && f[2].span !== undefined;
    const celdasEsperadas = esSpan ? [f[1], f[2].span] : f.slice(1);
    ok(celdasEsperadas.every(c => tt.includes(norm(c))), 'ficha ' + f[0] + ': contenido idéntico a la tarjeta' + (esSpan ? ' (celda span combinada)' : ''));
    ok(tt.includes(norm(data.SINDROMES.aviso)) && tt.includes(norm(data.SINDROMES.nota)), 'ficha ' + f[0] + ': aviso y nota (general en cadera, en las 9 fichas)');
    const claveP = mapa[f[0]] || f[0];
    const pr = data.PRONOSTICO.filas.find(x => x[0] === claveP);
    if (pr) {
      ok(tt.includes('Bloque 6 · horizonte y criterio') && [pr[1], pr[2]].every(c => tt.includes(norm(c))), 'ficha ' + f[0] + ': pronóstico (' + claveP + ')');
    } else {
      ok(!tt.includes('Bloque 6 · horizonte y criterio'), 'ficha ' + f[0] + ': sin fila de pronóstico en la tarjeta → sin plegable de bloque 6');
    }
    ok(inst.errs.length === 0, 'ficha ' + f[0] + ': sin errores');
  }

  // ── Orientativa: las 5 entidades de Doha, tabla genérica (no la pantalla de rigidez de hombro) ──
  ({ w, d, errs } = nueva());
  entrarCadera(d);
  click(btn(d, 'Bisagra y árbol')); click(btn(d, 'Ingle de larga evolución'));
  ok(titulo(d) === 'Ingle de larga evolución', 'orientativa: se llega desde el nodo 6 del árbol');
  t = txt(d);
  ok(data.ORIENTATIVA.filas.every(f => f.every(c => t.includes(norm(c)))), 'orientativa: las 5 entidades completas, las 4 columnas');
  ok(t.includes(norm(data.ORIENTATIVA.nota)) && t.includes(norm(data.PRONOSTICO.pie)), 'orientativa: nota y pie (cara C, SPLIT_B)');
  ok(!d.querySelector('.grupo') && !t.includes('Agrupación propia'), 'orientativa: sin agrupación (no es la pantalla de rigidez de hombro)');
  ok(errs.length === 0, 'orientativa: sin errores de JS');

  // ── Sin almacenamiento ──
  ok(w.sessionStorage.length === 0 && w.localStorage.length === 0, 'no guarda nada en el navegador');
  console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
  process.exit(fails ? 1 : 0);
})();
