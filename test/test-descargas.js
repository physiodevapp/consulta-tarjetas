// Documentos descargables (tarjetas de consulta, formularios previos, ficha de primera
// visita, guía rápida): propios de la SPA, no del CONTENIDO clínico (decisión 2). Viven en
// descargas/, publicado por GitHub Pages junto a index.html, con rutas relativas (decisión 9).
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

  // La entrada a documentos no cuenta como una región más en el selector (ni clase .nav):
  // vive en el botón #documentos de la cabecera (tarea 10), permanente en toda la SPA
  const filasSelector = [...d.querySelectorAll('#main .nav, #main .nav.pendiente')];
  ok(filasSelector.length === 6, 'selector: sigue habiendo exactamente seis filas de región (la entrada a documentos no es .nav)');
  const boton = d.querySelector('#documentos');
  ok(!!boton && !boton.hidden, 'selector: el botón de documentos está visible en la cabecera');

  click(boton);
  ok(d.querySelector('#titulo').textContent === 'Documentos' && d.title === APP + ' · Documentos', 'documentos: título de la pantalla y de la pestaña');
  ok(!d.querySelector('#back').hidden, 'documentos: botón atrás visible (no es una pantalla "home")');
  ok(d.querySelector('#regionCab').hidden, 'documentos: sin nombre de región en la cabecera (no es de ninguna región, y no hay ninguna elegida)');
  ok(d.querySelector('#documentos').hidden, 'documentos: el propio botón de la cabecera se oculta en su pantalla (como #back en home)');

  const enlaces = [...d.querySelectorAll('#main a.doc')];
  ok(enlaces.length === 14, 'documentos: catorce enlaces (6 tarjetas + 6 formularios previos + ficha + guía rápida): ' + enlaces.length);
  ok(enlaces.every(a => a.hasAttribute('download')), 'documentos: los catorce enlaces llevan download (se descargan, no navegan)');

  const grupos = [...d.querySelectorAll('#main h3.grupo')].map(g => g.textContent);
  ok(grupos.join('|') === 'Tarjetas de consulta|Formularios previos a la primera visita|Generales', 'documentos: tres grupos con su título, en ese orden: ' + grupos.join(', '));

  const hrefs = enlaces.map(a => a.getAttribute('href'));
  const REGIONES = ['cervical', 'lumbar', 'hombro', 'cadera', 'rodilla', 'tobillo_pie'];
  const esperados = [...REGIONES.map(r => `descargas/tarjeta_${r}.docx`),
    ...REGIONES.map(r => `descargas/formulario_previo_${r}.docx`),
    'descargas/ficha_primera_visita.docx', 'descargas/guia_rapida.docx'];
  ok(hrefs.join('|') === esperados.join('|'), 'documentos: rutas relativas, agrupadas y en el orden de REGIONES: ' + hrefs.join(', '));
  ok(hrefs.every(h => !h.startsWith('/') && !h.startsWith('http')), 'documentos: todas las rutas son relativas (sin "/" inicial), como el manifest y el service worker');

  // El subtítulo de cada tarjeta nombra sus caras (CARAS, derivado de SPLIT_A/SPLIT_B en
  // tools/datos.js): hombro/cervical/lumbar solo A y B; cadera suma C; rodilla y tobillo
  // y pie suman A2 y C. No es el mismo texto para las seis (ver tarea 8, addendum).
  const subsTarjetas = enlaces.slice(0, 6).map(a => a.querySelector('.tx span').textContent);
  const carasEsperadas = {
    cervical: 'Cara A y B, para imprimir', lumbar: 'Cara A y B, para imprimir', hombro: 'Cara A y B, para imprimir',
    cadera: 'Cara A, B y C, para imprimir',
    rodilla: 'Cara A, A2, B y C, para imprimir', tobillo_pie: 'Cara A, A2, B y C, para imprimir'
  };
  ok(subsTarjetas.join('|') === REGIONES.map(r => carasEsperadas[r]).join('|'),
    'documentos: el subtítulo de cada tarjeta nombra sus caras: ' + subsTarjetas.join(' / '));

  for (const href of hrefs) {
    ok(fs.existsSync(path.join(RAIZ, href)), 'documentos: existe el archivo publicado ' + href);
  }

  d.querySelector('#back').click();
  await wait(50);
  ok(d.querySelector('#titulo').textContent === APP && d.title === APP, 'atrás desde documentos: vuelve al selector');
  ok(!d.querySelector('#documentos').hidden, 'atrás desde documentos: el botón de la cabecera vuelve a verse en el selector');

  // También accesible desde dentro de una región, no solo desde el selector
  click(btn(d, 'Hombro'));
  ok(!d.querySelector('#documentos').hidden, 'dentro de una región: el botón de documentos sigue visible en la cabecera');
  click(d.querySelector('#documentos'));
  ok(d.querySelector('#titulo').textContent === 'Documentos', 'desde una región: el botón de la cabecera también lleva a documentos');

  ok(errs.length === 0, 'sin errores de JS: ' + errs.join(' / '));
  console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
  process.exit(fails ? 1 : 0);
})();
