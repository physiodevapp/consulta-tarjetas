// ═══════════════════════════════════════════════════════════════════
//  CABLEADO DE LA SPA · RODILLA
//  Esto NO es contenido de la tarjeta: no añade ni reescribe texto
//  clínico. Solo dice cómo se enlazan entre sí las tablas que ya están
//  en tarjeta_rodilla.js, nombrando filas que existen allí. El docx no
//  lo ve: plantilla_tarjetas.js no lee este archivo. datos.js lo funde
//  con el CONTENIDO, una clave por campo.
//
//  Rodilla no tiene ningún nodo con el patrón limpio de una línea: los
//  nodos 4 y 7 reparten en DOS líneas y, encima, mezclan destinos de
//  SINDROMES y de ORIENTATIVA (que aquí es una segunda tabla de fichas,
//  no una matriz comparativa ni una lista de entidades sin ①②, a
//  diferencia de lumbar/cervical y de cadera). Todo va por `botones`.
//  El nodo 7, en concreto, usa otra gramática («LOCALIZACIÓN → entidad1
//  (detalle) · entidad2 (detalle)», en minúsculas) que ni siquiera
//  parsearía `patrones` (que busca «X → ETIQUETA» en mayúsculas).
// ═══════════════════════════════════════════════════════════════════

const ENLACES = {
  '4': { botones: [
    { pantalla: 'sindrome', fila: 'LCA', sub: 'Pivote o caída de un salto + chasquido + derrame inmediato' },
    { pantalla: 'sindrome', fila: 'LCM', sub: 'Valgo con el pie fijo' },
    { pantalla: 'sindrome', fila: 'Menisco', sub: 'Giro con el pie apoyado + bloqueo o enganche + derrame en 6–24 h' },
    { pantalla: 'sindrome', fila: 'LCP', sub: 'Golpe en tibia anterior con rodilla flexionada (salpicadero)' },
    { pantalla: 'sindrome', fila: 'LLE y EPL', sub: 'Golpe anteromedial o varo cerca de la extensión' },
    { pantalla: 'sindrome', fila: 'Inestabilidad rotuliana', sub: 'La rótula «se salió», aprensión al trasladarla lateralmente' },
    { pantalla: 'sindrome', fila: 'Fracturas', sub: 'Golpe directo anterior, dolor con extensión resistida, escalón palpable' }
  ] },
  // Cadera y columna lumbar solo existen como fila de ORIENTATIVA («Referido de
  // cadera o lumbar»), no como ficha de síndrome.
  '6': { botones: [{ pantalla: 'orientativa', sub: 'Cadera (artrosis) o columna lumbar (radiculopatía o pseudorradiculopatía)' }] },
  // Dolor persistente o sin traumatismo, por localización. Algunas entidades solo
  // están en SINDROMES, otras solo en ORIENTATIVA (segunda tabla de fichas de esta
  // región); un mismo botón cubre menisco/LCP aunque el nodo los repita por lado.
  '7': { botones: [
    { pantalla: 'sindrome', fila: 'Tendinopatía rotuliana', sub: 'Anterior: polo inferior, sentadilla monopodal' },
    { pantalla: 'sindrome', fila: 'Dolor femororrotuliano', sub: 'Anterior: difuso, sentadilla' },
    { pantalla: 'sindrome', fila: 'Hoffa', sub: 'Anterior: recurvatum, test de Hoffa' },
    { pantalla: 'sindrome', fila: 'Bursitis pre e infrarrotuliana', sub: 'Anterior: superficial, arrodillarse' },
    { pantalla: 'sindrome', fila: 'Inestabilidad rotuliana', sub: 'Anterior: fallo, aprensión' },
    { pantalla: 'sindrome', fila: 'Lesión osteocondral', sub: 'Anterior: bloqueo' },
    { pantalla: 'sindrome', fila: 'Apofisitis del adolescente', sub: 'Anterior, en menores: apofisitis por tracción' },
    { pantalla: 'sindrome', fila: 'Menisco', sub: 'Medial o lateral' },
    { pantalla: 'sindrome', fila: 'LCP', sub: 'Posterior, crónico' },
    { pantalla: 'orientativa', sub: 'Artrosis, bursitis anserina, plica medial, cintilla iliotibial, tibioperonea, nervio peroneo, quiste poplíteo' }
  ] }
};

// Fila de SINDROMES -> fila de PRONOSTICO. Solo hace falta nombrar las que no coinciden
// de nombre o no tienen fila: la correspondencia no es 1 a 1 (17 filas de pronóstico
// para 13 síndromes + 8 entidades de ORIENTATIVA). Lesión osteocondral: null explícito,
// la tarjeta no le da pronóstico. LCP usa la fila combinada «LCP · LLE · EPL» (general);
// LLE y EPL tiene su propia fila (específica), y coincide de nombre.
const PRONOSTICO_DE = {
  'LCP': 'LCP · LLE · EPL',
  'Dolor femororrotuliano': 'Dolor FR',
  'Apofisitis del adolescente': 'Apofisitis',
  'Lesión osteocondral': null
};

// Fichas con algo propio. Ninguna llega por `patrones` (no hay ningún nodo con el
// patrón limpio), así que las 13 llevan pista a mano. SINDROMES.nota es aquí general
// (como en cadera), así que las 13 llevan también nota:true.
const FICHAS = {
  'LCA': { pista: 'Pivote o caída de un salto + chasquido + derrame inmediato (nodo 4)', nota: true },
  'LCM': { pista: 'Valgo con el pie fijo (nodo 4)', nota: true },
  'Menisco': { pista: 'Giro con bloqueo o enganche, o dolor medial/lateral persistente (nodos 4 y 7)', nota: true },
  'LCP': { pista: 'Golpe en tibia anterior con rodilla flexionada, o dolor posterior crónico (nodos 4 y 7)', nota: true },
  'LLE y EPL': { pista: 'Golpe anteromedial o varo cerca de la extensión (nodo 4)', nota: true },
  'Fracturas': { pista: 'Golpe directo anterior, dolor con extensión resistida, escalón palpable (nodo 4)', nota: true },
  'Tendinopatía rotuliana': { pista: 'Dolor anterior: polo inferior, sentadilla monopodal (nodo 7)', nota: true },
  'Dolor femororrotuliano': { pista: 'Dolor anterior difuso, sentadilla (nodo 7)', nota: true },
  'Inestabilidad rotuliana': { pista: 'La rótula «se salió», o fallo y aprensión sin traumatismo (nodos 4 y 7)', nota: true },
  'Hoffa': { pista: 'Dolor anterior: recurvatum, test de Hoffa (nodo 7)', nota: true },
  'Bursitis pre e infrarrotuliana': { pista: 'Dolor anterior superficial, arrodillarse (nodo 7)', nota: true },
  'Apofisitis del adolescente': { pista: 'Dolor anterior en menores: apofisitis por tracción (nodo 7)', nota: true },
  'Lesión osteocondral': { pista: 'Dolor anterior con bloqueo mecánico (nodo 7)', nota: true }
};

// Agrupación propia: el propio nodo 7 organiza las entidades de ORIENTATIVA por
// localización (medial, lateral, posterior); se refleja aquí porque cubre exactamente
// las ocho filas, sin resto.
const ORIENTATIVA_GRUPOS = {
  aviso: 'Agrupación propia: la tarjeta las reparte por localización en el nodo 7 (medial, lateral, posterior), no en una tabla aparte.',
  grupos: [
    { titulo: 'Medial', filas: ['Artrosis', 'Bursitis anserina', 'Plica sinovial medial'] },
    { titulo: 'Lateral', filas: ['Cintilla iliotibial', 'Tibioperonea proximal', 'Nervio peroneo común'] },
    { titulo: 'Posterior', filas: ['Quiste poplíteo', 'Referido de cadera o lumbar'] }
  ]
};

// La nota de PRONOSTICO se parte en dos párrafos por esta frase, como en las demás.
const CORTE_NOTA = 'Dosis y progresión';

module.exports = { ENLACES, PRONOSTICO_DE, FICHAS, ORIENTATIVA_GRUPOS, CORTE_NOTA };
