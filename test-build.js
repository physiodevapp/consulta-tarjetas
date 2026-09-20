// npm test regenera index.html lo primero: si alguien editó una fuente
// (tarjeta_<región>.js, spa_<región>.js, hombro.data.json, plantilla.html...) y olvidó
// `npm run build`, este test falla en vez de dejar publicar una versión desactualizada.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const archivo = path.join(__dirname, 'index.html');
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALLO:', m); } else console.log('ok:', m); };

const antes = fs.existsSync(archivo) ? fs.readFileSync(archivo, 'utf8') : null;

try {
  execFileSync('python3', [path.join(__dirname, 'build.py')], { cwd: __dirname, stdio: 'pipe' });
} catch (e) {
  ok(false, 'npm run build ha fallado: ' + (e.stderr ? e.stderr.toString() : e.message));
  console.log('\n' + fails + ' FALLOS');
  process.exit(1);
}

const despues = fs.readFileSync(archivo, 'utf8');

if (antes === null) {
  ok(true, 'index.html no existía; generado por build.py');
} else {
  ok(antes === despues, 'index.html estaba al día (build.py no cambia nada al regenerarlo). '
    + (antes === despues ? '' : `Antes ${antes.length} bytes, ahora ${despues.length} bytes: ejecuta npm run build, revisa el diff y comitea index.html.`));
}

console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
process.exit(fails ? 1 : 0);
