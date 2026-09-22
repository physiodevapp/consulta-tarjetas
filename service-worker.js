// Service worker: la SPA funciona sin conexión (tarea 5). Cachea el cascarón de la
// app (un solo HTML autocontenido, el manifest y los iconos) la primera vez que carga
// con red, y lo sirve desde caché cuando no hay conexión.
//
// El nombre de la caché lleva un hash corto de index.html, puesto por build.py: así
// cada `npm run build` que cambie el contenido invalida la caché sola, sin tocar
// este archivo a mano.
//
// Todas las rutas son relativas (sin `/` inicial): GitHub Pages puede servir el sitio
// desde una subruta (usuario.github.io/repo/), y una ruta absoluta se rompería ahí.
const CACHE = 'guia-de-consulta-80309fa6a3';
const CASCARON = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CASCARON))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(nombres => Promise.all(nombres.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  // La navegación (abrir la URL del sitio) sirve siempre el cascarón: es la SPA entera
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html'))
    );
    return;
  }
  // Mismo origen: caché primero (más rápido y funciona sin conexión), red de refresco
  if (new URL(req.url).origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then(cacheada => {
        const red = fetch(req).then(resp => {
          if (resp.ok) caches.open(CACHE).then(cache => cache.put(req, resp.clone()));
          return resp;
        }).catch(() => cacheada);
        return cacheada || red;
      })
    );
  }
  // Otros orígenes (Google Fonts): a la red tal cual; la tipografía tiene fallback
  // del sistema (decisión 5), así que no hace falta cachearla para que la SPA funcione
});
