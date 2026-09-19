# CLAUDE.md · Consulta de hombro (SPA)

## Qué es
SPA móvil **de solo lectura** que reproduce la tarjeta de consulta de hombro (extracto de la guía clínica de hombro). La usa un fisioterapeuta en el móvil (Android) durante la visita, con la Ficha de primera visita en papel y Heidi Health grabando en segundo plano. Habrá una tarjeta por región (hombro, lumbar, cervical, cadera, rodilla); hoy solo existe hombro. Idioma de todo: español.

## Decisiones tomadas (no cambiar sin preguntar)
1. **Solo consulta.** No captura datos de pacientes. Prohibido localStorage, sessionStorage, IndexedDB y cookies. El recorrido del árbol (marcas y fichas abiertas) vive en memoria y se pierde al recargar.
2. **La tarjeta manda.** Todo el texto clínico sale del CONTENIDO (`hombro.data.json`, extraído del docx). No reescribir, resumir ni añadir cifras (S, E, LR, umbrales, puntuaciones). Lo que añade la SPA (agrupación de la tabla de rigidez, pista del congelado, botones del árbol, mapas de nombres) es propio: se marca como tal en pantalla o en el código.
3. **Se entra siempre por el árbol** (inicio: Banderas rojas y Bisagra y árbol; las fichas de síndrome se alcanzan desde ahí). No hay lista de síndromes en el inicio. Sin popups; plegables con una sola fila abierta.
4. **Recorrido del árbol:** marcas Hecho / Dudoso / No aplica por nodo, panel «Recorrido» y, al hacer scroll, cápsulas en la cabecera en lugar del título.
5. **Móvil primero:** objetivos táctiles ≥ 44 px, variables CSS con tema claro y oscuro (dark según el sistema), tipografía Atkinson Hyperlegible con fallback, y que aguante el tamaño de letra del sistema al 130 %.
6. **Un solo HTML autocontenido.** Sin librerías externas; solo Google Fonts (con fallback).
7. **Sin colores de alarma:** el borde grueso negro sustituye al rojo (decisión de la tarjeta en papel).

## Archivos (todo en la raíz, formato plano)
- `plantilla.html` código de la SPA; lleva el marcador `__DATA__`
- `hombro.data.json` CONTENIDO de hombro
- `extraer.py` docx de la tarjeta → JSON (misma forma que el CONTENIDO de `plantilla_tarjetas.js`)
- `build.py` inyecta el JSON en la plantilla y genera `index.html` (lo que publica GitHub Pages)
- `test-contenido.js`, `test-recorrido.js`, `test-cabecera.js` pruebas con jsdom
- `plantilla_tarjetas.js` generador de los docx de las tarjetas (no tocar salvo en la migración). Depende del paquete npm `docx` (ya declarado en `package.json`). Escribe en la carpeta de la variable `OUT_DIR` (por defecto `/home/claude`).
- `tarjeta_cadera.js`, `tarjeta_cervical.js`, `tarjeta_lumbar.js`, `tarjeta_rodilla.js`: CONFIG + CONTENIDO de cada región (la fuente de verdad; cada uno llama a `generarTarjeta` al cargarse)
- `extraer-js.js` extrae `{REGION, CONFIG, CONTENIDO}` de un `tarjeta_<región>.js` sin generar el docx: `npm run extraer-js -- tarjeta_lumbar.js`
- `tarjeta_hombro.js` CONFIG + CONTENIDO de hombro (fuente de verdad, como las otras cuatro)
- `tarjeta_hombro.docx` referencia; de él salió `hombro.data.json` con `extraer.py`. `test-fuente.js` comprueba que ese JSON coincide celda a celda con `tarjeta_hombro.js` (106 comparaciones, 0 diferencias). La forma difiere solo en lo esperable: celdas de árbol como texto unido con `\n` (en el `.js`, arrays de líneas) y los pies, que la SPA llama `TITULOS.pieA2` y `PRONOSTICO.pie` y en el `.js` son `TITULOS.pieA` y `TITULOS.pieB`.

## Comandos
`pip install -r requirements.txt` · `npm install` · `npm run extraer` (hombro, desde el docx) · `npm run extraer-js -- tarjeta_<región>.js` · `npm run tarjetas` (regenera los 5 docx en `salida/`) · `npm run build` · `npm test`

## Forma del CONTENIDO (según `plantilla_tarjetas.js`)
`URGENCIA?` {titulo, lineas} · `BANDERAS` {titulo, cabecera, filas, nota} · `BISAGRA` {pregunta, ramas, apoyo, nota?} · `ARBOL` {filas: [[nodo, texto]]} · `SINDROMES` {aviso, cabecera, filas, nota} · `ORIENTATIVA?` {titulo, cabecera, filas, nota, bloque?} · `PRONOSTICO` {titulo, cabecera, filas, nota, pie} · `TITULOS`. `extraer.py` deja `TITULOS` reducido a lo que usa la SPA. El `CONFIG` de cada región trae `DARK` (color).

## Lo que se ve al leer los cuatro `.js` (las regiones NO son copias de hombro)
- **Las cuatro tienen `URGENCIA`** (3 a 5 líneas) y `ORIENTATIVA`; hombro no tiene `URGENCIA`.
- **`BANDERAS`:** 8 o 9 filas. Lumbar tiene 2 columnas (sin «ayuda en consulta»); las demás, 3, con cabecera «Sospecha → derivación médica».
- **`ARBOL`:** los nodos cambian por región. Hombro 1 2 2b 3 4 · cadera 1 2 3 4 5 5b 6 · cervical 1 2 3 3b 4 5 5b 6 · lumbar 1 2 3 3b 4 · rodilla 1 a 7. El texto de cada nodo es un **array de líneas** (en el JSON de hombro, extraído del docx, viene unido con `\n`). El panel «Recorrido» ya es genérico; las acciones por nodo, no.
- **`SINDROMES`:** 6 (cervical), 7 (lumbar), 9 (cadera), 13 (rodilla). Algunas filas tienen 3 celdas con `{ span: "texto" }` en la tercera (síndromes sin ① ni ②, p. ej. miofascial en lumbar, sensibilización central en cadera). La cabecera de esa tabla no está en el CONTENIDO: la fija la plantilla («Síndrome · Explorar · 10′ · ① Gesto testigo · ② Medida objetiva»).
- **`ORIENTATIVA` es distinta en cada región.** Matriz comparativa en cervical (migraña / tensional / cervicogénica) y lumbar (discogénico / facetario / sacroilíaco); fichas de entidades adicionales en cadera y rodilla (4 columnas, la última con ① y ②). Hay que renderizarla de forma genérica (cada fila con sus columnas etiquetadas por `cabecera`), no con la pantalla de rigidez de hombro.
- **`PRONOSTICO`:** 6 a 17 filas. En rodilla (13 + 8 entidades frente a 17 filas) la correspondencia síndrome ↔ pronóstico no es 1 a 1: necesita mapa explícito.
- **`CONFIG.DARK`:** color propio por región (hombro `1F5F4E`, cadera `6A4A6A`, cervical `4A5A7A`, lumbar `1F4E5F`, rodilla `7A5A2E`). En tema oscuro hay que aclararlo para que el contraste sea suficiente. `SPLIT_A` / `SPLIT_B` / `SZ_*` solo afectan al papel.
- **`TITULOS`:** claves distintas según región (`caraA`, `caraA2`, `caraB`, `caraC`, `pieA`, `pieA2`, `pieB`, `pieC`).

## Lo específico de hombro que hoy está en el código (hay que llevarlo a datos)
`PATRON_A_SINDROME`, `SINDROME_A_PRON`, `PISTA_CONGELADO`, `GRUPO_LIMITADA` / `GRUPO_LIBRE` / `DICE_PASIVA`, la lectura de la fila 4 del árbol (`patrones()`), las acciones por nodo en `pArbol` (nodos '1', '2b', '4'), la pantalla `rigidez` y su botón en la ficha del congelado, `REGION` y el color de acento.

## Tareas, por orden
1. **Motor común + datos por región.** Unificar la fuente: hombro también se lee de `tarjeta_hombro.js` con `extraer-js.js` (misma forma que las demás regiones) y se retira `extraer.py`; `test-fuente.js` se adapta para cubrir las cinco regiones. Mover lo específico a campos opcionales del CONTENIDO (p. ej. `ENLACES` del árbol a las fichas, correspondencia síndrome↔pronóstico, grupos de la tabla orientativa). Las tarjetas docx deben seguir generándose idénticas: `npm run tarjetas` tiene que funcionar antes y después. Comprobación ya hecha con la plantilla actual: el docx regenerado desde `tarjeta_hombro.js` y pasado por `extraer.py` da exactamente `hombro.data.json`.
2. **URGENCIA.** Las cuatro regiones nuevas la tienen. Debe ser lo primero que se vea al entrar en la región, con el mismo criterio visual que la tarjeta (borde grueso, sin rojo), y sus líneas literales.
3. **Selector de región en el inicio** (una sola URL).
4. **Añadir regiones una a una** (cadera, cervical, lumbar, rodilla) leyendo su `tarjeta_<región>.js` con `extraer-js.js`. Para cada una, prueba como `test-contenido.js`: el texto en pantalla coincide con el de su tarjeta. Tener en cuenta las diferencias de arriba: no asumir los nodos de hombro, tratar `span`, `BANDERAS` de 2 columnas, `ORIENTATIVA` genérica y pronóstico con mapa explícito.
5. **PWA:** manifest y service worker para uso sin conexión (GitHub Pages sirve por HTTPS).
6. **Wake Lock** (mantener la pantalla encendida): falló dentro del visor de claude.ai; reintentarlo como página propia.
7. Organizar en carpetas (`src/`, `data/`, `tools/`, `test/`) ajustando rutas.

## Pendientes clínicos (decide el usuario; no tocar sin preguntar)
- La tarjeta de hombro dice «Máximo 2–3 tests» y la Ficha dice «Dos como máximo». Sin resolver.
- ② propone dinamómetro; no está en la lista de recursos de la consulta.
- La agrupación de la tabla de rigidez (pasiva limitada / no limitada) es interpretación propia.
- Cuestionarios validados (SPADI, DASH, ASES, SST, Constant): la guía los cita en el apartado 6, van aparte de los tres números. No se incluyen; no reproducir ítems ni inventar puntuaciones.

## Reglas de trabajo
- **Antes del primer commit, crear `.gitignore` con `node_modules/` y `salida/`.** El repo se sube a mano (sin carpetas ni archivos ocultos) y una sesión en la nube podría commitear `node_modules`.
- Cambios de contenido clínico: primero en la tarjeta o la guía, después reflejarlos aquí.
- Antes de dar algo por hecho: `npm run build && npm test`.
- Publicar en GitHub Pages **desde una rama, sin GitHub Actions** (los tokens de las sesiones en la nube pueden no poder empujar archivos de workflow).
- Sin datos de pacientes en el repo, en pruebas ni en ejemplos.
