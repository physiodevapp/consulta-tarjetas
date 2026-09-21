// Formulario previo a la primera visita · librería compartida
// No se edita para una región concreta: aquí viven los helpers, la cara 1
// (idéntica en las cinco regiones) y el montaje del documento.
//
// Cada formulario_<region>.js hace:
//
//   const generarFormulario = require("./plantilla_formularios");
//   const REGION = "cadera";
//   const CONTENIDO = (h) => ({ titulo, intro, bloques: [...], pie });
//   generarFormulario(REGION, CONTENIDO);
//
// Piezas disponibles en `h` para CONTENIDO (cara 2): section, q(negrita, resto),
// opts(texto), hint, writeLine(etiqueta), choice(...etiquetas), fila(texto) para
// tablas Sí/No/No sé, run, Paragraph, B, S.

const fs = require("fs");
const path = require("path");
const { Document, Packer, Paragraph, TextRun, BorderStyle, Tab, TabStopType, LeaderType } = require("docx");

const DEFAULTS = {
  fuente: "Arial",
  tam: { cuerpo: 19, aclaracion: 17, pie: 15, titulo: 26 },   // medios puntos: 9,5 · 8,5 · 7,5 · 13 pt
  pagina: { ancho: 11906, alto: 16838 },                        // A4 en DXA
  margenes: { top: 600, right: 720, bottom: 500, left: 720, header: 708, footer: 708 }, // ~10 mm
};

function generarFormulario(REGION, CONTENIDO, overrides = {}) {
  const CONFIG = {
    ...DEFAULTS,
    ...overrides,
    salida: overrides.salida || path.join(process.env.OUT_DIR || "/home/claude", `formulario_previo_${REGION}.docx`),
  };

  const FONT = CONFIG.fuente;
  const BODY = CONFIG.tam.cuerpo, HINT = CONFIG.tam.aclaracion, FOOT = CONFIG.tam.pie, TITLE = CONFIG.tam.titulo;
  const B = "☐";
  const S = "     ";      // separación entre casillas

  const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size || BODY, bold: !!o.bold, italics: !!o.italics, color: o.color });
  const title = (text, pageBreak = false) => new Paragraph({ pageBreakBefore: pageBreak, spacing: { before: 0, after: 60 }, children: [run(text, { bold: true, size: TITLE })] });
  const intro = (text) => new Paragraph({ spacing: { after: 160 }, children: [run(text, { italics: true, size: HINT, color: "555555" })] });
  const section = (text) => new Paragraph({
    spacing: { before: 140, after: 50 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: "000000", space: 2 } },
    children: [run(text, { bold: true })],
  });
  const q = (bold, rest) => new Paragraph({ spacing: { before: 0, after: 40, line: 231 }, children: [run(bold, { bold: true }), ...(rest ? [run(rest)] : [])] });
  const opts = (text) => new Paragraph({ spacing: { before: 0, after: 60, line: 231 }, children: [run(text)] });
  const hint = (text) => new Paragraph({ spacing: { before: 0, after: 40, line: 231 }, children: [run(text, { italics: true, size: HINT, color: "555555" })] });
  // Renglón para escribir. Los párrafos contiguos con borde idéntico se agrupan y solo pintan
  // la última raya: se alterna un gris casi idéntico (444444/454545) para que cada renglón
  // conserve su línea. `wl` vive dentro de la función: cada llamada a generarFormulario arranca
  // su propio contador, así que generar varias regiones en el mismo proceso no las mezcla.
  let wl = 0;
  const writeLine = (etiqueta = " ") => new Paragraph({
    spacing: { before: 26, after: 52, line: 248 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: (wl++ % 2) ? "444444" : "454545", space: 1 } },
    children: [run(etiqueta)],
  });
  const footer = (text) => new Paragraph({
    spacing: { before: 170, after: 0 },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB", space: 3 } },
    children: [run(text, { italics: true, size: FOOT, color: "777777" })],
  });
  const choice = (...labels) => labels.map((l) => `${B} ${l}`).join(S);
  // Fila Sí/No/No sé: tabulador fijo con relleno de guiones bajos, para que las casillas
  // queden alineadas en vertical en cualquier visor. El texto va sin guiones.
  const TAB_FILA = 5600;  // DXA desde el margen izquierdo (~9,9 cm)
  const fila = (texto) => new Paragraph({
    spacing: { before: 0, after: 60, line: 231 },
    tabStops: [{ type: TabStopType.LEFT, position: TAB_FILA, leader: LeaderType.UNDERSCORE }],
    children: [run(texto.replace(/\s*_+\s*$/, "") + " "), new TextRun({ children: [new Tab()], font: FONT, size: BODY }), run(` ${B} Sí  ${B} No  ${B} No sé`)],
  });

  // ─────────────── CARA 1 · tronco común (idéntica en todas las regiones)
  const cara1 = [
    title("Antes de su primera visita"),
    intro("Rellénelo con calma mientras espera. Si algo no lo sabe, marque «No sabría decir»: esa respuesta también nos sirve."),
    new Paragraph({
      spacing: { before: 40, after: 170, line: 276 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 8, color: "000000", space: 6 },
        left: { style: BorderStyle.SINGLE, size: 8, color: "000000", space: 6 },
        bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000", space: 6 },
        right: { style: BorderStyle.SINGLE, size: 8, color: "000000", space: 6 },
      },
      children: [
        run("Nombre ______________________________________________   Fecha __________________"),
        new TextRun({ break: 1 }),
        run("Edad ________   Nº de historia ____________________ "),
        run("(lo rellena la consulta)", { italics: true, size: HINT, color: "555555" }),
      ],
    }),

    section("1 · CÓMO EMPEZÓ"),
    q("¿Desde cuándo le pasa? ", " ______________________________   (fecha aproximada, o «hace X semanas»)"),
    q("¿Hubo algo concreto que lo desencadenara? ", " — un golpe, una caída, un esfuerzo, un gesto"),
    opts(`${B} Sí, y fue: ______________________________________________________________`),
    opts(choice("No, empezó poco a poco sin causa clara", "No sabría decir")),
    q("¿Apareció de golpe o poco a poco? ", "    " + choice("De golpe", "Poco a poco", "No sabría decir")),
    q("¿Es la primera vez que le pasa? ", "    " + choice("Sí", "No, ya me había pasado antes", "No sabría decir")),
    hint("Si ya le había pasado: ¿cuándo fue la última vez y cuánto le duró?"),
    writeLine(),

    section("2 · DESDE ENTONCES"),
    q("Desde que empezó, el dolor va…"),
    opts(choice("A mejor", "Igual", "A peor", "Va y viene", "No sabría decir")),

    section("3 · A LO LARGO DEL DÍA"),
    q("¿Cuándo está peor? ", " (puede marcar varias)"),
    opts(choice("Al levantarme", "Durante el día, según lo que haga", "Al final del día", "Por la noche", "No sabría decir")),
    q("¿Le despierta por la noche? ", "    " + choice("No", "Sí", "No sabría decir")),
    hint("Si le despierta: al cambiar de postura, ¿se le calma?"),
    opts(choice("Sí, cambiando de postura mejora", "No, sigue igual haga lo que haga", "No sabría decir")),
    q("Pensando en la última semana, ¿cuánto le ha dolido en el peor momento?"),
    new Paragraph({ spacing: { before: 0, after: 60, line: 231 }, children: [
      run("Nada  ", { italics: true, size: HINT, color: "555555" }),
      run([0,1,2,3,4,5,6,7,8,9,10].map((n) => `${B} ${n}`).join("   ")),
      run("  El peor que pueda imaginar", { italics: true, size: HINT, color: "555555" }),
      run(`      ${B} No sabría decir`),
    ] }),
    q("Cuando algo le empeora el dolor, ¿cuánto tarda en volver a como estaba antes?"),
    opts(choice("Se pasa enseguida", "Unos minutos", "Unas horas", "Me dura el resto del día o más", "No sabría decir")),

    section("4 · QUÉ LE CUESTA HACER"),
    q("Escriba tres cosas que ha dejado de hacer, o que hace peor, por este problema."),
    hint("Su trabajo, un deporte, dormir, conducir, jugar con sus hijos: lo que sea importante para usted. Serán las tres cosas que mediremos en cada revisión."),
    writeLine("1. "), writeLine("2. "), writeLine("3. "),

    section("5 · QUÉ HA PROBADO YA"),
    opts(["Nada todavía", "Reposo", "Calor o frío", "Medicación", "Fisioterapia", "Ejercicio", "Otros"].map((l) => `${B} ${l}`).join("   ")),
    q("¿Le sirvió de algo? ", " _____________________________________________________________________"),

    section("6 · SU SALUD EN GENERAL"),
    q("Enfermedades importantes que tenga o haya tenido ", " (todas, aunque le parezca que no tienen relación con esto)"),
    writeLine(), writeLine(),
    q("Operaciones ", " (y aproximadamente cuándo)"),
    writeLine(),
    q("Medicación que toma ahora ", " (incluidos parches, inyecciones y lo que compra sin receta)"),
    writeLine(), writeLine(),
    opts(`${B} Hay algo relacionado con esta molestia que prefiero comentarle en persona.`),

    footer("Hoja 1 de 2 — continúe al dorso. En la consulta repasaremos juntos lo que ha escrito."),
  ];

  // ─────────────── CARA 2 · rama de la región (desde CONTENIDO; se monta después de la cara 1)
  const rama = CONTENIDO({ section, q, opts, hint, writeLine, choice, fila, run, Paragraph, B, S });
  const cara2 = [title(rama.titulo, true), intro(rama.intro), ...rama.bloques, footer(rama.pie)];

  const doc = new Document({
    styles: { default: { document: { run: { font: FONT, size: BODY } } } },
    sections: [{
      properties: { page: { size: { width: CONFIG.pagina.ancho, height: CONFIG.pagina.alto }, margin: CONFIG.margenes } },
      children: [...cara1, ...cara2],
    }],
  });

  return Packer.toBuffer(doc).then((buf) => {
    fs.writeFileSync(CONFIG.salida, buf);
    console.log("OK", CONFIG.salida);
  });
}

module.exports = generarFormulario;
