// ═══════════════════════════════════════════════════════════════════
//  CABLEADO DE LA SPA · LUMBAR
//  Esto NO es contenido de la tarjeta: no añade ni reescribe texto
//  clínico. Solo dice cómo se enlazan entre sí las tablas que ya están
//  en tarjeta_lumbar.js, nombrando filas que existen allí. El docx no lo
//  ve: plantilla_tarjetas.js no lee este archivo. datos.js lo funde con
//  el CONTENIDO, una clave por campo.
//
//  Lumbar mezcla los dos mecanismos: el nodo 4 reparte un patrón limpio
//  en una sola línea, como el nodo 4 de hombro (`patrones`); el nodo 3b,
//  en cambio, tiene dos líneas con destinos distintos, como el nodo 6 de
//  cadera (`botones` fijos, no forzar `patrones` ahí).
// ═══════════════════════════════════════════════════════════════════

const ENLACES = {
  '2': { botones: [{ pantalla: 'banderas', sub: 'Otras banderas rojas, o síntomas que la exploración mecánica no reproduce' }] },
  '3b': { botones: [
    { pantalla: 'sindrome', fila: 'Estenosis de canal', sub: 'Síntomas al caminar o de pie que mejoran al sentarse o con flexión' },
    { pantalla: 'sindrome', fila: 'Dolor radicular', sub: 'Rasgos neuropáticos' },
    { pantalla: 'sindrome', fila: 'Radiculopatía', sub: 'Déficit de fuerza, sensibilidad o reflejos' }
  ] },
  // El propio nodo 4 es la tabla orientativa (disco / faceta / SI): botón directo,
  // además de los cuatro patrones que reparte.
  '4': {
    botones: [{ pantalla: 'orientativa', sub: 'Comparativa disco / faceta / SI' }],
    patrones: {
      'DISCOGÉNICO': 'Discogénico',
      'FACETARIO': 'Facetario',
      'SACROILÍACA': 'Sacroilíaca',
      'MIOFASCIAL': 'Miofascial'
    }
  }
};

// Fila de SINDROMES -> fila de PRONOSTICO. Solo hace falta nombrar las que no coinciden
// de nombre o no tienen fila: la tarjeta no da pronóstico para miofascial (null explícito:
// «Curso general» es una fila propia de la tabla, no está dicho que sea la suya).
const PRONOSTICO_DE = {
  'Dolor radicular': 'Radicular',
  'Estenosis de canal': 'Estenosis',
  'Sacroilíaca': 'Sacroilíaca · PRPPP',
  'Miofascial': null
};

// Fichas con algo propio. Las que vienen del nodo 4 (patrones) ya llevan su pista
// automática (la condición del árbol); las del nodo 3b, no, así que la llevan aquí.
const FICHAS = {
  'Estenosis de canal': { pista: 'Síntomas al caminar o de pie que mejoran al sentarse o con flexión (nodo 3b)' },
  'Dolor radicular': { pista: 'Rasgos neuropáticos (nodo 3b)' },
  'Radiculopatía': { pista: 'Déficit de fuerza, sensibilidad o reflejos (nodo 3b)' },
  // SINDROMES.nota aquí es específica de sacroilíaca (tests de disfunción de movimiento SI)
  'Sacroilíaca': { nota: true }
};

// La nota de PRONOSTICO se parte en dos párrafos por esta frase, como en hombro y cadera.
const CORTE_NOTA = 'Dosis y progresión';

module.exports = { ENLACES, PRONOSTICO_DE, FICHAS, CORTE_NOTA };
