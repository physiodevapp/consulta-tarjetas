// URGENCIA es opcional (hombro no la tiene; las cuatro regiones nuevas sí, tarea 4).
// Este test prueba el componente genérico con una región sintética, sin esperar a que
// haya una región real publicada: mismos datos de hombro + URGENCIA añadida a mano.
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALLO:', m); } else console.log('ok:', m); };
const norm = s => s.replace(/\s+/g, ' ').trim();

const plantilla = fs.readFileSync(path.join(__dirname, 'plantilla.html'), 'utf8');

function nueva(datos) {
  const data = JSON.stringify(datos).replace(/</g, '<\\/');
  const html = plantilla.replace('__TITULO__', 'Consulta ' + datos.REGION).replace('__DATA__', data);
  const errs = [];
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true,
    beforeParse(w) { w.scrollTo = () => {}; w.addEventListener('error', e => errs.push(e.message)); w.console.error = (...a) => errs.push(a.join(' ')); } });
  return { d: dom.window.document, errs };
}

// ── Con URGENCIA (región sintética) ──
const conUrgencia = JSON.parse(fs.readFileSync(path.join(__dirname, 'hombro.data.json'), 'utf8'));
conUrgencia.URGENCIA = { titulo: 'URGENCIA DE PRUEBA', lineas: ['Primera línea de aviso.', 'Segunda línea, con datos.'] };
{
  const { d, errs } = nueva(conUrgencia);
  const main = d.querySelector('#main');
  const caja = main.querySelector('.urgencia');
  ok(!!caja, 'home: la caja de URGENCIA está en pantalla');
  ok(main.firstElementChild === caja, 'home: URGENCIA es lo primero que se ve al entrar en la región');
  const t = norm(main.textContent);
  ok(t.includes('URGENCIA DE PRUEBA'), 'home: título de URGENCIA literal');
  ok(t.includes('Primera línea de aviso.') && t.includes('Segunda línea, con datos.'), 'home: líneas de URGENCIA literales, sin resumir');
  ok(errs.length === 0, 'sin errores de JS: ' + errs.join(' / '));
}

// ── Criterio visual: borde grueso, sin colores de alarma (decisión 7 y 8 de CLAUDE.md) ──
ok(/\.card\.urgencia\s*\{[^}]*border:\s*3px\s+solid\s+var\(--ink\)/.test(plantilla), 'CSS: borde grueso con --ink, como en el papel');
ok(!/\.card\.urgencia[^}]*\{[^}]*(red|#f00\b|#ff0000)/i.test(plantilla), 'CSS: sin rojo en la caja de URGENCIA');

// ── Sin URGENCIA (como hombro hoy): la caja no aparece ──
{
  const sinUrgencia = JSON.parse(fs.readFileSync(path.join(__dirname, 'hombro.data.json'), 'utf8'));
  const { d, errs } = nueva(sinUrgencia);
  ok(!d.querySelector('#main').querySelector('.urgencia'), 'home sin URGENCIA (hombro): no aparece la caja');
  ok(errs.length === 0, 'sin errores de JS: ' + errs.join(' / '));
}

console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
process.exit(fails ? 1 : 0);
