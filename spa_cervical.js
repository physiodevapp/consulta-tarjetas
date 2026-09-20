// ═══════════════════════════════════════════════════════════════════
//  CABLEADO DE LA SPA · CERVICAL
//  Esto NO es contenido de la tarjeta: no añade ni reescribe texto
//  clínico. Solo dice cómo se enlazan entre sí las tablas que ya están
//  en tarjeta_cervical.js, nombrando filas que existen allí. El docx no
//  lo ve: plantilla_tarjetas.js no lee este archivo. datos.js lo funde
//  con el CONTENIDO, una clave por campo.
//
//  Cervical no tiene ningún nodo con el patrón limpio de una línea de
//  hombro o del nodo 4 de lumbar: los cuatro nodos con destino (3b, 4,
//  5b, 6) van todos por `botones` fijos, como el nodo 6 de cadera.
//    - 3b: dos patrones (DOLOR RADICULAR, RADICULOPATÍA) en dos líneas,
//      mezclados con una nota sobre aura migrañosa que no es destino.
//    - 4: un único destino (LATIGAZO CERVICAL).
//    - 5b: dos líneas; «CEFALEA PRIMARIA» (migraña o tensional) no tiene
//      ficha propia — es precisamente la tabla orientativa — y VESTIBULAR
//      no tiene ficha ni pantalla en esta SPA (queda como texto).
//    - 6: tres sububicaciones (craneocervical, faceta, cervical baja),
//      pero las tres son la MISMA ficha (Idiopático ya las distingue en
//      su propio texto): un solo botón, no tres.
// ═══════════════════════════════════════════════════════════════════

const ENLACES = {
  '2': { botones: [{ pantalla: 'banderas', sub: 'Otras banderas rojas, o un relato que no sigue el patrón mecánico' }] },
  '3b': { botones: [
    { pantalla: 'sindrome', fila: 'Dolor radicular', sub: 'Quemazón o descargas + ULNT1 positivo con diferenciación estructural' },
    { pantalla: 'sindrome', fila: 'Radiculopatía', sub: 'Déficit de sensibilidad, fuerza o reflejos' }
  ] },
  '4': { botones: [{ pantalla: 'sindrome', fila: 'Latigazo (WAD)', sub: 'Inicio con traumatismo (tráfico, deporte, ocio)' }] },
  '5b': { botones: [
    { pantalla: 'sindrome', fila: 'Cefalea cervicogénica', sub: 'Cefalea unilateral sin cambio de lado que empieza en el cuello' },
    { pantalla: 'orientativa', sub: 'Criterios de migraña o tensional → cefalea primaria' },
    { pantalla: 'sindrome', fila: 'Mareo cervicogénico', sub: 'Aturdimiento o inestabilidad ligados al cuello' }
  ] },
  '6': { botones: [{ pantalla: 'sindrome', fila: 'Idiopático', sub: 'Craneocervical, faceta cervical o cervical baja y cervicotorácica' }] }
};

// Fila de SINDROMES -> fila de PRONOSTICO. Solo hace falta nombrar la que no coincide
// de nombre (las otras cinco sí coinciden, a diferencia de cadera y lumbar).
const PRONOSTICO_DE = {
  'Latigazo (WAD)': 'Latigazo'
};

// Fichas con algo propio. Ninguna llega por `patrones`, así que todas llevan pista a
// mano (la condición del árbol que lleva a ellas). SINDROMES.nota es aquí específica de
// diferenciar dolor referido de radicular: en las dos fichas donde importa esa distinción.
const FICHAS = {
  'Idiopático': { pista: 'Craneocervical, faceta cervical o cervical baja y cervicotorácica (nodo 6)' },
  'Latigazo (WAD)': { pista: 'Inicio con traumatismo: tráfico, deporte u ocio (nodo 4)' },
  'Dolor radicular': { pista: 'Quemazón o descargas + ULNT1 positivo (nodo 3b)', nota: true },
  'Radiculopatía': { pista: 'Déficit de sensibilidad, fuerza o reflejos (nodo 3b)', nota: true },
  'Cefalea cervicogénica': { pista: 'Cefalea unilateral sin cambio de lado que empieza en el cuello (nodo 5b)', orientativa: true },
  'Mareo cervicogénico': { pista: 'Aturdimiento o inestabilidad ligados al cuello (nodo 5b)' }
};

// La nota de PRONOSTICO se parte en dos párrafos por esta frase, como en las demás.
const CORTE_NOTA = 'Dosis y progresión';

module.exports = { ENLACES, PRONOSTICO_DE, FICHAS, CORTE_NOTA };
