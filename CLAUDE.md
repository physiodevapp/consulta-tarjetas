# CLAUDE.md · Consulta de hombro (SPA)

## Qué es
SPA móvil **de solo lectura** que reproduce la tarjeta de consulta de hombro (extracto de la guía clínica de hombro). La usa un fisioterapeuta en el móvil (Android) durante la visita, con la Ficha de primera visita en papel y Heidi Health grabando en segundo plano. Habrá una tarjeta por región (hombro, lumbar, cervical, cadera, rodilla); hoy solo existe hombro. Idioma de todo: español.

## Decisiones tomadas (no cambiar sin preguntar)
1. **Solo consulta.** No captura datos de pacientes. Prohibido localStorage, sessionStorage, IndexedDB y cookies. El recorrido del árbol (marcas y fichas abiertas) vive en memoria y se pierde al recargar.
2. **La tarjeta manda.** Todo el texto clínico sale del CONTENIDO (`hombro.data.json`, extraído del docx). No reescribir, resumir ni añadir cifras (S, E, LR, umbrales, puntuaciones). Lo que añade la SPA (agrupación de la tabla de rigidez, pista del congelado, botones del árbol, mapas de nombres) es propio: se marca como tal en pantalla o en el código.
3. **El inicio es un selector de región** (una sola URL; tarea 3 hecha). Dentro de cada región **se entra siempre por el árbol** (Banderas rojas y Bisagra y árbol; las fichas de síndrome se alcanzan desde ahí). No hay lista de síndromes en el inicio de la región. Sin popups; plegables con una sola fila abierta.
4. **Recorrido del árbol:** marcas Hecho / Dudoso / No aplica por nodo, panel «Recorrido» y, al hacer scroll, cápsulas en la cabecera en lugar del título.
5. **Móvil primero:** objetivos táctiles ≥ 44 px, variables CSS con tema claro y oscuro (dark según el sistema), tipografía Atkinson Hyperlegible con fallback, y que aguante el tamaño de letra del sistema al 130 %.
6. **Un solo HTML autocontenido.** Sin librerías externas; solo Google Fonts (con fallback).
7. **Sin colores de alarma:** el borde grueso negro sustituye al rojo (decisión de la tarjeta en papel).
8. **Una sola paleta para todas las regiones:** la verde de hombro (`#1F5F4E` en claro, `#5CC0A3` en oscuro), fija en el CSS. `CONFIG.DARK` no se usa en pantalla.
9. **El nombre de la app vive en una sola constante** (`app.json`). De ahí salen el título de la pestaña, la cabecera del inicio, `package.json` (`name` como slug, `description` empieza por el nombre) y, cuando exista (tarea 5), el manifest. `npm test` falla si se desincronizan (`test-app.js`). Las rutas del manifest y del service worker (tarea 5) deben ser relativas: GitHub Pages puede servir el sitio desde una subruta.

## Archivos (todo en la raíz, formato plano)
- `app.json` **la única constante con el nombre de la app** (decisión 9): `{nombre}`. La lee `build.py`
- `plantilla.html` código de la SPA (motor genérico, sin texto de ninguna región); lleva los marcadores `__APP__` (nombre de la app) y `__DATA__` con `{APP, REGIONES, DATOS}` (ver más abajo). El inicio es el selector de región; dentro de una región, `D` son sus datos planos y `R` lo que se deriva de ellos (`cargarRegion()`). Los colores de acento son fijos en el CSS (una sola paleta para todas las regiones)
- `hombro.data.json` datos de hombro ya montados: CONTENIDO de la tarjeta + campos de `spa_hombro.js`. Se genera, no se edita a mano
- `spa_<región>.js` **los campos específicos de la SPA viven aquí, no en el CONTENIDO de la tarjeta**: enlaces del árbol a las fichas, correspondencia síndrome↔pronóstico, pistas de las fichas, agrupación de la tabla orientativa y corte de la nota. Hoy solo `spa_hombro.js`. No es texto clínico: solo nombra filas que ya están en la tarjeta
- `datos.js` funde `tarjeta_<región>.js` + `spa_<región>.js` en la forma que consume la SPA; `extraer.js` es su CLI y escribe `<región>.data.json`
- `build.py` lee `app.json` y junta los `<región>.data.json` que existan (define las cinco regiones conocidas; hoy solo `hombro.data.json`) en `{APP, REGIONES: [{region, nombre, disponible}], DATOS: {<región>: ...}}`, lo inyecta en la plantilla y genera `index.html` (lo que publica GitHub Pages). Solo biblioteca estándar
- `test-build.js` `npm test` lo ejecuta primero: regenera `index.html` (`build.py`) y falla si el resultado difiere del que había, para no publicar nunca una versión desactualizada
- `test-app.js` comprueba que `package.json` e `index.html` coinciden con `app.json` (decisión 9)
- `test-contenido.js`, `test-recorrido.js`, `test-cabecera.js`, `test-urgencia.js`, `test-selector.js` pruebas con jsdom
- `plantilla_tarjetas.js` generador de los docx de las tarjetas (no tocar salvo en la migración). Depende del paquete npm `docx` (ya declarado en `package.json`). Escribe en la carpeta de la variable `OUT_DIR` (por defecto `/home/claude`).
- `tarjeta_cadera.js`, `tarjeta_cervical.js`, `tarjeta_lumbar.js`, `tarjeta_rodilla.js`: CONFIG + CONTENIDO de cada región (la fuente de verdad; cada uno llama a `generarTarjeta` al cargarse)
- `extraer-js.js` extrae `{REGION, CONFIG, CONTENIDO}` de un `tarjeta_<región>.js` sin generar el docx: `npm run extraer-js -- tarjeta_lumbar.js`. Exporta `leer()`, que usan `datos.js` y `test-fuente.js`
- `tarjeta_hombro.js` CONFIG + CONTENIDO de hombro (fuente de verdad, como las otras cuatro)
- `tarjeta_hombro.docx` referencia en papel; ya no entra en la cadena (de él salía `hombro.data.json` con `extraer.py`, retirado). `test-fuente.js` recorre `REGIONES` (hoy solo hombro) y comprueba que el JSON coincide celda a celda con la tarjeta, que está al día y que los campos de `spa_<región>.js` nombran filas que existen (162 comparaciones, 0 diferencias). La forma difiere solo en lo esperable: celdas de árbol como texto unido con `\n` (en el `.js`, arrays de líneas) y los pies, que la SPA llama `TITULOS.pieA2` y `PRONOSTICO.pie` y en el `.js` son `TITULOS.pieA` y `TITULOS.pieB`.

## Comandos
`npm install` · `npm run extraer` (hombro, desde `tarjeta_hombro.js`) · `npm run extraer-js -- tarjeta_<región>.js` · `npm run tarjetas` (regenera los 5 docx en `salida/`) · `npm run build` · `npm test`

## Forma del CONTENIDO (según `plantilla_tarjetas.js`)
`URGENCIA?` {titulo, lineas} · `BANDERAS` {titulo, cabecera, filas, nota} · `BISAGRA` {pregunta, ramas, apoyo, nota?} · `ARBOL` {filas: [[nodo, texto]]} · `SINDROMES` {aviso, cabecera, filas, nota} · `ORIENTATIVA?` {titulo, cabecera, filas, nota, bloque?} · `PRONOSTICO` {titulo, cabecera, filas, nota, pie} · `TITULOS`. `datos.js` deja `TITULOS` reducido a lo que usa la SPA (`caraA`, `caraB`, `pieA2`) y pasa el pie de la cara B a `PRONOSTICO.pie`. El `CONFIG` de cada región trae `DARK` (color).

## Lo que se ve al leer los cuatro `.js` (las regiones NO son copias de hombro)
- **Las cuatro tienen `URGENCIA`** (3 a 5 líneas) y `ORIENTATIVA`; hombro no tiene `URGENCIA`.
- **`BANDERAS`:** 8 o 9 filas. Lumbar tiene 2 columnas (sin «ayuda en consulta»); las demás, 3, con cabecera «Sospecha → derivación médica».
- **`ARBOL`:** los nodos cambian por región. Hombro 1 2 2b 3 4 · cadera 1 2 3 4 5 5b 6 · cervical 1 2 3 3b 4 5 5b 6 · lumbar 1 2 3 3b 4 · rodilla 1 a 7. El texto de cada nodo es un **array de líneas** (en el JSON de hombro, extraído del docx, viene unido con `\n`). El panel «Recorrido» ya es genérico; las acciones por nodo, no.
- **`SINDROMES`:** 6 (cervical), 7 (lumbar), 9 (cadera), 13 (rodilla). Algunas filas tienen 3 celdas con `{ span: "texto" }` en la tercera (síndromes sin ① ni ②, p. ej. miofascial en lumbar, sensibilización central en cadera). La cabecera de esa tabla no está en el CONTENIDO: la fija la plantilla («Síndrome · Explorar · 10′ · ① Gesto testigo · ② Medida objetiva»).
- **`ORIENTATIVA` es distinta en cada región.** Matriz comparativa en cervical (migraña / tensional / cervicogénica) y lumbar (discogénico / facetario / sacroilíaco); fichas de entidades adicionales en cadera y rodilla (4 columnas, la última con ① y ②). Hay que renderizarla de forma genérica (cada fila con sus columnas etiquetadas por `cabecera`), no con la pantalla de rigidez de hombro.
- **`PRONOSTICO`:** 6 a 17 filas. En rodilla (13 + 8 entidades frente a 17 filas) la correspondencia síndrome ↔ pronóstico no es 1 a 1: necesita mapa explícito.
- **`CONFIG.DARK`:** color propio por región (hombro `1F5F4E`, cadera `6A4A6A`, cervical `4A5A7A`, lumbar `1F4E5F`, rodilla `7A5A2E`). Solo afecta al papel: la SPA usa una sola paleta para todas las regiones. `SPLIT_A` / `SPLIT_B` / `SZ_*` tampoco afectan a la SPA.
- **`TITULOS`:** claves distintas según región (`caraA`, `caraA2`, `caraB`, `caraC`, `pieA`, `pieA2`, `pieB`, `pieC`).

## Lo específico de hombro (ya está en datos, en `spa_hombro.js`)
`ENLACES` (botones de los nodos 1, 2b y 4, y el mapa etiqueta del árbol → ficha que antes era `PATRON_A_SINDROME`), `PRONOSTICO_DE` (antes `SINDROME_A_PRON`), `FICHAS` (pista del congelado, botón al diferencial y nota de síndromes), `ORIENTATIVA_GRUPOS` (antes `GRUPO_LIMITADA` / `GRUPO_LIBRE` / `DICE_PASIVA`, con su aviso de agrupación propia) y `CORTE_NOTA`. El nombre de la región sale de la propia tarjeta (`REGION`); el color es fijo (decisión 8), no viene de `CONFIG.DARK`.
El motor lee un nodo con `patrones` partiendo su primera línea en «condición → ETIQUETA» (la condición, literal de la tarjeta, es el subtítulo del botón) y usa el resto de líneas como nota de cierre del árbol; la pantalla `orientativa` pinta cada fila con sus columnas etiquetadas por `cabecera` y la agrupación es una capa opcional.

## Tareas, por orden
1. ~~**Motor común + datos por región.**~~ **Hecho con hombro.** La fuente es `tarjeta_hombro.js` (+ `spa_hombro.js`), `extraer.py` retirado y el motor sin literales de la región. Los 5 docx se regeneran idénticos (comprobado comparando `word/document.xml` antes y después). Queda, al añadir cada región: darle su `spa_<región>.js` y meterla en `REGIONES` de `test-fuente.js`.
2. ~~**URGENCIA.**~~ **Hecho.** Componente genérico en `plantilla.html` (`urgencia()`, clase CSS `.card.urgencia`): lo primero que se ve al entrar en la región cuando `DATA.URGENCIA` existe, con el mismo criterio visual que la tarjeta (borde grueso con `var(--ink)`, sin rojo) y sus líneas literales, sin resumir. Probado con una región sintética en `test-urgencia.js` (ninguna región publicada tiene aún `URGENCIA`; llegará con la tarea 4).
3. ~~**Selector de región en el inicio.**~~ **Hecho.** `pSelector()` en `plantilla.html`, con `DATA.REGIONES` (las cinco, generadas por `build.py`): hombro abre, las otras cuatro se ven marcadas «Pendiente» y no son clicables (llegan con la tarea 4). El nombre de la región se ve siempre en la cabecera (`#regionCab`) salvo en el propio selector y en el inicio de la región (ahí ya es el título); también con las cápsulas del recorrido. Probado en `test-selector.js` y en `test-cabecera.js`.
4. **Añadir regiones una a una** (cadera, cervical, lumbar, rodilla) leyendo su `tarjeta_<región>.js` con `npm run extraer` y dándole su `spa_<región>.js`. Para cada una, prueba como `test-contenido.js`: el texto en pantalla coincide con el de su tarjeta. Tener en cuenta las diferencias de arriba: no asumir los nodos de hombro, tratar `span`, `BANDERAS` de 2 columnas, `ORIENTATIVA` genérica y pronóstico con mapa explícito.
5. **PWA:** manifest y service worker para uso sin conexión (GitHub Pages sirve por HTTPS). El manifest lee el nombre de `app.json` (decisión 9). Todas las rutas, en el manifest y en el service worker, relativas (no empezar por `/`): GitHub Pages puede servir el sitio desde una subruta.
6. **Wake Lock** (mantener la pantalla encendida): falló dentro del visor de claude.ai; reintentarlo como página propia.
7. Organizar en carpetas (`src/`, `data/`, `tools/`, `test/`) ajustando rutas.

## Pendientes clínicos (decide el usuario; no tocar sin preguntar)
- La tarjeta de hombro dice «Máximo 2–3 tests» y la Ficha dice «Dos como máximo». Sin resolver.
- ② propone dinamómetro; no está en la lista de recursos de la consulta.
- La agrupación de la tabla de rigidez (pasiva limitada / no limitada) es interpretación propia.
- Cuestionarios validados (SPADI, DASH, ASES, SST, Constant): la guía los cita en el apartado 6, van aparte de los tres números. No se incluyen; no reproducir ítems ni inventar puntuaciones.

## Reglas de trabajo
- **`.gitignore` con `node_modules/` y `salida/`** (ya está). El repo se sube a mano (sin carpetas ni archivos ocultos) y una sesión en la nube podría commitear `node_modules`.
- Cambios de contenido clínico: primero en la tarjeta o la guía, después reflejarlos aquí.
- Antes de dar algo por hecho: `npm test` (ya regenera `index.html` y falla si no coincidía con el del repo).
- Publicar en GitHub Pages **desde una rama, sin GitHub Actions** (los tokens de las sesiones en la nube pueden no poder empujar archivos de workflow).
- Sin datos de pacientes en el repo, en pruebas ni en ejemplos.
