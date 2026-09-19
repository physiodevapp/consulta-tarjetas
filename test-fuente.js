// La SPA de hombro usa hombro.data.json (extraído del docx con extraer.py).
// Este test comprueba que coincide, celda a celda, con tarjeta_hombro.js (la fuente de verdad).
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');

const tmp = path.join(os.tmpdir(), 'hombro-fuente-' + process.pid + '.json');
execFileSync('node', [path.join(__dirname, 'extraer-js.js'), path.join(__dirname, 'tarjeta_hombro.js'), tmp], { stdio: 'pipe' });
const js = JSON.parse(fs.readFileSync(tmp, 'utf8')).CONTENIDO;
fs.unlinkSync(tmp);
const dx = JSON.parse(fs.readFileSync(path.join(__dirname, 'hombro.data.json'), 'utf8'));

const cel = v => Array.isArray(v) ? v.join('\n') : (v && typeof v === 'object' && v.span !== undefined ? v.span : String(v == null ? '' : v));
const n = s => cel(s).replace(/\s+/g, ' ').trim();
let comparaciones = 0, fallos = 0;
const eq = (a, b, et) => { comparaciones++; if (n(a) !== n(b)) { fallos++; console.log('FALLO en', et, '\n  .js  :', n(a).slice(0, 160), '\n  json :', n(b).slice(0, 160)); } };
const filas = (a, b, et) => { comparaciones++; if (a.length !== b.length) { fallos++; console.log('FALLO: número de filas en', et, a.length, 'vs', b.length); } };

filas(js.BANDERAS.filas, dx.BANDERAS.filas, 'BANDERAS'); filas(js.ARBOL.filas, dx.ARBOL.filas, 'ARBOL');
filas(js.SINDROMES.filas, dx.SINDROMES.filas, 'SINDROMES'); filas(js.ORIENTATIVA.filas, dx.ORIENTATIVA.filas, 'ORIENTATIVA'); filas(js.PRONOSTICO.filas, dx.PRONOSTICO.filas, 'PRONOSTICO');
js.BANDERAS.filas.forEach((f, i) => f.forEach((c, j) => eq(c, dx.BANDERAS.filas[i][j], `BANDERAS[${i}][${j}]`)));
eq(js.BANDERAS.nota, dx.BANDERAS.nota, 'BANDERAS.nota');
['pregunta', 'ramas', 'apoyo'].forEach(k => eq(js.BISAGRA[k], dx.BISAGRA[k], 'BISAGRA.' + k));
js.ARBOL.filas.forEach((f, i) => { eq(f[0], dx.ARBOL.filas[i][0], 'ARBOL nodo ' + i); eq(f[1], dx.ARBOL.filas[i][1], `ARBOL[${f[0]}]`); });
eq(js.SINDROMES.aviso, dx.SINDROMES.aviso, 'SINDROMES.aviso'); eq(js.SINDROMES.nota, dx.SINDROMES.nota, 'SINDROMES.nota');
js.SINDROMES.filas.forEach((f, i) => f.forEach((c, j) => eq(c, dx.SINDROMES.filas[i][j], `SINDROMES[${f[0]}][${j}]`)));
js.ORIENTATIVA.filas.forEach((f, i) => f.forEach((c, j) => eq(c, dx.ORIENTATIVA.filas[i][j], `ORIENTATIVA[${f[0]}][${j}]`)));
eq(js.ORIENTATIVA.nota, dx.ORIENTATIVA.nota, 'ORIENTATIVA.nota');
js.PRONOSTICO.filas.forEach((f, i) => f.forEach((c, j) => eq(c, dx.PRONOSTICO.filas[i][j], `PRONOSTICO[${f[0]}][${j}]`)));
eq(js.PRONOSTICO.nota, dx.PRONOSTICO.nota, 'PRONOSTICO.nota');
['BANDERAS', 'ORIENTATIVA', 'PRONOSTICO'].forEach(k => eq(js[k].cabecera.join('|'), dx[k].cabecera.join('|'), k + '.cabecera'));
// la SPA llama TITULOS.pieA2 a lo que el .js llama TITULOS.pieA, y PRONOSTICO.pie a TITULOS.pieB
eq(js.TITULOS.pieA, dx.TITULOS.pieA2, 'pie de la cara A'); eq(js.TITULOS.pieB, dx.PRONOSTICO.pie, 'pie de la cara B');

console.log(fallos ? `${fallos} FALLOS de ${comparaciones} comparaciones` : `TODO OK (${comparaciones} comparaciones, 0 diferencias)`);
process.exit(fallos ? 1 : 0);
