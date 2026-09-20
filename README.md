# Consulta de tarjetas

SPA móvil de solo lectura con tarjetas de consulta de fisioterapia (Banderas rojas, Bisagra y árbol, fichas de síndrome), para las cinco regiones de la Ficha de primera visita: hombro, cadera, lumbar, cervical y rodilla. El inicio es un selector de región. Funciona sin conexión (instalable como PWA). No guarda datos.

## Uso
- `npm install`
- `npm run extraer` genera `hombro.data.json` a partir de `tarjeta_hombro.js` (la tarjeta) y `spa_hombro.js` (los enlaces y agrupaciones propios de la SPA); para otra región, `node extraer.js tarjeta_<región>.js`
- `npm run build` junta los cinco `<región>.data.json` y genera `index.html`, `manifest.webmanifest` y `service-worker.js`
- `npm run tarjetas` regenera los docx de las cinco tarjetas en `salida/`
- `npm run extraer-js -- tarjeta_<región>.js` vuelca el contenido de una región tal cual está en su `.js`
- `npm test` regenera `index.html`, `manifest.webmanifest` y `service-worker.js`, y falla si alguno no coincidía con el del repo (para no publicar una versión desactualizada); comprueba que los datos de las cinco regiones coinciden con su `tarjeta_<región>.js`, que los campos de cada `spa_<región>.js` nombran filas que existen, que el texto en pantalla coincide con el de cada tarjeta, el selector de región del inicio, que el manifest y el service worker son válidos y con rutas relativas, y que `package.json`, `index.html` y el manifest coinciden con el nombre de `app.json`

## Publicar
GitHub Pages: Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
Ojo: el contenido son extractos de guías clínicas. Con el repo público, la página es pública.

Decisiones de diseño y tareas pendientes: `CLAUDE.md`.
