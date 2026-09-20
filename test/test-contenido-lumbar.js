// Tarea 4 · lumbar: el texto en pantalla coincide con el de su tarjeta (como
// test-contenido.js con hombro), cubriendo lo que lumbar tiene y difiere de cadera:
// BANDERAS de 2 columnas (sin «ayuda en consulta»), ORIENTATIVA como matriz comparativa
// (filas = criterios, no entidades; primera cabecera vacía), un nodo del árbol (4) que
// reparte patrón en una línea limpia como hombro y otro (3b) con botones fijos como
// cadera, y PRONOSTICO_DE con una síndrome (miofascial) sin fila de pronóstico.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'lumbar.data.json'), 'utf8'));
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
const entrarLumbar = d => click(btn(d, 'Lumbar'));

(async () => {
  // ── Home: URGENCIA (cauda equina) es lo primero ──
  let { w, d, errs } = nueva();
  entrarLumbar(d);
  ok(titulo(d) === 'Lumbar', 'home: título');
  ok(d.querySelector('#main').firstElementChild.classList.contains('urgencia'), 'home: URGENCIA es lo primero que se ve');
  let t = txt(d);
  ok(t.includes(norm(data.URGENCIA.titulo)) && data.URGENCIA.lineas.every(l => t.includes(norm(l))), 'home: URGENCIA con título y líneas literales (cauda equina)');

  // ── Banderas: 2 columnas (sin «ayuda en consulta»), 8 filas ──
  click(btn(d, 'Banderas rojas'));
  t = txt(d);
  ok(data.BANDERAS.cabecera.length === 2, 'banderas: cabecera de 2 columnas en los datos');
  const faltan = [];
  data.BANDERAS.filas.forEach(f => { ok(f.length === 2, 'banderas: fila «' + f[0] + '» con 2 celdas'); f.forEach(c => { if (!t.includes(norm(c))) faltan.push(c.slice(0, 30)); }); });
  ok(faltan.length === 0, 'banderas: las 8 filas completas' + faltan.join('|'));
  ok(t.includes(norm(data.BANDERAS.nota)) && t.includes(norm(data.TITULOS.pieA2)), 'banderas: nota y pie');
  d.querySelector('#back').click(); await wait(50);

  // ── Árbol: bisagra, 5 nodos, texto de los nodos 3b y 4 (multilínea) ──
  click(btn(d, 'Bisagra y árbol'));
  t = txt(d);
  ok(t.includes(norm(data.BISAGRA.pregunta)) && t.includes(norm(data.BISAGRA.apoyo)), 'árbol: bisagra completa');
  ok(['1', '2', '3', '3b', '4'].every(n => [...d.querySelectorAll('.nodo .n')].some(e => e.textContent === n)), 'árbol: los 5 nodos de lumbar');
  ok(t.includes(norm(data.ARBOL.filas.find(f => f[0] === '3b')[1])), 'árbol: nodo 3b, las dos líneas literales (sin recortar)');
  const accs = btns(d).map(b => b.querySelector('b') && b.querySelector('b').textContent).filter(Boolean);
  const sindromes = data.SINDROMES.filas.map(f => f[0]);
  ok(sindromes.every(s => accs.includes(s)), 'árbol: las 7 fichas de síndrome alcanzables: ' + accs.join(' | '));
  ok(accs.includes('Inespecífico'), 'árbol: acceso a la tabla orientativa desde el nodo 4');
  // el nodo 4 SÍ se recorta a la pregunta (como el nodo 4 de hombro): los patrones son los botones
  const nodo4texto = norm(d.querySelector('#nodo-4 .pre').textContent);
  ok(nodo4texto === '¿qué patrón encaja mejor?'.replace('¿', 'Inespecífico, ¿'), 'árbol: nodo 4 recortado a la pregunta (patrón limpio, como hombro)');

  // ── Las 7 fichas: contenido literal; miofascial con { span } y sin pronóstico ──
  const mapa = { 'Dolor radicular': 'Radicular', 'Estenosis de canal': 'Estenosis', 'Sacroilíaca': 'Sacroilíaca · PRPPP' };
  for (const f of data.SINDROMES.filas) {
    const inst = nueva();
    entrarLumbar(inst.d);
    click(btn(inst.d, 'Bisagra y árbol')); click(btn(inst.d, f[0]));
    const tt = txt(inst.d);
    ok(titulo(inst.d) === f[0], 'ficha ' + f[0] + ': título');
    const esSpan = f[2] && typeof f[2] === 'object' && f[2].span !== undefined;
    const celdasEsperadas = esSpan ? [f[1], f[2].span] : f.slice(1);
    ok(celdasEsperadas.every(c => tt.includes(norm(c))), 'ficha ' + f[0] + ': contenido idéntico a la tarjeta' + (esSpan ? ' (celda span combinada)' : ''));
    ok(tt.includes(norm(data.SINDROMES.aviso)), 'ficha ' + f[0] + ': aviso');
    // SINDROMES.nota aquí es específica de sacroilíaca (tests de disfunción SI), no general
    ok(f[0] === 'Sacroilíaca' ? tt.includes(norm(data.SINDROMES.nota)) : !tt.includes(norm(data.SINDROMES.nota)), 'ficha ' + f[0] + ': nota de síndromes solo en sacroilíaca');
    const claveP = mapa[f[0]] || f[0];
    const pr = data.PRONOSTICO.filas.find(x => x[0] === claveP);
    if (pr) {
      ok(tt.includes('Bloque 6 · horizonte y criterio') && [pr[1], pr[2]].every(c => tt.includes(norm(c))), 'ficha ' + f[0] + ': pronóstico (' + claveP + ')');
    } else {
      ok(!tt.includes('Bloque 6 · horizonte y criterio'), 'ficha ' + f[0] + ': sin fila de pronóstico en la tarjeta → sin plegable de bloque 6');
    }
    ok(inst.errs.length === 0, 'ficha ' + f[0] + ': sin errores');
  }
  // Dosis y progresión: la nota se parte en dos párrafos (CORTE_NOTA)
  {
    const inst = nueva();
    entrarLumbar(inst.d);
    click(btn(inst.d, 'Bisagra y árbol')); click(btn(inst.d, 'Discogénico'));
    const notas = [...inst.d.querySelectorAll('#main .nota')].map(n => n.textContent);
    ok(notas.some(n => n === 'Dosis y progresión no están en la guía: son tuyas.'), 'ficha: la nota de pronóstico se parte por «Dosis y progresión»');
  }

  // ── Orientativa: matriz comparativa (filas = criterios, no entidades), sin agrupación ──
  ({ w, d, errs } = nueva());
  entrarLumbar(d);
  click(btn(d, 'Bisagra y árbol')); click(btn(d, 'Inespecífico'));
  ok(titulo(d) === 'Inespecífico', 'orientativa: se llega desde el nodo 4 del árbol');
  t = txt(d);
  ok(data.ORIENTATIVA.filas.every(f => f.every(c => t.includes(norm(c)) || c === '')), 'orientativa: las 7 filas (criterios) completas, las 3 columnas');
  ok(t.includes('Discogénico 39') && t.includes('Facetario 15') && t.includes('Sacroilíaco 15'), 'orientativa: cabecera con los tres síndromes y sus porcentajes');
  ok(t.includes(norm(data.ORIENTATIVA.nota)) && t.includes(norm(data.PRONOSTICO.pie)), 'orientativa: nota y pie');
  ok(!d.querySelector('.grupo') && !t.includes('Agrupación propia'), 'orientativa: sin agrupación (matriz genérica, no la pantalla de rigidez de hombro)');
  ok(errs.length === 0, 'orientativa: sin errores de JS');

  // ── Sin almacenamiento ──
  ok(w.sessionStorage.length === 0 && w.localStorage.length === 0, 'no guarda nada en el navegador');
  console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
  process.exit(fails ? 1 : 0);
})();
