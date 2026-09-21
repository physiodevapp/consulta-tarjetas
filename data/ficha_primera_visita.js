/**
 * ficha_primera_visita.js
 * Genera "FICHA DE PRIMERA VISITA.docx", a partir de ficha_primera_visita.docx
 * (bloques 0 a 6):
 *   · página 1: la ficha (11 tablas, sin tabla de identificación);
 *   · página 2: el body chart (BC), imagen body_chart.jpg.
 *
 * body_chart.jpg debe estar en la misma carpeta que este script. Es el
 * dibujo original ya recortado con el mismo encuadre que usa el docx
 * (se quitan los márgenes en blanco), porque docx-js no recorta imágenes.
 *
 * No incluye "hoja de revisiones" ni "guía rápida". Si esas páginas
 * también deben generarse, van en un script aparte o como secciones
 * adicionales de este mismo documento.
 *
 * Uso: node ficha_primera_visita.js  →  crea ficha_primera_visita.docx
 */

const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  WidthType, BorderStyle, ShadingType, AlignmentType, VerticalAlign, LineRuleType,
} = require("docx");

// ---------------------------------------------------------------------
// Constantes de estilo (tomadas del docx original)
// ---------------------------------------------------------------------

const FONT = "Calibri";
const GRAY_BORDER = "999999";
const SHADE_BOX = "FAFAFA";     // cajas de texto (severidad, constantes...)
const SHADE_HEADER = "F0F0F0";  // cabecera de tabla de hallazgos
const NOTE_COLOR = "666666";    // color de las notas en cursiva

const PAGE_MARGIN = 300; // reducido respecto al 0.5" original para que las 11 tablas quepan en una sola página A4

// Ancho útil real de la página (A4 = 11906 dxa) según el margen elegido.
// Todas las tablas se dimensionan a partir de esto para que no quede
// descentrado un margen respecto al otro.
const A4_WIDTH = 11906;
const CONTENT_WIDTH = A4_WIDTH - 2 * PAGE_MARGIN;
// Las proporciones de columna se tomaron del docx original (que usaba
// 10466 dxa de ancho útil, con márgenes de 0.5"); se reescalan aquí al
// ancho útil real.
const BASE_WIDTH = 10466;
const scaleCols = (cols) => cols.map((w) => Math.round((w * CONTENT_WIDTH) / BASE_WIDTH));

const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: GRAY_BORDER };
const ALL_BORDERS = {
  top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder,
  insideHorizontal: thinBorder, insideVertical: thinBorder,
};
const CELL_BORDERS = {
  top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder,
};

// Márgenes de celda reducidos (formulario denso a una página)
const CELL_MARGINS = { top: 10, bottom: 10, left: 90, right: 90 };

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

// Un run de texto con formato
function run(text, { bold, italic, size = 17, color } = {}) {
  return new TextRun({ text, bold, italics: italic, size, color, font: FONT });
}

// Un párrafo formado por uno o varios runs (mismo o distinto formato)
function para(runsOrText, opts = {}) {
  if (typeof runsOrText === "string") {
    return new Paragraph({
      spacing: { after: opts.after ?? 12 },
      children: [run(runsOrText, opts)],
    });
  }
  // array de { text, bold, italic, size, color }
  return new Paragraph({
    spacing: { after: opts.after ?? 12 },
    children: runsOrText.map((r) => run(r.text, r)),
  });
}

// Título de bloque ("0 · DEL VOLANTE (30 s — ...)") fuera de cualquier tabla
function sectionTitle(text) {
  return new Paragraph({
    spacing: { before: 30, after: 12 },
    children: [run(text, { bold: true, size: 18 })],
  });
}

// Celda de tabla genérica
function cell(children, { width, shade, valign = VerticalAlign.TOP, columnSpan } = {}) {
  return new TableCell({
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    columnSpan,
    verticalAlign: valign,
    margins: CELL_MARGINS,
    borders: CELL_BORDERS,
    shading: shade ? { type: ShadingType.CLEAR, fill: shade } : undefined,
    children,
  });
}

// Tabla genérica: el ancho de la tabla es la suma de sus columnas
// (ya reescaladas con scaleCols), nunca un valor fijo.
function table(rows, columnWidths) {
  const width = columnWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: width, type: WidthType.DXA },
    columnWidths,
    borders: ALL_BORDERS,
    rows,
  });
}

// Caja de una sola celda con varios párrafos (severidad, constantes, etc.)
function box(paragraphs, { shade = SHADE_BOX } = {}) {
  return table(
    [new TableRow({ children: [cell(paragraphs, { width: CONTENT_WIDTH, shade })] })],
    [CONTENT_WIDTH],
  );
}

// Fila con separación antes/después (para no pegar las tablas entre sí)
// markSize (medios puntos) reduce la marca de párrafo y con ella la altura del
// separador: 8 = 4 pt. Se usa en los dos separadores que el docx adelgaza a
// mano para que la ficha entera quepa en la página 1.
function spacer(size = 12, before, markSize) {
  return new Paragraph({
    spacing: before ? { before, after: size } : { after: size },
    run: markSize ? { size: markSize } : undefined,
    children: [],
  });
}

// ---------------------------------------------------------------------
// Encabezado
// ---------------------------------------------------------------------

const titulo = new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 40 },
  children: [run("FICHA DE PRIMERA VISITA", { bold: true, size: 26 })],
});

const subtitulo = new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 120 },
  children: [run("Cribado · orientación de tratamiento · basal de seguimiento", { italic: true, size: 16 })],
});

// ---------------------------------------------------------------------
// 0 · DEL VOLANTE
// ---------------------------------------------------------------------

const titulo0 = sectionTitle(
  "0 · DEL VOLANTE   (30 s — el diagnóstico remitido es una hipótesis ajena, no un dato)"
);

const tabla0 = table(
  [
    new TableRow({
      children: ["Edad", "Viene etiquetado como…", "Fecha lesión", "Mecanismo  S / N", "Sesiones aut."].map((t) =>
        cell([para(t, { bold: true, size: 16 })])
      ),
    }),
  ],
  scaleCols([1600, 3400, 2000, 1700, 1766]),
);

const cajaAvisosVolante = box([
  para("☐   Menor de edad con dolor sin mecanismo claro → comprobar guía de la región antes de explorar", { bold: true, size: 16 }),
  para("☐   Traumatismo/accidente → comprobar recuadro de urgencia de la guía de la región", { bold: true, size: 16 }),
]);

// ---------------------------------------------------------------------
// 1-2 · RELATO LIBRE Y LOS SEIS EJES
// ---------------------------------------------------------------------

const titulo12 = sectionTitle(
  "1-2 · RELATO LIBRE (90 s, sin interrumpir) Y LOS SEIS EJES (2 min)"
);

const tabla12 = table(
  [
    new TableRow({
      children: [
        cell([para("1  Dónde, y hasta dónde  (que lo señale con un dedo)", { bold: true, size: 16 })]),
        cell([para("2  Cómo empezó  ·  fecha · mecanismo · brusco / insidioso · ¿1ª vez?", { bold: true, size: 16 })]),
      ],
    }),
    new TableRow({
      children: [
        cell([
          para("3  Y desde entonces:   mejor  /  igual  /  peor  /  va y viene", { bold: true, size: 16 }),
          para("Eje distinto del 2. Si está mudo, se pregunta — no se rellena.", { italic: true, size: 13, color: NOTE_COLOR }),
        ]),
        cell([para("4  Qué lo empeora  ·  qué lo alivia    (si nada lo modifica, eso es el hallazgo)", { bold: true, size: 16 })]),
      ],
    }),
    new TableRow({
      children: [
        cell([
          para("5  Ritmo de 24 h   mañana / día / noche", { bold: true, size: 16 }),
          para("Si de noche: ¿cede cambiando de postura?   Sí = mecánico   ·   No = bandera", { italic: true, size: 13, color: NOTE_COLOR }),
        ]),
        cell([para("6  Qué ha dejado de hacer   → de aquí salen las tres actividades del bloque 5", { bold: true, size: 16 })]),
      ],
    }),
    new TableRow({
      children: [
        cell([para("Eje que se quedó mudo  (se pregunta el primero la próxima visita):", { bold: true, size: 16 })], { shade: SHADE_BOX }),
        cell([para("", { size: 16 })], { shade: SHADE_BOX }),
      ],
    }),
  ],
  scaleCols([5233, 5233]),
);

// ---------------------------------------------------------------------
// 3 · CRIBADO
// ---------------------------------------------------------------------

const titulo3 = sectionTitle("3 · CRIBADO   (60 s — se hace completo aunque haya prisa)");

const tabla3 = table(
  [
    new TableRow({
      children: [
        cell([
          para("☐   ¿Ha tenido cáncer alguna vez?", { size: 16 }),
          para("☐   ¿Ha perdido peso sin proponérselo?", { size: 16 }),
          para("☐   ¿Fiebre, escalofríos o sudores nocturnos?", { size: 16 }),
          para("☐   ¿Le despierta el dolor y sigue igual aunque cambie de postura?", { size: 16 }),
        ]),
        cell([
          para("☐   ¿Malestar general, cansancio distinto del suyo?", { size: 16 }),
          para("☐   Corticoides · anticoagulantes · inmunosupresores · infección reciente", { size: 16 }),
          para("☐   (Lumbar/pelvis/cadera) ¿Esfínteres? ¿Adormecimiento entre las piernas?", { size: 16 }),
          para("☐   ¿Síntomas en otra parte del cuerpo, aunque parezca no venir a cuento?", { bold: true, size: 16 }),
        ]),
      ],
    }),
  ],
  scaleCols([5233, 5233]),
);

const cajaConstantes = box([
  para(
    "CONSTANTES — se toman si hay UN disparador:  casilla en positivo · dolor de tronco, hombro, cadera, ingle o raquis sin mecanismo · dolor nuevo sin trauma en >50 · síntoma que aparece con el esfuerzo · mal aspecto",
    { italic: true, size: 13, color: NOTE_COLOR }
  ),
  para(
    "FC ________       FR ________       TA ________ / ________       SatO₂ ________       Tª ________   vía ________",
    { size: 16 }
  ),
  para("Basal conocida de este paciente:  ______________________________________________", { size: 16 }),
  para("Antes de interpretarla: ¿qué fármaco la está sujetando?", { italic: true, size: 13, color: NOTE_COLOR }),
]);

// ---------------------------------------------------------------------
// 4 · EXPLORACIÓN
// ---------------------------------------------------------------------

const titulo4 = sectionTitle("4 · EXPLORACIÓN   (5 min, orden fijo — la palpación va la ÚLTIMA)");

const cajaSeveridad = box([
  para(
    "SEVERIDAD E IRRITABILIDAD   — antes de explorar: decide cuánto se explora hoy. Sale de los ejes 4 y 5; criterio fijo en la guía rápida.",
    { bold: true, size: 14 }
  ),
  para(
    "Qué lo provoca:  ______________________________     Cuánto dura / tarda en calmarse:  ______________________________",
    { size: 16 }
  ),
  para(
    "Peor dolor:  _____ / 10       Limita la actividad:  ☐ No   ☐ En parte   ☐ La impide       Irritabilidad:  ☐ Alta   ☐ Media   ☐ Baja",
    { bold: true, size: 16 }
  ),
  para(
    "Alta → gesto testigo que se provoque con poco, bisagra de la guía de la región y 1–2 tests, sin final de rango ni repeticiones provocadoras; el resto, en la próxima visita.  ·  Media o baja → orden fijo completo.",
    { italic: true, size: 13, color: NOTE_COLOR }
  ),
]);

const cajaGestoTestigo = box([
  para(
    "GESTO TESTIGO   — el movimiento o tarea que reproduce SU síntoma. Se elige aquí y no se cambia nunca más.",
    { bold: true, size: 14 }
  ),
  para("", { size: 16 }),
]);

const notaHallazgos = new Paragraph({
  spacing: { before: 80, after: 40 },
  children: [run("Un hallazgo por línea. Presente o ausente, y hacia dónde empuja. Nunca en prosa.", { italic: true, size: 13, color: NOTE_COLOR })],
});

const FILAS_HALLAZGO = [
  "Observación · marcha, postura, piel, atrofia",
  "Activo — región",
  "Activo — articulación de arriba",
  "Activo — articulación de abajo",
  "Pasivo",
  "Resistido",
  "Neuro (sólo si síntoma distal a codo/rodilla)",
  "Test 1",
  "Test 2",
  "Palpación",
];

const tablaHallazgos = table(
  [
    new TableRow({
      children: ["Hallazgo", "Presente / Ausente", "Empuja hacia"].map((t, i) =>
        cell([para(t, { bold: true, size: 16 })], { shade: SHADE_HEADER, width: scaleCols([4000, 2200, 4266])[i] })
      ),
    }),
    ...FILAS_HALLAZGO.map(
      (texto) =>
        new TableRow({
          children: [
            cell([para(texto, { size: 16 })], { width: scaleCols([4000])[0] }),
            cell([para("", { size: 16 })], { width: scaleCols([2200])[0] }),
            cell([para("", { size: 16 })], { width: scaleCols([4266])[0] }),
          ],
        })
    ),
  ],
  scaleCols([4000, 2200, 4266]),
);

// ---------------------------------------------------------------------
// 5 · LOS TRES NÚMEROS BASALES
// ---------------------------------------------------------------------

const titulo5 = sectionTitle("5 · LOS TRES NÚMEROS BASALES   (60 s — son el seguimiento entero)");

const cajaTresNumeros = box(
  [
    para(
      "①   EVA haciendo el gesto testigo  ( no «EVA en general» ) ................................................  ______ / 10",
      { size: 16 }
    ),
    para(
      "②   Objetivo:  ____________________________  =  ____________   ( posición de medida: ____________________________ )",
      { size: 16 }
    ),
    para("③   Función — tres actividades que elige él, del eje 6.   0 = no puedo   ·   10 = como antes", { size: 16 }),
    para("        a  ______________________________  ____/10          b  ______________________________  ____/10", { size: 16 }),
    para("        c  ______________________________  ____/10", { size: 16 }),
  ],
  { shade: undefined } // sin sombreado, igual que el original
);

// ---------------------------------------------------------------------
// 6 · DECISIÓN Y CRITERIO DE REEVALUACIÓN
// ---------------------------------------------------------------------

const titulo6 = sectionTitle("6 · DECISIÓN Y CRITERIO DE REEVALUACIÓN   (60 s)");

const cajaDecision = box(
  [
    para("☐  Tratar          ☐  Tratar vigilando          ☐  Derivar", { bold: true, size: 18 }),
    para("Motivo (no la etiqueta — el motivo):  ______________________________________________________________________", { size: 16 }),
    para("Dosis inicial (según la irritabilidad del bloque 4):  ______________________________________________________", { size: 16 }),
    para("A las ______ sesiones espero  ______________________________________________________________________", { size: 16 }),
    para("Si no lo veo  →  ______________________________________________________________________", { size: 16 }),
    para("Vuelve antes si  ______________________________________________________________________", { size: 16 }),
  ],
  { shade: undefined } // sin sombreado, igual que el original
);

const cajaSiDerivas = box([
  para("SI DERIVAS — dos frases para el médico", { bold: true, size: 14 }),
  para("1.  Qué he encontrado, con el dato objetivo y su número dentro:  ______________________________________________", { size: 16 }),
  para("2.  Qué me preocupa y con qué urgencia:  ______________________________________________________________", { size: 16 }),
]);

// ---------------------------------------------------------------------
// Página 2 · body chart (BC)
// ---------------------------------------------------------------------

// Tamaño en píxeles a 96 ppp: 723 × 673 px = 19,1 × 17,8 cm, el mismo que
// tiene en el docx (cabe en los 19,9 cm de ancho útil).
const bodyChart = new Paragraph({
  alignment: AlignmentType.CENTER,
  pageBreakBefore: true,
  // lineRule AUTO explícito: sin él, LibreOffice toma el interlineado como
  // exacto y recorta la imagen a una franja de una línea.
  spacing: { before: 0, after: 0, line: 276, lineRule: LineRuleType.AUTO },
  children: [
    new ImageRun({
      type: "jpg",
      data: fs.readFileSync(path.join(__dirname, "body_chart.jpg")),
      transformation: { width: 723, height: 673 },
      altText: {
        name: "body_chart",
        title: "Body chart",
        description: "Silueta humana en vista frontal, lateral y posterior para marcar la localización de los síntomas",
      },
    }),
  ],
});

// ---------------------------------------------------------------------
// Documento
// ---------------------------------------------------------------------

const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: PAGE_MARGIN, bottom: PAGE_MARGIN, left: PAGE_MARGIN, right: PAGE_MARGIN },
        },
      },
      children: [
        titulo,
        subtitulo,
        titulo0,
        tabla0,
        spacer(12, 30, 8), // separa las dos tablas del bloque 0 (adyacentes se fundirían en una)
        cajaAvisosVolante,
        spacer(),
        titulo12,
        tabla12,
        spacer(),
        titulo3,
        tabla3,
        spacer(10),
        cajaConstantes,
        spacer(),
        titulo4,
        cajaSeveridad,
        spacer(10),
        cajaGestoTestigo,
        notaHallazgos,
        tablaHallazgos,
        spacer(),
        titulo5,
        cajaTresNumeros,
        spacer(),
        titulo6,
        cajaDecision,
        spacer(10, undefined, 8),
        cajaSiDerivas,
        bodyChart,
      ],
    },
  ],
});

// ---------------------------------------------------------------------
// Exportar
// ---------------------------------------------------------------------

const SALIDA = path.join(process.env.OUT_DIR || "/home/claude", "ficha_primera_visita.docx");
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(SALIDA, buffer);
  console.log("Generado:", SALIDA);
});
