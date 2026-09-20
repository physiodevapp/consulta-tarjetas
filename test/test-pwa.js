// Tarea 5: manifest y service worker para uso sin conexión. Todas sus rutas deben ser
// relativas (decisión 9): GitHub Pages puede servir el sitio desde una subruta
// (usuario.github.io/repo/), y una ruta que empiece por «/» apuntaría a la raíz del
// dominio en vez de al sitio. Este test no puede probar «funciona sin conexión» de
// verdad (jsdom no implementa Service Worker); comprueba lo que sí puede verificar
// de forma estática: manifest válido y coherente con app.json, iconos presentes con
// el tamaño que dicen, y el service worker sin rutas absolutas.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RAIZ = path.join(__dirname, '..');
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALLO:', m); } else console.log('ok:', m); };
const leer = f => fs.readFileSync(path.join(RAIZ, f), 'utf8');
const relativa = r => typeof r === 'string' && !r.startsWith('/') && !/^[a-z]+:\/\//i.test(r);

const { nombre: APP } = JSON.parse(leer('app.json'));

// ── manifest.webmanifest ──
const manifest = JSON.parse(leer('manifest.webmanifest'));   // JSON.parse ya prueba que es válido
ok(manifest.name === APP, 'manifest: name es el nombre de app.json');
ok(manifest.short_name && APP.startsWith(manifest.short_name), 'manifest: short_name es el principio del nombre');
ok(relativa(manifest.start_url) && relativa(manifest.scope) && relativa(manifest.id || '.'), 'manifest: start_url, scope e id relativos (sin «/» inicial)');
ok(Array.isArray(manifest.icons) && manifest.icons.length >= 2, 'manifest: al menos 2 iconos');
for (const icono of manifest.icons || []) {
  ok(relativa(icono.src), 'manifest: icono con ruta relativa: ' + icono.src);
  const archivo = path.join(RAIZ, icono.src);
  ok(fs.existsSync(archivo), 'manifest: el archivo del icono existe: ' + icono.src);
  if (fs.existsSync(archivo)) {
    const buf = fs.readFileSync(archivo);
    const esPNG = buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    ok(esPNG, icono.src + ': cabecera PNG válida');
    if (esPNG) {
      // Ancho y alto están en los bytes 16-23 del chunk IHDR (big-endian)
      const ancho = buf.readUInt32BE(16), alto = buf.readUInt32BE(20);
      const [w, h] = icono.sizes.split('x').map(Number);
      ok(ancho === w && alto === h, icono.src + `: mide ${ancho}x${alto}, el manifest dice ${icono.sizes}`);
    }
  }
}

// ── service-worker.js ──
const sw = leer('service-worker.js');
try { execFileSync('node', ['--check', path.join(RAIZ, 'service-worker.js')], { stdio: 'pipe' }); ok(true, 'service-worker.js: sintaxis válida'); }
catch (e) { ok(false, 'service-worker.js: sintaxis inválida: ' + e.stderr.toString()); }
// Toda ruta entre comillas que empiece por «/» (una sola, no «//» de protocolo) sería absoluta
ok(!/['"]\/(?!\/)/.test(sw), 'service-worker.js: sin rutas absolutas (todas empiezan por «./»)');
ok(sw.includes('./index.html') && sw.includes('./manifest.webmanifest'), 'service-worker.js: cachea el HTML y el manifest');
ok(/self\.addEventListener\(\s*['"]install['"]/.test(sw), 'service-worker.js: maneja install');
ok(/self\.addEventListener\(\s*['"]activate['"]/.test(sw), 'service-worker.js: maneja activate (limpia cachés viejas)');
ok(/self\.addEventListener\(\s*['"]fetch['"]/.test(sw), 'service-worker.js: maneja fetch');

// ── index.html: enlazado, no roto por errores de sintaxis del build ──
const html = leer('index.html');
ok(/<link rel="manifest" href="manifest\.webmanifest">/.test(html), 'index.html: enlaza el manifest con ruta relativa');
ok(/navigator\.serviceWorker\.register\(\s*['"]service-worker\.js['"]/.test(html), 'index.html: registra el service worker con ruta relativa');
ok(html.includes("if ('serviceWorker' in navigator)"), 'index.html: comprueba soporte antes de registrar (no rompe donde no hay Service Worker)');

console.log(fails ? '\n' + fails + ' FALLOS' : '\nTODO OK');
process.exit(fails ? 1 : 0);
