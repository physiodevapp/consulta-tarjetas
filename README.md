# Consulta de tarjetas

SPA móvil de solo lectura con tarjetas de consulta de fisioterapia (Banderas rojas, Bisagra y árbol, fichas de síndrome). El inicio es un selector de región; hoy hombro y cadera tienen datos, las otras tres se ven pero están pendientes. No guarda datos.

## Uso
- `npm install`
- `npm run extraer` genera `hombro.data.json` a partir de `tarjeta_hombro.js` (la tarjeta) y `spa_hombro.js` (los enlaces y agrupaciones propios de la SPA); para otra región, `node extraer.js tarjeta_<región>.js`
- `npm run build` junta los `<región>.data.json` que existan (hoy hombro y cadera) y genera `index.html` a partir de `plantilla.html`
- `npm run tarjetas` regenera los docx de las cinco tarjetas en `salida/`
- `npm run extraer-js -- tarjeta_<región>.js` vuelca el contenido de una región tal cual está en su `.js`
- `npm test` regenera `index.html` y falla si no coincidía con el del repo (para no publicar una versión desactualizada), comprueba que los datos de hombro y cadera coinciden con su `tarjeta_<región>.js`, que los campos de `spa_<región>.js` nombran filas que existen, que el texto en pantalla coincide con el de cada tarjeta, el selector de región del inicio, y que `package.json` e `index.html` coinciden con el nombre de `app.json`

## Publicar
GitHub Pages: Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
Ojo: el contenido son extractos de guías clínicas. Con el repo público, la página es pública.

Decisiones de diseño y tareas pendientes: `CLAUDE.md`.
