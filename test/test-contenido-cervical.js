// Tarea 4 · cervical: el texto en pantalla coincide con el de su tarjeta. Ningún nodo de
// cervical reparte un patrón limpio en una sola línea (a diferencia de hombro y del nodo 4
// de lumbar): los cuatro nodos con destino van por `botones` fijos. El nodo 5b enlaza a la
// tabla orientativa (para «cefalea primaria», que no tiene ficha propia) además de a dos
// fichas; el nodo 6 tiene tres sub-patrones que son la MISMA ficha (un solo botón).
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'cervical.data.json'), 'utf8'));
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
// btn() exige coincidencia EXACTA del título del botón: «Cefalea» y «Cefalea cervicogénica»
// son botones distintos en el mismo nodo, y .includes() los confundiría.
const btns = d => [...d.querySelectorAll('#main button')];
const btn = (d, t) => btns(d).find(b => { const n = b.querySelector('b'); return n && n.textContent === t; });
const click = b => { if (!b) throw new Error('botón no encontrado'); b.click(); };
const entrarCervical = d => click(btn(d, 'Cervical'));

(async () => {
  // ── Home: URGENCIA (disfunción arterial, traumatismo, cefalea de alarma) ──
  let { w, d, errs } = nueva();
  entrarCervical(d);
  ok(titulo(d) === 'Cervical', 'home: título');
  ok(d.querySelector('#main').firstElementChild.classList.contains('urgencia'), 'home: URGENCIA es lo primero que se ve');
  let t = txt(d);
  ok(t.includes(norm(data.URGENCIA.titulo)) && data.URGENCIA.lineas.every(l => t.includes(norm(l))), 'home: URGENCIA con título y líneas literales');

  // ── Banderas: 3 columnas, 9 filas ──
  click(btn(d, 'Banderas rojas de la región'));
  t = txt(d);
  const faltan = [];
  data.BANDERAS.filas.forEach(f => f.forEach(c => { if (!t.includes(norm(c))) faltan.push(c.slice(0, 30)); }));
  ok(faltan.length === 0, 'banderas: las 9 filas completas' + faltan.join('|'));
  ok(t.includes(norm(data.BANDERAS.nota)) && t.includes(norm(data.TITULOS.pieA2)), 'banderas: nota y pie');
  d.querySelector('#back').click(); await wait(50);

  // ── Árbol: bisagra, 8 nodos, texto completo (sin recortar) de los nodos con dos líneas ──
  click(btn(d, 'Bisagra y árbol'));
  t = txt(d);
  ok(t.includes(norm(data.BISAGRA.pregunta)) && t.includes(norm(data.BISAGRA.apoyo)), 'árbol: bisagra completa');
  ok(['1', '2', '3', '3b', '4', '5', '5b', '6'].every(n => [...d.querySelectorAll('.nodo .n')].some(e => e.textContent === n)), 'árbol: los 8 nodos de cervical');
  ok(t.includes(norm(data.ARBOL.filas.find(f => f[0] === '5b')[1])), 'árbol: nodo 5b, las dos líneas literales (sin recortar; sin patrones limpios)');
  ok(t.includes(norm(data.ARBOL.filas.find(f => f[0] === '6')[1])), 'árbol: nodo 6, texto completo con los tres sub-patrones');
  const accs = btns(d).map(b => b.querySelector('b') && b.querySelector('b').textContent).filter(Boolean);
  const sindromes = data.SINDROMES.filas.map(f => f[0]);
  ok(sindromes.every(s => accs.includes(s)), 'árbol: las 6 fichas de síndrome alcanzables: ' + accs.join(' | '));
  ok(accs.includes('Cefalea') && accs.filter(a => a === 'Cefalea').length === 1, 'árbol: un solo acceso a la orientativa (cefalea primaria), distinto de «Cefalea cervicogénica»');
  ok(accs.filter(a => a === 'Idiopático').length === 1, 'árbol: un solo botón a Idiopático desde el nodo 6 (los tres sub-patrones son la misma ficha)');

  // ── Las 6 fichas: contenido literal, pronóstico, y la nota (solo en las dos de ULNT1) ──
  const mapa = { 'Latigazo (WAD)': 'Latigazo' };
  for (const f of data.SINDROMES.filas) {
    const inst = nueva();
    entrarCervical(inst.d);
    click(btn(inst.d, 'Bisagra y árbol')); click(btn(inst.d, f[0]));
    const tt = txt(inst.d);
    ok(titulo(inst.d) === f[0], 'ficha ' + f[0] + ': título');
    ok(f.slice(1).every(c => tt.includes(norm(c))), 'ficha ' + f[0] + ': contenido idéntico a la tarjeta');
    ok(tt.includes(norm(data.SINDROMES.aviso)), 'ficha ' + f[0] + ': aviso');
    const debeNota = f[0] === 'Dolor radicular' || f[0] === 'Radiculopatía';
    ok(debeNota === tt.includes(norm(data.SINDROMES.nota)), 'ficha ' + f[0] + ': nota (referido vs. radicular) solo en dolor radicular y radiculopatía');
    const claveP = mapa[f[0]] || f[0];
    const pr = data.PRONOSTICO.filas.find(x => x[0] === claveP);
    ok(!!pr, 'ficha ' + f[0] + ': tiene fila de pronóstico (' + claveP + ')');
    ok(tt.includes('Bloque 6 · horizonte y criterio') && [pr[1], pr[2]].every(c => tt.includes(norm(c))), 'ficha ' + f[0] + ': pronóstico completo');
    ok(inst.errs.length === 0, 'ficha ' + f[0] + ': sin errores');
  }

  // Cefalea cervicogénica: única ficha con enlace a la orientativa (diferencial)
  {
    const inst = nueva();
    entrarCervical(inst.d);
    click(btn(inst.d, 'Bisagra y árbol')); click(btn(inst.d, 'Cefalea cervicogénica'));
    ok(!!btn(inst.d, 'Diferencial: cefalea'), 'ficha Cefalea cervicogénica: botón al diferencial (orientativa)');
    click(btn(inst.d, 'Diferencial: cefalea'));
    ok(titulo(inst.d) === 'Cefalea', 'cefalea cervicogénica → diferencial: llega a la orientativa');
  }
  {
    const inst = nueva();
    entrarCervical(inst.d);
    click(btn(inst.d, 'Bisagra y árbol')); click(btn(inst.d, 'Idiopático'));
    ok(!btn(inst.d, 'Diferencial: cefalea'), 'otras fichas no llevan el botón del diferencial de cefalea');
  }

  // ── Orientativa: matriz Migraña / Tensional / Cervicogénica, sin agrupación ──
  ({ w, d, errs } = nueva());
  entrarCervical(d);
  click(btn(d, 'Bisagra y árbol')); click(btn(d, 'Cefalea'));
  ok(titulo(d) === 'Cefalea', 'orientativa: se llega desde el nodo 5b del árbol');
  t = txt(d);
  ok(data.ORIENTATIVA.filas.every(f => f.every(c => t.includes(norm(c)))), 'orientativa: las 6 filas (rasgos) completas, las 3 columnas');
  ok(t.includes('Migraña') && t.includes('Tensional') && t.includes('Cervicogénica'), 'orientativa: cabecera con los tres tipos de cefalea');
  ok(t.includes(norm(data.ORIENTATIVA.nota)) && t.includes(norm(data.PRONOSTICO.pie)), 'orientativa: nota y pie');
  ok(!d.querySelector('.grupo') && !t.includes('Agrupación propia'), 'orientativa: sin agrupación (matriz genérica)');
  ok(errs.length === 0, 'orientativa: sin errores de JS');

  // ── Sin almacenamiento ──
  ok(w.sessionStorage.length === 0 && w.localStorage.length === 0, 'no guarda nada en el navegador');
  console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
  process.exit(fails ? 1 : 0);
})();
