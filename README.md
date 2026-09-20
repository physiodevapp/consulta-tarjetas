# Guía de consulta

SPA móvil de solo lectura con tarjetas de consulta de fisioterapia (Banderas rojas, Bisagra y árbol, fichas de síndrome), para las cinco regiones de la Ficha de primera visita: hombro, cadera, lumbar, cervical y rodilla. El inicio es un selector de región. Funciona sin conexión (instalable como PWA), con un botón para mantener la pantalla encendida durante la consulta. No guarda datos.

## Uso
- `npm install`
- `npm run extraer` genera `data/hombro.data.json` a partir de `data/tarjeta_hombro.js` (la tarjeta) y `data/spa_hombro.js` (los enlaces y agrupaciones propios de la SPA); para otra región, `node tools/extraer.js data/tarjeta_<región>.js`
- `npm run build` junta los cinco `data/<región>.data.json` y genera `index.html`, `manifest.webmanifest` y `service-worker.js` (en la raíz, que es lo que publica GitHub Pages)
- `npm run tarjetas` regenera los docx de las cinco tarjetas en `salida/`
- `npm run extraer-js -- data/tarjeta_<región>.js` vuelca el contenido de una región tal cual está en su `.js`
- `npm test` regenera `index.html`, `manifest.webmanifest` y `service-worker.js`, y falla si alguno no coincidía con el del repo (para no publicar una versión desactualizada); comprueba que los datos de las cinco regiones coinciden con su `tarjeta_<región>.js`, que los campos de cada `spa_<región>.js` nombran filas que existen, que el texto en pantalla coincide con el de cada tarjeta, el selector de región del inicio, que el manifest y el service worker son válidos y con rutas relativas, que `package.json`, `index.html` y el manifest coinciden con el nombre de `app.json`, y el botón de Wake Lock (mantener la pantalla encendida)

## Carpetas
`src/` motor genérico de la SPA · `data/` contenido y datos por región · `tools/` scripts de generación · `test/` pruebas. La raíz solo lleva `app.json`, la config de npm y lo que publica GitHub Pages (`index.html`, `manifest.webmanifest`, `service-worker.js`, iconos).

## Publicar
GitHub Pages: Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
Ojo: el contenido son extractos de guías clínicas. Con el repo público, la página es pública.

Decisiones de diseño y tareas pendientes: `CLAUDE.md`.
