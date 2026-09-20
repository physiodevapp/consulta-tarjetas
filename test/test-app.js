// El nombre de la app vive en una sola constante (app.json). De ahí salen el título de
// la pestaña, la cabecera del inicio (plantilla.html, vía build.py) y package.json; el
// manifest (task 5) también deberá leerlo. Este test falla si alguno se desincroniza.
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const RAIZ = path.join(__dirname, '..');
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALLO:', m); } else console.log('ok:', m); };

const { nombre } = JSON.parse(fs.readFileSync(path.join(RAIZ, 'app.json'), 'utf8'));
ok(typeof nombre === 'string' && nombre.length > 0, 'app.json: nombre no vacío');

// package.json: name es el slug del nombre; description lo lleva literal delante
const pkg = JSON.parse(fs.readFileSync(path.join(RAIZ, 'package.json'), 'utf8'));
const slug = nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
ok(pkg.name === slug, 'package.json: name es el slug de app.json'
  + (pkg.name === slug ? '' : ` («${pkg.name}» ≠ «${slug}»; actualízalo a mano)`));
ok(pkg.description.startsWith(nombre), 'package.json: description empieza por el nombre de app.json'
  + (pkg.description.startsWith(nombre) ? '' : ` (no empieza por «${nombre}»; actualízalo a mano)`));

// index.html: título de pestaña y cabecera del selector, ambos generados por build.py
const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
ok(html.includes(`<title>${nombre}</title>`), 'index.html: <title> es app.json.nombre (¿falta npm run build?)');

const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true,
  beforeParse(w) { w.scrollTo = () => {}; } });
const d = dom.window.document;
ok(d.title === nombre, 'selector: título de la pestaña en tiempo de ejecución');
ok(d.querySelector('#titulo').textContent === nombre, 'selector: cabecera del inicio');

console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
process.exit(fails ? 1 : 0);
