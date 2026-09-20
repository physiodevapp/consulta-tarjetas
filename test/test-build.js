// npm test regenera lo que publica GitHub Pages lo primero: si alguien editó una
// fuente (tarjeta_<región>.js, spa_<región>.js, <región>.data.json, plantilla.html,
// app.json, plantilla-manifest.webmanifest, plantilla-sw.js...) y olvidó `npm run
// build`, este test falla en vez de dejar publicar una versión desactualizada.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RAIZ = path.join(__dirname, '..');
const GENERADOS = ['index.html', 'manifest.webmanifest', 'service-worker.js'];
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALLO:', m); } else console.log('ok:', m); };

const antes = {};
for (const nombre of GENERADOS) {
  const archivo = path.join(RAIZ, nombre);
  antes[nombre] = fs.existsSync(archivo) ? fs.readFileSync(archivo, 'utf8') : null;
}

try {
  execFileSync('python3', [path.join(RAIZ, 'tools', 'build.py')], { cwd: RAIZ, stdio: 'pipe' });
} catch (e) {
  ok(false, 'npm run build ha fallado: ' + (e.stderr ? e.stderr.toString() : e.message));
  console.log('\n' + fails + ' FALLOS');
  process.exit(1);
}

for (const nombre of GENERADOS) {
  const despues = fs.readFileSync(path.join(RAIZ, nombre), 'utf8');
  if (antes[nombre] === null) {
    ok(true, nombre + ' no existía; generado por build.py');
  } else {
    const igual = antes[nombre] === despues;
    ok(igual, nombre + ' estaba al día (build.py no cambia nada al regenerarlo). '
      + (igual ? '' : `Antes ${antes[nombre].length} bytes, ahora ${despues.length} bytes: ejecuta npm run build, revisa el diff y comitea ${nombre}.`));
  }
}

console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
process.exit(fails ? 1 : 0);
