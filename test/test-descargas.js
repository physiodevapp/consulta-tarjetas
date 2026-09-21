// Documentos descargables (ficha de primera visita, guía rápida, formularios previos):
// propios de la SPA, no del CONTENIDO clínico (decisión 2). Viven en descargas/, publicado
// por GitHub Pages junto a index.html, con rutas relativas (decisión 9).
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
const { nombre: APP } = JSON.parse(fs.readFileSync(path.join(RAIZ, 'app.json'), 'utf8'));
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALLO:', m); } else console.log('ok:', m); };
const wait = ms => new Promise(r => setTimeout(r, ms));

function nueva() {
  const errs = [];
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true,
    beforeParse(w) { w.scrollTo = () => {}; w.scrollBy = () => {}; w.addEventListener('error', e => errs.push(e.message)); w.console.error = (...a) => errs.push(a.join(' ')); } });
  return { w: dom.window, d: dom.window.document, errs };
}
const btn = (d, t) => [...d.querySelectorAll('#main button')].find(b => b.textContent.includes(t));
const click = b => { if (!b) throw new Error('botón no encontrado'); b.click(); };

(async () => {
  const { d, errs } = nueva();

  // La entrada desde el selector no cuenta como una región más (clase distinta de .nav)
  const filasSelector = [...d.querySelectorAll('#main .nav, #main .nav.pendiente')];
  ok(filasSelector.length === 6, 'selector: sigue habiendo exactamente seis filas de región (la entrada a documentos no es .nav)');
  const entrada = [...d.querySelectorAll('#main .doc')].find(e => e.textContent.includes('Formularios, ficha y guía rápida'));
  ok(entrada && entrada.tagName === 'BUTTON', 'selector: hay un botón a los documentos, con clase propia');

  click(entrada);
  ok(d.querySelector('#titulo').textContent === 'Documentos' && d.title === APP + ' · Documentos', 'documentos: título de la pantalla y de la pestaña');
  ok(!d.querySelector('#back').hidden, 'documentos: botón atrás visible (no es una pantalla "home")');
  ok(d.querySelector('#regionCab').hidden, 'documentos: sin nombre de región en la cabecera (no es de ninguna región, y no hay ninguna elegida)');

  const enlaces = [...d.querySelectorAll('#main a.doc')];
  ok(enlaces.length === 8, 'documentos: ocho enlaces (ficha + guía rápida + 6 formularios previos): ' + enlaces.length);
  ok(enlaces.every(a => a.hasAttribute('download')), 'documentos: los ocho enlaces llevan download (se descargan, no navegan)');

  const hrefs = enlaces.map(a => a.getAttribute('href'));
  const esperados = ['descargas/ficha_primera_visita.docx', 'descargas/guia_rapida.docx',
    ...['cervical', 'lumbar', 'hombro', 'cadera', 'rodilla', 'tobillo_pie'].map(r => `descargas/formulario_previo_${r}.docx`)];
  ok(hrefs.join('|') === esperados.join('|'), 'documentos: rutas relativas, en el orden de REGIONES: ' + hrefs.join(', '));
  ok(hrefs.every(h => !h.startsWith('/') && !h.startsWith('http')), 'documentos: todas las rutas son relativas (sin "/" inicial), como el manifest y el service worker');

  for (const href of hrefs) {
    ok(fs.existsSync(path.join(RAIZ, href)), 'documentos: existe el archivo publicado ' + href);
  }

  d.querySelector('#back').click();
  await wait(50);
  ok(d.querySelector('#titulo').textContent === APP && d.title === APP, 'atrás desde documentos: vuelve al selector');

  ok(errs.length === 0, 'sin errores de JS: ' + errs.join(' / '));
  console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
  process.exit(fails ? 1 : 0);
})();
