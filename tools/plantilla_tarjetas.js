// ═══════════════════════════════════════════════════════════════════
//  PLANTILLA DE TARJETAS DE REGION
//  Extracto operativo de la guia clinica: dos o mas caras, una hoja A4.
//    Cara A  -> bloque 0 (repaso previo) y bloques 3-4 (cribado y arbol)
//    Cara A2 -> continuacion de A (solo con SPLIT_A): bisagra y arbol
//    Cara B  -> bloques 4, 5 y 6 (tests, numeros y linea de decision)
//    Cara C  -> tabla orientativa + bloque 6 (solo con SPLIT_B)
//  A2 es CONTINUACION de A (cribado), nunca se numera como si fuera una
//  unidad del mismo tipo que B o C: el orden es A, A2, B, C.
//
//  Cada tarjeta_<region>.js importa esta plantilla y aporta TRES cosas:
//    REGION    nombre de la region (minusculas, sin tildes)
//    CONFIG    { DARK, SZ_A, SZ_B, SPLIT_A, SPLIT_B }
//    CONTENIDO { URGENCIA, BANDERAS, BISAGRA, ARBOL, SINDROMES,
//                ORIENTATIVA, PRONOSTICO, TITULOS }
//  Los helpers y el montaje viven aqui y no se tocan al cambiar de region.
//
//  NUMERACION: los titulos de seccion usan el numero de bloque de la
//  Ficha de primera visita (3 cribado, 4 exploracion, 5 tres numeros,
//  6 decision). El numero lo pone ESTA plantilla; la region solo aporta
//  el texto en BANDERAS.titulo y PRONOSTICO.titulo, SIN numero ni "Bloque".
//  ORIENTATIVA (opcional) aporta ademas ORIENTATIVA.bloque ('4', '6'...):
//  la plantilla antepone "Bloque N · ". Si la region no lo define, la
//  tabla sale sin numero. Su titulo tampoco lleva numero ni "Bloque".
//
//  Archivo de salida: tarjeta_[REGION].docx
//  Carpeta de salida: variable de entorno OUT_DIR (por defecto /home/claude)
// ═══════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, PageBreak, VerticalAlign
} = require('docx');

// ---------- constantes comunes a todas las regiones ----------
const FONT = 'Arial';
const LIGHT = 'EEF3F5';   // primera columna
const ZEBRA = 'F6F8F9';   // filas alternas
const W    = 10586;      // A4 menos margenes laterales de 660 DXA
const MARGIN = { top: 440, right: 660, bottom: 380, left: 660 };
// El recuadro de urgencia NO va en rojo a proposito: el paciente lo ve
// desde su lado de la mesa y un bloque rojo comunica alarma. Se marca
// con borde grueso y negrita, que se lee a 40 cm y no a un metro.

function generarTarjeta(REGION, CONFIG, CONTENIDO) {
  // ---------- CONFIG por region ----------
  //  DARK     cabeceras de tabla; cambia por region para distinguir las
  //           tarjetas de un vistazo en el portafolios:
  //           lumbar 1F4E5F · cervical 4A5A7A · hombro 1F5F4E
  //           cadera 6A4A6A · rodilla 7A5A2E
  //  SZ_A     cuerpo de tabla, cara A (half-points: 18 = 9 pt)
  //  SZ_B     cuerpo de tabla, cara B (17 = 8,5 pt). Si una region no
  //           cabe, baja SZ_B a 16 o 15 antes de recortar contenido. El
  //           ajuste fino se hace en Docs: LibreOffice parte las lineas
  //           mas ancho y da un resultado mas pesimista que el editor.
  //  SPLIT_A  true separa A y A2 (mucho cribado). Requiere TITULOS.caraA2,
  //           TITULOS.pieA (pie de A cuando se corta) y TITULOS.pieA2.
  //  SPLIT_B  true separa B y C (muchos sindromes). Requiere TITULOS.caraC,
  //           TITULOS.pieB (pie de B cuando se corta) y TITULOS.pieC.
  const { DARK, SZ_A = 18, SZ_B = 17, SPLIT_A = false, SPLIT_B = false } = CONFIG;
  const { URGENCIA, BANDERAS, BISAGRA, ARBOL, SINDROMES, ORIENTATIVA, PRONOSTICO, TITULOS } = CONTENIDO;
  if (!DARK) throw new Error('CONFIG.DARK es obligatorio');
  // El numero de bloque lo pone la plantilla. Si la region aun lo trae
  // en el texto ("1 · ...", "Bloque 6 · ..."), avisa en vez de duplicarlo.
  const PREFIJO_NUM = /^\s*(bloque\s*)?\d+(\s*(y|-|–)\s*\d+)?\s*[·.:)-]/i;
  [['BANDERAS', BANDERAS], ['PRONOSTICO', PRONOSTICO], ['ORIENTATIVA', ORIENTATIVA]].forEach(([n, o]) => {
    if (!o) return;
    if (PREFIJO_NUM.test(o.titulo)) {
      console.warn(`AVISO [${REGION}] ${n}.titulo empieza por un numero: "${o.titulo.slice(0, 30)}…". Quitalo: la plantilla pone "Bloque N ·".`);
    }
  });
  const OUTPUT = path.join(process.env.OUT_DIR || '/home/claude', `tarjeta_${REGION}.docx`);

  // ---------- helpers ----------
  let CSZ = SZ_A;          // tamano de celda vigente; lo cambia cada cara

  const r = (text, o = {}) => new TextRun({
    text, font: FONT, size: o.size || CSZ, bold: !!o.b, italics: !!o.i, color: o.c
  });

  // brk = true mete el salto de pagina en el propio titulo. Un parrafo
  // suelto con PageBreak deja una pagina en blanco cuando la cara anterior
  // termina justo al final de la hoja.
  const H1 = (a, b, brk) => new Paragraph({
    children: [r(a, { b: true, size: 27, c: DARK }), r('   ' + b, { size: 18, c: '4A6572', i: true })],
    spacing: { after: 100 },
    pageBreakBefore: !!brk
  });

  const H2 = text => new Paragraph({
    children: [r(text.toUpperCase(), { b: true, size: 20, c: DARK })],
    spacing: { before: 115, after: 50 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: DARK, space: 2 } }
  });

  const NOTE = text => new Paragraph({
    children: [r(text, { size: 16, i: true, c: '555555' })],
    spacing: { before: 30, after: 24, line: 186 }
  });

  const PIE = text => new Paragraph({
    children: [r(text, { size: 15, c: '777777', i: true })],
    spacing: { before: 90, after: 0 },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB', space: 3 } }
  });

  // recuadro de varias lineas; lines = string | { t, b, i, size }
  const BOX = (lines, o = {}) => new Paragraph({
    children: lines.flatMap((l, i) => {
      const run = typeof l === 'string'
        ? r(l, { size: o.size || 18 })
        : r(l.t, { size: l.size || o.size || 18, b: l.b, i: l.i, c: l.c });
      return i === 0 ? [run] : [new TextRun({ break: 1 }), run];
    }),
    spacing: { before: 40, after: 120, line: 220 },
    shading: o.sh ? { type: ShadingType.CLEAR, fill: o.sh, color: 'auto' } : undefined,
    border: ['top', 'bottom', 'left', 'right'].reduce((acc, k) => {
      acc[k] = { style: BorderStyle.SINGLE, size: o.thick || 10, color: o.bc || DARK, space: 5 };
      return acc;
    }, {})
  });

  const C = (content, o = {}) => new TableCell({
    width: { size: o.w, type: WidthType.DXA },
    shading: o.sh ? { type: ShadingType.CLEAR, fill: o.sh, color: 'auto' } : undefined,
    columnSpan: o.span,
    verticalAlign: VerticalAlign.TOP,
    margins: {
      top: CSZ >= 18 ? 42 : 18, bottom: CSZ >= 18 ? 42 : 18, left: 80, right: 80
    },
    children: (Array.isArray(content) ? content : [content]).map(x =>
      new Paragraph({
        children: [r(x, { size: o.size || CSZ, b: o.b, i: o.i, c: o.c })],
        spacing: { after: 0, line: CSZ >= 18 ? 222 : 188 }
      }))
  });

  const TR = cells => new TableRow({ children: cells });

  const TBL = (widths, rows) => new Table({
    columnWidths: widths,
    width: { size: W, type: WidthType.DXA },
    rows,
    borders: ['top', 'bottom', 'left', 'right', 'insideHorizontal', 'insideVertical']
      .reduce((acc, k) => {
        acc[k] = { style: BorderStyle.SINGLE, size: 4, color: 'C9D1D6' };
        return acc;
      }, {})
  });

  const TH = (labels, widths) =>
    TR(labels.map((l, i) => C(l, { w: widths[i], sh: DARK, c: 'FFFFFF', b: true, size: CSZ - 1 })));

  // ═══════════════════════════════════════════════════════════════════
  //  MONTAJE
  // ═══════════════════════════════════════════════════════════════════

  CSZ = SZ_A;
  const caraA = [H1(...TITULOS.caraA)];

  if (URGENCIA) {
    caraA.push(BOX([
      { t: URGENCIA.titulo, b: true, size: 23 },
      ...URGENCIA.lineas.map(t => ({ t, size: 18 }))
    ], { thick: 16, bc: '000000' }));
  }

  caraA.push(H2('Bloque 3 · ' + BANDERAS.titulo));
  caraA.push(TBL(BANDERAS.widths, [
    TH(BANDERAS.cabecera, BANDERAS.widths),
    ...BANDERAS.filas.map((f, ri) => TR(f.map((v, i) =>
      C(v, { w: BANDERAS.widths[i], b: i === 0, c: i === 0 ? DARK : undefined,
             sh: i === 0 ? LIGHT : (ri % 2 ? ZEBRA : undefined) }))))
  ]));
  if (BANDERAS.nota) caraA.push(NOTE(BANDERAS.nota));

  if (SPLIT_A) {
    caraA.push(PIE(TITULOS.pieA));
    caraA.push(H1(TITULOS.caraA2[0], TITULOS.caraA2[1], true));
  }

  caraA.push(H2('Bloque 4 · Bisagra'));
  caraA.push(BOX([
    { t: BISAGRA.pregunta, b: true, size: 21, c: DARK },
    { t: BISAGRA.ramas, size: 19 },
    { t: BISAGRA.apoyo, size: 16 }
  ], { thick: 10 }));
  if (BISAGRA.nota) caraA.push(NOTE(BISAGRA.nota));

  caraA.push(H2('Bloque 4 · Árbol de decisión'));
  caraA.push(TBL(ARBOL.widths, ARBOL.filas.map(([n, lineas]) =>
    TR([C(n, { w: ARBOL.widths[0], sh: LIGHT, c: DARK, b: true }), C(lineas, { w: ARBOL.widths[1] })]))));
  caraA.push(PIE(SPLIT_A ? TITULOS.pieA2 : TITULOS.pieA));

  CSZ = SZ_B;
  const caraB = [H1(TITULOS.caraB[0], TITULOS.caraB[1], true)];
  if (SINDROMES.aviso) caraB.push(NOTE(SINDROMES.aviso));

  caraB.push(H2('Bloque 4 y 5 · Fichas por síndrome · Explorar 10′ · ① y ②'));
  caraB.push(TBL(SINDROMES.widths, [
    TH(['Síndrome', 'Explorar · 10′', '① Gesto testigo', '② Medida objetiva'], SINDROMES.widths),
    ...SINDROMES.filas.map((f, ri) => {
      const z = ri % 2 ? ZEBRA : undefined;
      const cells = [C(f[0], { w: SINDROMES.widths[0], b: true, c: DARK, sh: LIGHT }),
                     C(f[1], { w: SINDROMES.widths[1], sh: z })];
      if (f[2] && f[2].span) {
        cells.push(C(f[2].span, { w: SINDROMES.widths[2] + SINDROMES.widths[3], span: 2, i: true, sh: z }));
      } else {
        cells.push(C(f[2], { w: SINDROMES.widths[2], sh: z }), C(f[3], { w: SINDROMES.widths[3], sh: z }));
      }
      return TR(cells);
    })
  ]));
  if (SINDROMES.nota) caraB.push(NOTE(SINDROMES.nota));

  if (SPLIT_B) {
    caraB.push(PIE(TITULOS.pieB));
    caraB.push(H1(TITULOS.caraC[0], TITULOS.caraC[1], true));
  }

  if (ORIENTATIVA) {
    caraB.push(H2((ORIENTATIVA.bloque ? `Bloque ${ORIENTATIVA.bloque} · ` : '') + ORIENTATIVA.titulo));
    caraB.push(TBL(ORIENTATIVA.widths, [
      TH(ORIENTATIVA.cabecera, ORIENTATIVA.widths),
      ...ORIENTATIVA.filas.map((f, ri) => TR(f.map((v, i) =>
        C(v, { w: ORIENTATIVA.widths[i], b: i === 0, c: i === 0 ? DARK : undefined,
               sh: i === 0 ? LIGHT : (ri % 2 ? ZEBRA : undefined) }))))
    ]));
    if (ORIENTATIVA.nota) caraB.push(NOTE(ORIENTATIVA.nota));
  }

  caraB.push(H2('Bloque 6 · ' + PRONOSTICO.titulo));
  caraB.push(TBL(PRONOSTICO.widths, [
    TH(PRONOSTICO.cabecera, PRONOSTICO.widths),
    ...PRONOSTICO.filas.map((f, ri) => TR(f.map((v, i) =>
      C(v, { w: PRONOSTICO.widths[i], b: i === 0, c: i === 0 ? DARK : undefined,
             sh: i === 0 ? LIGHT : (ri % 2 ? ZEBRA : undefined) }))))
  ]));
  if (PRONOSTICO.nota) caraB.push(NOTE(PRONOSTICO.nota));
  caraB.push(PIE(SPLIT_B ? TITULOS.pieC : TITULOS.pieB));

  const doc = new Document({
    creator: 'Edu',
    title: `Tarjeta ${REGION} · extracto de la guía clínica`,
    styles: { default: { document: { run: { font: FONT, size: SZ_B } } } },
    sections: [{
      properties: { page: { margin: MARGIN } },
      children: [...caraA, ...caraB]
    }]
  });

  Packer.toBuffer(doc).then(buf => {
    fs.writeFileSync(OUTPUT, buf);
    console.log('ok →', OUTPUT);
  });
}

module.exports = generarTarjeta;
