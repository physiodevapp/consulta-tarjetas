// La SPA usa <región>.data.json, que sale de tarjeta_<región>.js (la fuente de verdad)
// y de spa_<región>.js (el cableado propio de la SPA).
// Este test comprueba tres cosas por región:
//   1. el JSON coincide celda a celda con la tarjeta
//   2. el JSON del repo está al día (es lo que da hoy npm run extraer)
//   3. los campos propios de la SPA apuntan a filas que existen en la tarjeta
const fs = require('fs'), path = require('path');
const { leer } = require('./extraer-js');
const { datosDeRegion, aJSON } = require('./datos');

const REGIONES = ['hombro', 'cadera', 'lumbar'];   // al añadir una región, aquí

const cel = v => Array.isArray(v) ? v.join('\n') : (v && typeof v === 'object' && v.span !== undefined ? v.span : String(v == null ? '' : v));
const n = s => cel(s).replace(/\s+/g, ' ').trim();
let comparaciones = 0, fallos = 0;
const mal = m => { fallos++; console.log('FALLO:', m); };
const eq = (a, b, et) => { comparaciones++; if (n(a) !== n(b)) mal(`${et}\n  .js  : ${n(a).slice(0, 160)}\n  json : ${n(b).slice(0, 160)}`); };
const filas = (a, b, et) => { comparaciones++; if (a.length !== b.length) mal(`número de filas en ${et}: ${a.length} vs ${b.length}`); };
const existe = (v, lista, et) => { comparaciones++; if (!lista.includes(v)) mal(`${et}: «${v}» no está en la tarjeta (hay: ${lista.join(', ')})`); };

for (const region of REGIONES) {
  const tarjeta = path.join(__dirname, `tarjeta_${region}.js`);
  const archivo = path.join(__dirname, `${region}.data.json`);
  const capturado = leer(tarjeta);
  const js = capturado.CONTENIDO, { SPLIT_A, SPLIT_B } = capturado.CONFIG;
  const dx = JSON.parse(fs.readFileSync(archivo, 'utf8'));

  // ── 1. celda a celda contra la tarjeta ──
  filas(js.BANDERAS.filas, dx.BANDERAS.filas, 'BANDERAS'); filas(js.ARBOL.filas, dx.ARBOL.filas, 'ARBOL');
  filas(js.SINDROMES.filas, dx.SINDROMES.filas, 'SINDROMES'); filas(js.PRONOSTICO.filas, dx.PRONOSTICO.filas, 'PRONOSTICO');
  js.BANDERAS.filas.forEach((f, i) => f.forEach((c, j) => eq(c, dx.BANDERAS.filas[i][j], `BANDERAS[${i}][${j}]`)));
  eq(js.BANDERAS.titulo, dx.BANDERAS.titulo, 'BANDERAS.titulo'); eq(js.BANDERAS.nota, dx.BANDERAS.nota, 'BANDERAS.nota');
  ['pregunta', 'ramas', 'apoyo'].forEach(k => eq(js.BISAGRA[k], dx.BISAGRA[k], 'BISAGRA.' + k));
  js.ARBOL.filas.forEach((f, i) => { eq(f[0], dx.ARBOL.filas[i][0], 'ARBOL nodo ' + i); eq(f[1], dx.ARBOL.filas[i][1], `ARBOL[${f[0]}]`); });
  eq(js.SINDROMES.aviso, dx.SINDROMES.aviso, 'SINDROMES.aviso'); eq(js.SINDROMES.nota, dx.SINDROMES.nota, 'SINDROMES.nota');
  js.SINDROMES.filas.forEach((f, i) => f.forEach((c, j) => eq(c, dx.SINDROMES.filas[i][j], `SINDROMES[${f[0]}][${j}]`)));
  js.PRONOSTICO.filas.forEach((f, i) => f.forEach((c, j) => eq(c, dx.PRONOSTICO.filas[i][j], `PRONOSTICO[${f[0]}][${j}]`)));
  eq(js.PRONOSTICO.titulo, dx.PRONOSTICO.titulo, 'PRONOSTICO.titulo'); eq(js.PRONOSTICO.nota, dx.PRONOSTICO.nota, 'PRONOSTICO.nota');
  ['BANDERAS', 'PRONOSTICO'].forEach(k => eq(js[k].cabecera.join('|'), dx[k].cabecera.join('|'), k + '.cabecera'));
  if (js.URGENCIA) {
    comparaciones++; if (!dx.URGENCIA) mal('falta URGENCIA en el JSON');
    else { eq(js.URGENCIA.titulo, dx.URGENCIA.titulo, 'URGENCIA.titulo'); eq(js.URGENCIA.lineas.join('\n'), dx.URGENCIA.lineas.join('\n'), 'URGENCIA.lineas'); }
  }
  if (js.ORIENTATIVA) {
    filas(js.ORIENTATIVA.filas, dx.ORIENTATIVA.filas, 'ORIENTATIVA');
    js.ORIENTATIVA.filas.forEach((f, i) => f.forEach((c, j) => eq(c, dx.ORIENTATIVA.filas[i][j], `ORIENTATIVA[${f[0]}][${j}]`)));
    eq(js.ORIENTATIVA.titulo, dx.ORIENTATIVA.titulo, 'ORIENTATIVA.titulo'); eq(js.ORIENTATIVA.nota, dx.ORIENTATIVA.nota, 'ORIENTATIVA.nota');
    eq(js.ORIENTATIVA.cabecera.join('|'), dx.ORIENTATIVA.cabecera.join('|'), 'ORIENTATIVA.cabecera');
  }
  // la SPA llama TITULOS.pieA2 al pie de la cara A y PRONOSTICO.pie al de la cara B;
  // si la cara va partida (SPLIT_A/SPLIT_B), el pie de la tarjeta es pieA2/pieC, no pieA/pieB
  eq(SPLIT_A ? js.TITULOS.pieA2 : js.TITULOS.pieA, dx.TITULOS.pieA2, 'pie de la cara A');
  eq(SPLIT_B ? js.TITULOS.pieC : js.TITULOS.pieB, dx.PRONOSTICO.pie, 'pie de la cara B');

  // ── 2. el JSON del repo está al día ──
  comparaciones++;
  if (fs.readFileSync(archivo, 'utf8') !== aJSON(datosDeRegion(tarjeta))) mal(`${region}.data.json no está al día: pasa npm run extraer`);

  // ── 3. los campos propios de la SPA nombran filas que existen ──
  const sindromes = dx.SINDROMES.filas.map(f => f[0]);
  const pronosticos = dx.PRONOSTICO.filas.map(f => f[0]);
  const nodos = dx.ARBOL.filas.map(f => f[0]);
  const orientativa = dx.ORIENTATIVA ? dx.ORIENTATIVA.filas.map(f => f[0]) : [];
  const texto = Object.fromEntries(dx.ARBOL.filas);

  Object.entries(dx.ENLACES || {}).forEach(([nodo, e]) => {
    existe(nodo, nodos, 'ENLACES: nodo');
    (e.botones || []).forEach(b => {
      if (b.pantalla === 'sindrome') existe(b.fila, sindromes, `ENLACES[${nodo}] → ficha`);
      else { comparaciones++; if (!['banderas', 'orientativa'].includes(b.pantalla)) mal(`ENLACES[${nodo}]: pantalla desconocida «${b.pantalla}»`); }
    });
    Object.entries(e.patrones || {}).forEach(([etiqueta, clave]) => {
      existe(clave, sindromes, `ENLACES[${nodo}] patrón → ficha`);
      comparaciones++; if (!texto[nodo].includes(etiqueta)) mal(`ENLACES[${nodo}]: la etiqueta «${etiqueta}» no está en el texto del nodo`);
    });
  });
  // PRONOSTICO_DE puede mapear una síndrome a null: la tarjeta no le da pronóstico
  // (no todas las síndromes lo tienen; no es un despiste, no hay que exigirle fila)
  Object.entries(dx.PRONOSTICO_DE || {}).forEach(([s, p]) => { existe(s, sindromes, 'PRONOSTICO_DE: síndrome'); if (p !== null) existe(p, pronosticos, 'PRONOSTICO_DE: pronóstico'); });
  sindromes.forEach(s => { const p = (dx.PRONOSTICO_DE || {})[s]; if (p !== null) existe(p || s, pronosticos, `pronóstico de «${s}»`); });
  Object.keys(dx.FICHAS || {}).forEach(s => existe(s, sindromes, 'FICHAS'));
  const G = dx.ORIENTATIVA_GRUPOS;
  if (G) {
    G.grupos.forEach(g => {
      (g.filas || []).forEach(f => existe(f, orientativa, 'ORIENTATIVA_GRUPOS'));
      if (g.enlace && g.enlace.pantalla === 'sindrome') existe(g.enlace.fila, sindromes, 'ORIENTATIVA_GRUPOS: enlace');
    });
    Object.entries(G.dice || {}).forEach(([f, frase]) => {
      existe(f, orientativa, 'ORIENTATIVA_GRUPOS.dice');
      const fila = dx.ORIENTATIVA.filas.find(x => x[0] === f);
      comparaciones++; if (fila && !fila[1].includes(frase)) mal(`ORIENTATIVA_GRUPOS.dice[${f}]: «${frase}» no está literal en la tarjeta`);
    });
  }
  if (dx.CORTE_NOTA) { comparaciones++; if (!dx.PRONOSTICO.nota.includes(dx.CORTE_NOTA)) mal(`CORTE_NOTA: «${dx.CORTE_NOTA}» no está en PRONOSTICO.nota`); }
}

console.log(fallos ? `${fallos} FALLOS de ${comparaciones} comparaciones` : `TODO OK (${comparaciones} comparaciones, 0 diferencias)`);
process.exit(fallos ? 1 : 0);
