# Consulta de hombro

SPA móvil de solo lectura con la tarjeta de consulta de hombro (Banderas rojas, Bisagra y árbol, fichas de síndrome y diferencial de rigidez). No guarda datos.

## Uso
- `npm install` · `pip install -r requirements.txt`
- `npm run tarjetas` regenera los docx de las cinco tarjetas en `salida/`
- `npm run build` genera `index.html` a partir de `plantilla.html` + `hombro.data.json`
- `npm run extraer-js -- tarjeta_<región>.js` extrae el contenido de una región desde su `.js`
- `npm test` comprueba que los datos de hombro coinciden con `tarjeta_hombro.js` y que el texto en pantalla coincide con el de la tarjeta

## Publicar
GitHub Pages: Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
Ojo: el contenido son extractos de guías clínicas. Con el repo público, la página es pública.

Decisiones de diseño y tareas pendientes: `CLAUDE.md`.
