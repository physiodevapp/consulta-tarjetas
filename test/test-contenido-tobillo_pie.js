// Tobillo y pie: el texto en pantalla coincide con el de su tarjeta. La región más densa
// (21 síndromes + 15 entidades de ORIENTATIVA), sin ningún nodo con el patrón limpio de una
// línea (a diferencia de hombro y del nodo 4 de lumbar: aquí el nodo 4 tiene un «→» anidado
// dentro de un paréntesis y el nodo 5 reparte un destino a dos fichas con «o» en vez de «·»,
// así que ninguno usa `patrones`), sin SINDROMES.nota (a diferencia de las otras cinco
// regiones), con tres filas { span } (derivación sin ①②: Rotura del Aquiles, Lisfranc,
// Fracturas del pie) y con ORIENTATIVA agrupada por localización, como en rodilla.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'tobillo_pie.data.json'), 'utf8'));
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALLO:', m); } else console.log('ok:', m); };
const norm = s => s.replace(/\s+/g, ' ').trim();
const wait = ms => new Promise(r => setTimeout(r, ms));

function nueva() {
  const errs = [];
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true,
    beforeParse(w) { w.scrollTo = () => {}; w.scrollBy = () => {}; w.addEventListener('error', e => errs.push(e.message)); w.console.error = (...a) => errs.push(a.join(' ')); } });
  return { w: dom.window, d: dom.window.document, errs };
}
const txt = d => norm(d.querySelector('#main').textContent);
const titulo = d => d.querySelector('#titulo').textContent;
// btn() exige coincidencia EXACTA: varias fichas se alcanzan desde más de un nodo.
const btns = d => [...d.querySelectorAll('#main button')];
const btn = (d, t) => btns(d).find(b => { const n = b.querySelector('b'); return n && n.textContent === t; });
const click = b => { if (!b) throw new Error('botón no encontrado'); b.click(); };
const entrar = d => click(btn(d, 'Tobillo y pie'));

// Fila de SINDROMES -> fila de PRONOSTICO (mapa no trivial: filas combinadas y tres
// síndromes sin fila propia), la misma correspondencia que en spa_tobillo_pie.js.
const PRONOSTICO_DE = {
  'Esguince lateral agudo': 'Esguince lateral',
  'Rotura del Aquiles': 'Aquiles roto · Lisfranc · fracturas',
  'Lisfranc': 'Aquiles roto · Lisfranc · fracturas',
  'Fracturas del pie (5.º MT, calcáneo)': 'Aquiles roto · Lisfranc · fracturas',
  'Luxación del tibial posterior': null,
  'Aquiles porción media': 'Aquiles (media, insercional, vaina, plantar)',
  'Aquiles insercional': 'Aquiles (media, insercional, vaina, plantar)',
  'Vaina del Aquiles': 'Aquiles (media, insercional, vaina, plantar)',
  'Plantar delgado': 'Aquiles (media, insercional, vaina, plantar)',
  'Nervio sural': 'Nervios (sural, túnel del tarso, talón)',
  'Bursa calcánea superficial': null,
  'Túnel del tarso': 'Nervios (sural, túnel del tarso, talón)',
  'Estrés del tobillo (maléolo medial, astrágalo, calcáneo)': 'Fracturas de estrés',
  'Seno del tarso': 'Seno del tarso · sinovitis · pinzamiento anterior',
  'Pinzamiento anterior': 'Seno del tarso · sinovitis · pinzamiento anterior',
  'Referido lumbar': null
};

(async () => {
  // ── Home: URGENCIA (compartimental/neurovascular, artritis infecciosa, Aquiles, Ottawa) ──
  let { w, d, errs } = nueva();
  entrar(d);
  ok(titulo(d) === 'Tobillo y pie', 'home: título');
  ok(d.querySelector('#main').firstElementChild.classList.contains('urgencia'), 'home: URGENCIA es lo primero que se ve');
  let t = txt(d);
  ok(t.includes(norm(data.URGENCIA.titulo)) && data.URGENCIA.lineas.every(l => t.includes(norm(l))), 'home: URGENCIA con título y las 4 líneas literales (incluido Ottawa)');

  // ── Banderas: 3 columnas, 12 filas ──
  click(btn(d, 'Banderas rojas de la región'));
  t = txt(d);
  const faltan = [];
  data.BANDERAS.filas.forEach(f => f.forEach(c => { if (!t.includes(norm(c))) faltan.push(c.slice(0, 30)); }));
  ok(faltan.length === 0, 'banderas: las 12 filas completas ' + faltan.join('|'));
  ok(t.includes(norm(data.BANDERAS.nota)) && t.includes(norm(data.TITULOS.pieA2)), 'banderas: nota y pie (cara A2, SPLIT_A)');
  d.querySelector('#back').click(); await wait(50);

  // ── Árbol: bisagra, 8 nodos, nodos 7 y 8 con sus dos líneas literales ──
  click(btn(d, 'Bisagra y árbol'));
  t = txt(d);
  ok(t.includes(norm(data.BISAGRA.pregunta)) && t.includes(norm(data.BISAGRA.apoyo)), 'árbol: bisagra completa');
  ok(t.includes(norm(data.BISAGRA.nota)), 'árbol: bisagra, nota de que la guía no la nombra');
  ok(['1', '2', '3', '4', '5', '6', '7', '8'].every(n => [...d.querySelectorAll('.nodo .n')].some(e => e.textContent === n)), 'árbol: los 8 nodos de tobillo y pie');
  ok(t.includes(norm(data.ARBOL.filas.find(f => f[0] === '7')[1][0])) && t.includes(norm(data.ARBOL.filas.find(f => f[0] === '7')[1][1])), 'árbol: nodo 7, las dos líneas literales (posterior, y medial/lateral/anterior)');
  ok(t.includes(norm(data.ARBOL.filas.find(f => f[0] === '8')[1][0])) && t.includes(norm(data.ARBOL.filas.find(f => f[0] === '8')[1][1])), 'árbol: nodo 8, las dos líneas literales (localización, y dolor vago)');
  const accs = btns(d).map(b => b.querySelector('b') && b.querySelector('b').textContent).filter(Boolean);
  const sindromes = data.SINDROMES.filas.map(f => f[0]);
  ok(sindromes.every(s => accs.includes(s)), 'árbol: las 21 fichas de síndrome alcanzables: ' + sindromes.filter(s => !accs.includes(s)).join(' | '));
  // Repetidas desde más de un nodo (como Menisco/LCP en rodilla)
  ok(accs.filter(a => a === 'Lisfranc').length === 2, 'árbol: Lisfranc alcanzable desde los nodos 3 y 8');
  ok(accs.filter(a => a === 'Fracturas del pie (5.º MT, calcáneo)').length === 2, 'árbol: Fracturas del pie alcanzable desde los nodos 3 y 8');
  ok(accs.filter(a => a === 'Sindesmosis').length === 2, 'árbol: Sindesmosis alcanzable desde los nodos 4 y 8');
  ok(accs.filter(a => a === 'Estrés del tobillo (maléolo medial, astrágalo, calcáneo)').length === 2, 'árbol: Estrés del tobillo alcanzable desde los nodos 7 y 8');
  ok(accs.filter(a => a === data.ORIENTATIVA.titulo).length >= 4, 'árbol: la tabla orientativa se alcanza desde varios nodos (4, 5, 8)');

  // ── Las 21 fichas: contenido literal (incluidas las 3 con { span }, sin ①②) y pronóstico ──
  for (const f of data.SINDROMES.filas) {
    const inst = nueva();
    entrar(inst.d);
    click(btn(inst.d, 'Bisagra y árbol')); click(btn(inst.d, f[0]));
    const tt = txt(inst.d);
    ok(titulo(inst.d) === f[0], 'ficha ' + f[0] + ': título');
    const esSpan = f[2] && typeof f[2] === 'object' && f[2].span !== undefined;
    const celdasEsperadas = esSpan ? [f[1], f[2].span] : f.slice(1);
    ok(celdasEsperadas.every(c => tt.includes(norm(c))), 'ficha ' + f[0] + ': contenido idéntico a la tarjeta' + (esSpan ? ' (celda span combinada)' : ''));
    ok(tt.includes(norm(data.SINDROMES.aviso)), 'ficha ' + f[0] + ': aviso (glosario ETM/KTW/LPAA/LPC/LTPAI)');

    const clave = f[0] in PRONOSTICO_DE ? PRONOSTICO_DE[f[0]] : f[0];
    if (clave === null) {
      ok(!tt.includes('Bloque 6 · horizonte y criterio'), 'ficha ' + f[0] + ': sin fila de pronóstico en la tarjeta → sin plegable de bloque 6');
    } else {
      const pr = data.PRONOSTICO.filas.find(x => x[0] === clave);
      ok(!!pr, 'ficha ' + f[0] + ': tiene fila de pronóstico (' + clave + ')');
      ok(tt.includes('Bloque 6 · horizonte y criterio') && [pr[1], pr[2]].every(c => tt.includes(norm(c))), 'ficha ' + f[0] + ': pronóstico completo (' + clave + ')');
    }
    ok(inst.errs.length === 0, 'ficha ' + f[0] + ': sin errores');
  }

  // Esta región no trae SINDROMES.nota (a diferencia de las otras cinco): lo comprueba
  // directamente sobre el JSON, no hace falta abrir cada ficha otra vez
  ok(data.SINDROMES.nota === undefined, 'esta tarjeta no trae SINDROMES.nota, solo aviso (a diferencia de las otras cinco regiones)');

  // ── Orientativa: 4 grupos propios (talón plantar / mediopié / antepié / dolor vago) ──
  ({ w, d, errs } = nueva());
  entrar(d);
  click(btn(d, 'Bisagra y árbol')); click(btn(d, data.ORIENTATIVA.titulo));
  ok(titulo(d) === data.ORIENTATIVA.titulo, 'orientativa: se llega desde el árbol');
  t = txt(d);
  ok(data.ORIENTATIVA.filas.every(f => {
    const ultima = f[f.length - 1];
    const esSpan = ultima && typeof ultima === 'object' && ultima.span !== undefined;
    const cs = esSpan ? [f[1], ultima.span] : f.slice(1);
    return cs.every(c => t.includes(norm(c)));
  }), 'orientativa: las 15 entidades completas (incluida Gota, con { span })');
  const grupos = [...d.querySelectorAll('.grupo')].map(g => g.textContent);
  ok(grupos.join('|') === 'Talón plantar|Mediopié|Antepié|Dolor vago del tobillo', 'orientativa: agrupación propia por localización: ' + grupos.join('|'));
  ok(t.includes(norm(data.ORIENTATIVA.nota)) && t.includes(norm(data.PRONOSTICO.pie)), 'orientativa: nota y pie (cara C, SPLIT_B)');
  ok(t.includes('Agrupación propia'), 'orientativa: avisa de la agrupación propia');
  ok(errs.length === 0, 'orientativa: sin errores de JS');

  // ── Sin almacenamiento ──
  ok(w.sessionStorage.length === 0 && w.localStorage.length === 0, 'no guarda nada en el navegador');
  console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
  process.exit(fails ? 1 : 0);
})();
