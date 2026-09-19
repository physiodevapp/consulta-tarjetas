// ═══════════════════════════════════════════════════════════════════
//  CABLEADO DE LA SPA · HOMBRO
//  Esto NO es contenido de la tarjeta: no añade ni reescribe texto
//  clínico. Solo dice cómo se enlazan entre sí las tablas que ya están
//  en tarjeta_hombro.js, nombrando filas que existen allí. Lo que sí es
//  propio (la agrupación de la tabla orientativa y sus rótulos) se avisa
//  en pantalla. El docx no lo ve: plantilla_tarjetas.js no lee este
//  archivo. datos.js lo funde con el CONTENIDO, una clave por campo.
// ═══════════════════════════════════════════════════════════════════

// Botones de cada nodo del árbol.
//   botones   destino fijo: { pantalla: 'banderas' | 'orientativa' | 'sindrome', fila? }
//   patrones  ETIQUETA del propio nodo (en mayúsculas) → fila de SINDROMES.
//             La SPA parte la línea del nodo en «condición → ETIQUETA» y usa
//             la condición, literal de la tarjeta, como subtítulo del botón.
//             El resto de líneas de ese nodo cierra el árbol como nota.
const ENLACES = {
  '1':  { botones: [{ pantalla: 'banderas' }] },
  '2b': { botones: [{ pantalla: 'orientativa' }, { pantalla: 'sindrome', fila: 'Hombro congelado' }] },
  '4':  { patrones: {
            'ACROMIOCLAVICULAR': 'Acromioclavicular',
            'INESTABILIDAD': 'Inestabilidad GH',
            'ROTURA DEL MANGUITO': 'Rotura del manguito',
            'SLAP': 'Lesión SLAP',
            'SAPS': 'Dolor subacromial (SAPS)'
          } }
};

// Fila de SINDROMES → fila de PRONOSTICO (los nombres no coinciden).
const PRONOSTICO_DE = {
  'Dolor subacromial (SAPS)': 'SAPS',
  'Inestabilidad GH': 'Inestabilidad',
  'Acromioclavicular': 'Acromioclavicular',
  'Lesión SLAP': 'SLAP',
  'Rotura del manguito': 'Rotura del manguito',
  'Hombro congelado': 'Hombro congelado'
};

// Fichas con algo propio. Las que no aparecen aquí llevan como pista la
// condición del árbol que lleva a ellas.
//   pista        línea bajo el título (dice por qué se ha llegado a esta ficha)
//   orientativa  botón a la tabla orientativa
//   nota         mostrar SINDROMES.nota, que en hombro habla solo del congelado
const FICHAS = {
  'Hombro congelado': {
    pista: 'Movilidad pasiva limitada igual que la activa (nodo 2b)',
    orientativa: true,
    nota: true
  }
};

// Agrupación propia de la tabla orientativa: la tarjeta lista las 7
// condiciones seguidas, la SPA las reparte por lo que hacen con la pasiva.
//   grupos   en orden de pantalla; «resto» recoge las filas no nombradas,
//            «plegado» mete el grupo entero en un plegable, «enlace» es un botón
//   dice     frase de la fila sobre la pasiva; solo se muestra si está
//            literal en el texto de esa fila de la tarjeta
const ORIENTATIVA_GRUPOS = {
  aviso: 'Agrupación propia: la tarjeta lista las 7 condiciones en una sola tabla.',
  grupos: [
    { titulo: 'Pasiva limitada, como el congelado', resto: true,
      filas: ['Artrosis GH', 'Neoplasia', 'Luxación bloqueada', 'Fractura'] },
    { enlace: { pantalla: 'sindrome', fila: 'Hombro congelado', sub: 'Ficha del síndrome' } },
    { titulo: 'Se parecen al congelado, pero con pasiva no limitada', plegado: true,
      filas: ['Dolor del manguito', 'Acromioclavicular', 'Cervicogénico'] }
  ],
  dice: {
    'Dolor del manguito': 'movilidad pasiva no muy limitada',
    'Acromioclavicular': 'sin restricción pasiva',
    'Cervicogénico': 'sin restricción pasiva GH',
    'Luxación bloqueada': 'rigidez activa y pasiva similar al congelado'
  }
};

// La nota de PRONOSTICO se parte en dos párrafos por esta frase. El texto
// no se toca: solo se decide dónde respira.
const CORTE_NOTA = 'Dosis y progresión';

// CONFIG.DARK (1F5F4E) aclarado para que contraste sobre fondo oscuro.
const ACENTO_OSCURO = '5CC0A3';

module.exports = { ENLACES, PRONOSTICO_DE, FICHAS, ORIENTATIVA_GRUPOS, CORTE_NOTA, ACENTO_OSCURO };
