// ═══════════════════════════════════════════════════════════════════
//  CABLEADO DE LA SPA · CADERA
//  Esto NO es contenido de la tarjeta: no añade ni reescribe texto
//  clínico. Solo dice cómo se enlazan entre sí las tablas que ya están
//  en tarjeta_cadera.js, nombrando filas que existen allí. El docx no lo
//  ve: plantilla_tarjetas.js no lee este archivo. datos.js lo funde con
//  el CONTENIDO, una clave por campo.
//
//  A diferencia de hombro, el árbol de cadera no reparte un patrón
//  limpio en una sola línea: el nodo 6 mezcla, en dos líneas, entidades
//  de SINDROMES (SDTM, Neuropatías, Sensibilización central) y entidades
//  que solo existen en ORIENTATIVA (Aductor, Psoas ilíaco, Inguinal,
//  Púbico: la tarjeta las llama «entidades de Doha»). En vez de forzar el
//  mecanismo de «patrones» de hombro, aquí se listan los botones fijos.
// ═══════════════════════════════════════════════════════════════════

const ENLACES = {
  '1': { botones: [{ pantalla: 'banderas', sub: 'Sospecha de fractura de estrés del cuello femoral' }] },
  '2': { botones: [{ pantalla: 'banderas', sub: 'Otras banderas rojas o dolor atípico' }] },
  '4': { botones: [{ pantalla: 'sindrome', fila: 'Lesión aguda de ingle', sub: 'Evento desencadenante concreto y reciente' }] },
  // Agrupación propia: la tarjeta dice «identificar entidad» sin nombrarlas todas; son las
  // cinco filas de SINDROMES cuyo propio texto habla de cribado intraarticular (flexión-RI,
  // FADDIR, Thomas): FAIS, Labrum, Ligamento redondo e inestabilidad, Condropatía, Artrosis.
  '5b': { botones: [
    { pantalla: 'sindrome', fila: 'FAIS' },
    { pantalla: 'sindrome', fila: 'Labrum' },
    { pantalla: 'sindrome', fila: 'Ligamento redondo e inestabilidad' },
    { pantalla: 'sindrome', fila: 'Condropatía' },
    { pantalla: 'sindrome', fila: 'Artrosis' }
  ] },
  '6': { botones: [
    { pantalla: 'orientativa', sub: 'Aductor · psoas ilíaco · inguinal · púbico (entidades de Doha)' },
    { pantalla: 'sindrome', fila: 'SDTM', sub: 'Trocánter + derotación externa resistida' },
    { pantalla: 'sindrome', fila: 'Neuropatías', sub: 'Tinel, arch and twist u otro patrón neuropático' },
    { pantalla: 'sindrome', fila: 'Sensibilización central', sub: 'Nada encaja o dolor extenso' }
  ] }
};

// Fila de SINDROMES -> fila de PRONOSTICO. Solo hace falta nombrar las que no coinciden
// de nombre o no tienen fila: la tarjeta no da pronóstico para sensibilización central
// (null explícito: para test-fuente.js, «no tiene, y es a propósito», no un despiste).
const PRONOSTICO_DE = {
  'Lesión aguda de ingle': 'Aductor y resto de Doha',
  'Sensibilización central': null
};

// Fichas con algo propio. Las cinco intraarticulares comparten pista (nodo 5b, «identificar
// entidad» sin nombrarlas: agrupación propia). SINDROMES.nota aquí es general —no de un solo
// síndrome, como en hombro—, así que se muestra en las nueve fichas.
const INTRAARTICULAR = 'Intraarticular probable (nodo 5b): identificar la entidad';
const FICHAS = {
  'FAIS': { pista: INTRAARTICULAR, nota: true },
  'Labrum': { pista: INTRAARTICULAR, nota: true },
  'Ligamento redondo e inestabilidad': { pista: INTRAARTICULAR, nota: true },
  'Condropatía': { pista: INTRAARTICULAR, nota: true },
  'Artrosis': { pista: INTRAARTICULAR, nota: true },
  'Lesión aguda de ingle': { pista: 'Evento desencadenante concreto y reciente (nodo 4)', orientativa: true, nota: true },
  'SDTM': { pista: 'Trocánter + derotación externa resistida (nodo 6)', nota: true },
  'Neuropatías': { pista: 'Patrón neuropático: Tinel, arch and twist u otro (nodo 6)', nota: true },
  'Sensibilización central': { pista: 'Nada encaja o dolor extenso (nodo 6)', nota: true }
};

module.exports = { ENLACES, PRONOSTICO_DE, FICHAS };
