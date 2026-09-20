# Consulta de hombro

SPA móvil de solo lectura con la tarjeta de consulta de hombro (Banderas rojas, Bisagra y árbol, fichas de síndrome y diferencial de rigidez). No guarda datos.

## Uso
- `npm install`
- `npm run extraer` genera `hombro.data.json` a partir de `tarjeta_hombro.js` (la tarjeta) y `spa_hombro.js` (los enlaces y agrupaciones propios de la SPA)
- `npm run build` genera `index.html` a partir de `plantilla.html` + `hombro.data.json`
- `npm run tarjetas` regenera los docx de las cinco tarjetas en `salida/`
- `npm run extraer-js -- tarjeta_<región>.js` vuelca el contenido de una región tal cual está en su `.js`
- `npm test` regenera `index.html` y falla si no coincidía con el del repo (para no publicar una versión desactualizada), comprueba que los datos de hombro coinciden con `tarjeta_hombro.js`, que los campos de `spa_hombro.js` nombran filas que existen, que el texto en pantalla coincide con el de la tarjeta y que el componente de URGENCIA (con una región sintética; hombro no la tiene) sale con el criterio visual de la tarjeta

## Publicar
GitHub Pages: Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
Ojo: el contenido son extractos de guías clínicas. Con el repo público, la página es pública.

Decisiones de diseño y tareas pendientes: `CLAUDE.md`.
