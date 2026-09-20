const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'hombro.data.json'), 'utf8'));
const { nombre: APP } = JSON.parse(fs.readFileSync(path.join(__dirname, 'app.json'), 'utf8'));
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
// El inicio es el selector de región (tarea 3); hombro es la única disponible hoy
const entrarHombro = d => click(btn(d, 'Hombro'));

(async () => {
  // ── Selector + Home ──
  let { w, d, errs } = nueva();
  ok(titulo(d) === APP && d.querySelector('#back').hidden, 'selector: título y sin botón atrás');
  ok(!!btn(d, 'Hombro') && d.querySelectorAll('#main .nav.pendiente').length === 1, 'selector: hombro disponible, 1 región pendiente (cadera, lumbar y cervical ya tienen datos)');
  entrarHombro(d);
  ok(titulo(d) === 'Hombro' && !d.querySelector('#back').hidden, 'home: título y con botón atrás (vuelve al selector)');
  ok(d.querySelectorAll('.nav').length === 2 && !txt(d).includes('Rigidez') && !txt(d).includes('Síndromes'), 'home: 2 accesos (banderas y árbol)');

  // ── Banderas + atrás ──
  click(btn(d, 'Banderas rojas'));
  ok(titulo(d) === 'Banderas rojas' && !d.querySelector('#back').hidden, 'banderas: título y atrás visible');
  let t = txt(d);
  const faltan = [];
  data.BANDERAS.filas.forEach(f => f.forEach(c => { if (!t.includes(norm(c))) faltan.push(c.slice(0, 30)); }));
  ok(faltan.length === 0 && t.includes(norm(data.BANDERAS.nota)) && t.includes(norm(data.TITULOS.pieA2)), 'banderas: todas las celdas, nota y pie' + faltan.join('|'));
  d.querySelector('#back').click(); await wait(50);
  ok(titulo(d) === 'Hombro', 'atrás vuelve a home (popstate)');

  // ── Árbol ──
  click(btn(d, 'Bisagra y árbol'));
  t = txt(d);
  ok(t.includes(norm(data.BISAGRA.pregunta)) && t.includes('capsulitis · artrosis GH · luxación bloqueada') && t.includes('NO → el resto de síndromes') && t.includes(norm(data.BISAGRA.apoyo)), 'árbol: bisagra completa');
  ok(['1', '2', '2b', '3', '4'].every(n => [...d.querySelectorAll('.nodo .n')].some(e => e.textContent === n)), 'árbol: nodos 1, 2, 2b, 3, 4');
  ok(t.includes('Sí → 2b') && t.includes('LUXACIÓN BLOQUEADA o FRACTURA → Rx') && t.includes('CERVICOGÉNICO'), 'árbol: texto de nodos 2, 2b y 3');
  const accs = [...d.querySelectorAll('.acciones .big b')].map(b => b.textContent);
  ok(accs.includes('Dolor subacromial (SAPS)') && accs.includes('Lesión SLAP') && accs.includes('Hombro congelado') && accs.includes('Rigidez activa = pasiva'), 'árbol: accesos a síndromes y rigidez: ' + accs.join(' | '));
  for (const c of ['dolor focal AC', 'episodio concreto o aprensión', 'debilidad en RE + cluster positivo', 'síntomas mecánicos', 'dolor o debilidad al elevar']) ok(t.toLowerCase().includes(c.toLowerCase()), 'árbol: patrón «' + c + '»');
  ok(t.includes(norm(data.ARBOL.filas[4][1].split('\n')[1])), 'árbol: cierre del nodo 4');
  click(btn(d, 'Dolor subacromial (SAPS)'));
  ok(titulo(d) === 'Dolor subacromial (SAPS)', 'árbol → ficha SAPS');

  // ── Las 6 fichas: todo el texto de la tarjeta (síndromes + pronóstico) ──
  ({ w, d, errs } = nueva());
  entrarHombro(d);
  click(btn(d, 'Bisagra y árbol'));
  ok(txt(d).includes(norm(data.SINDROMES.aviso)), 'árbol: abre con el aviso de severidad e irritabilidad');
  ok(!btn(d, 'Síndromes') && !txt(d).includes('Bloques 4, 5 y 6'), 'sin lista de síndromes');
  const nombres = btns(d).map(b => b.querySelector('b') && b.querySelector('b').textContent).filter(Boolean);
  ok(data.SINDROMES.filas.every(f => nombres.includes(f[0])), 'árbol: las 6 fichas alcanzables (5 por el nodo 4 y el congelado por el 2b)');
  const mapa = { 'Dolor subacromial (SAPS)': 'SAPS', 'Inestabilidad GH': 'Inestabilidad', 'Acromioclavicular': 'Acromioclavicular', 'Lesión SLAP': 'SLAP', 'Rotura del manguito': 'Rotura del manguito', 'Hombro congelado': 'Hombro congelado' };
  for (const f of data.SINDROMES.filas) {
    const inst = nueva();
    entrarHombro(inst.d);
    click(btn(inst.d, 'Bisagra y árbol')); click(btn(inst.d, f[0]));
    const tt = txt(inst.d);
    const p = data.PRONOSTICO.filas.find(x => x[0] === mapa[f[0]]);
    ok(titulo(inst.d) === f[0], 'ficha ' + f[0] + ': título');
    ok([f[1], f[2], f[3], p[1], p[2]].every(c => tt.includes(norm(c))), 'ficha ' + f[0] + ': explorar, ①, ②, horizonte y criterio idénticos a la tarjeta');
    ok(tt.includes(norm(data.SINDROMES.aviso)) && tt.includes('Bloque 6 · horizonte y criterio'), 'ficha ' + f[0] + ': aviso y bloque 6 plegables');
    ok(tt.includes('Dosis y progresión no están en la guía: son tuyas.') && tt.includes(norm(data.PRONOSTICO.pie)), 'ficha ' + f[0] + ': aviso de dosis y fuente');
    ok(inst.errs.length === 0, 'ficha ' + f[0] + ': sin errores');
    if (f[0] === 'Hombro congelado') ok(tt.includes(norm(data.SINDROMES.nota)), 'congelado: nota de tests');
  }
  const det = [...(() => { const i = nueva(); entrarHombro(i.d); click(btn(i.d, 'Bisagra y árbol')); click(btn(i.d, 'Lesión SLAP')); return i.d.querySelectorAll('details'); })()];
  ok(det.length === 2 && det.every(x => !x.open), 'ficha: los dos plegables empiezan cerrados');

  // ── Rigidez: grupo limitado + plegable con los 3 que no restringen la pasiva ──
  ({ w, d, errs } = nueva());
  entrarHombro(d);
  click(btn(d, 'Bisagra y árbol')); click(btn(d, 'Rigidez activa'));
  ok(titulo(d) === 'Rigidez activa = pasiva', 'rigidez: se llega desde el nodo 2b del árbol');
  const rows = [...d.querySelectorAll('#main > details')];
  ok(rows.length === 5, 'rigidez: 4 filas + 1 plegable');
  ok(rows.every(r => !r.open), 'rigidez: todo cerrado al entrar');
  ok(data.ORIENTATIVA.filas.every(f => f.every(c => txt(d).includes(norm(c)))) && txt(d).includes(norm(data.ORIENTATIVA.nota)), 'rigidez: las 7 condiciones completas y la nota');
  const gr = [...d.querySelectorAll('.grupo')].map(e => e.textContent);
  ok(gr.length === 1 && gr[0].startsWith('Pasiva limitada'), 'rigidez: un solo título de grupo');
  const orden = [...d.querySelectorAll('#main > .grupo, #main > details')].map(e => e.matches('.grupo') ? '#' : e.querySelector('summary b').textContent);
  ok(orden.join('|') === '#|Artrosis GH|Neoplasia|Luxación bloqueada|Fractura|Se parecen al congelado, pero con pasiva no limitada', 'rigidez: orden: ' + orden.join('|'));
  const sum = rows[4].querySelector('summary').textContent;
  ok(sum.includes('Dolor del manguito · Acromioclavicular · Cervicogénico'), 'rigidez: el plegable nombra las 3 condiciones');
  ok(!txt(d).includes('sigue por test cervicales') && !txt(d).includes('repite la bisagra'), 'rigidez: sin la frase imperativa');
  const dicen = {};
  d.querySelectorAll('summary .st').forEach(e => { const sp_ = e.querySelector('span'); if (sp_ && e.querySelector('b').textContent === 'Luxación bloqueada') dicen['Luxación bloqueada'] = sp_.textContent; });
  d.querySelectorAll('.cond').forEach(c => { const x = c.querySelector('.dice'); if (x) dicen[c.querySelector('.nombre').textContent] = x.textContent; });
  ok(dicen['Dolor del manguito'] === 'Movilidad pasiva no muy limitada' && dicen['Acromioclavicular'] === 'Sin restricción pasiva' && dicen['Cervicogénico'] === 'Sin restricción pasiva GH' && dicen['Luxación bloqueada'] === 'Rigidez activa y pasiva similar al congelado' && Object.keys(dicen).length === 4, 'rigidez: línea de pasiva solo en 4 condiciones');
  ok(Object.entries(dicen).every(([n, l]) => norm(data.ORIENTATIVA.filas.find(f => f[0] === n)[1]).toLowerCase().includes(l.toLowerCase())), 'rigidez: cada línea de pasiva sale literal de la tarjeta');
  ok(txt(d).includes('Agrupación propia'), 'rigidez: avisa de agrupación propia');
  rows[0].open = true; rows[0].dispatchEvent(new w.Event('toggle')); rows[4].open = true; rows[4].dispatchEvent(new w.Event('toggle'));
  ok(rows.filter(r => r.open).length === 1 && rows[4].open, 'rigidez: solo una cosa abierta a la vez (incluido el plegable)');
  click(btn(d, 'Hombro congelado')); ok(titulo(d) === 'Hombro congelado', 'rigidez → ficha del congelado');
  ok(!!btn(d, 'Diferencial: rigidez activa = pasiva'), 'ficha del congelado: botón al diferencial');
  const antes = w.eval('pila.length');
  click(btn(d, 'Diferencial: rigidez activa = pasiva')); ok(titulo(d) === 'Rigidez activa = pasiva', 'congelado → diferencial');
  click(btn(d, 'Hombro congelado')); await wait(50);
  ok(titulo(d) === 'Hombro congelado' && w.eval('pila.length') === antes, 'diferencial → congelado vuelve sin apilar pantallas');
  { const i = nueva(); entrarHombro(i.d); click(btn(i.d, 'Bisagra y árbol')); click(btn(i.d, 'Lesión SLAP')); ok(!btn(i.d, 'Diferencial: rigidez'), 'otras fichas no llevan el botón del diferencial'); }

  // ── Sin almacenamiento ni errores ──
  ok(w.sessionStorage.length === 0 && w.localStorage.length === 0, 'no guarda nada en el navegador');
  ok(errs.length === 0, 'sin errores de JS: ' + errs.join(' / '));
  console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
  process.exit(fails ? 1 : 0);
})();
