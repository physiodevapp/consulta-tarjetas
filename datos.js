// De la tarjeta de una región a los datos que consume la SPA.
//
//   tarjeta_<región>.js  → CONTENIDO (el texto clínico; fuente de verdad)
//   spa_<región>.js      → campos propios de la SPA (enlaces, mapas, agrupaciones).
//                          No son contenido de la tarjeta: solo nombran filas que ya existen.
//
// La forma de salida es la misma que consumía la SPA cuando el JSON se sacaba del docx
// con extraer.py: celdas del árbol unidas con «\n», cabecera fija de SINDROMES, y los
// pies con el nombre que usa la SPA (TITULOS.pieA2 y PRONOSTICO.pie).
const fs = require('fs');
const path = require('path');
const { leer } = require('./extraer-js');

// La cabecera de la tabla de síndromes no está en el CONTENIDO: la fija plantilla_tarjetas.js
const CABECERA_SINDROMES = ['Síndrome', 'Explorar · 10′', '① Gesto testigo', '② Medida objetiva'];

const cap1 = s => s.charAt(0).toUpperCase() + s.slice(1);
// Las celdas del árbol son arrays de líneas en el .js; la SPA las quiere unidas.
// Las celdas con { span } (síndromes sin ① ni ②) pasan tal cual.
const celda = v => Array.isArray(v) ? v.join('\n') : v;
const filas = f => f.map(fila => fila.map(celda));

function normalizar({ REGION, CONFIG, CONTENIDO }, propio = {}) {
  const { URGENCIA, BANDERAS, BISAGRA, ARBOL, SINDROMES, ORIENTATIVA, PRONOSTICO, TITULOS } = CONTENIDO;
  const { ACENTO_OSCURO, ...campos } = propio;
  const datos = {
    REGION,
    NOMBRE: cap1(REGION),
    // Color de la región (CONFIG.DARK). El de tema oscuro viene aclarado desde
    // spa_<región>.js: hace falta contraste suficiente sobre fondo oscuro.
    ACENTO: { claro: '#' + CONFIG.DARK, oscuro: '#' + (ACENTO_OSCURO || CONFIG.DARK) },
    TITULOS: {
      caraA: TITULOS.caraA.join('   '),
      caraB: TITULOS.caraB.join('   '),
      // pie de la cara A: pieA2 solo si la cara A va partida en dos
      pieA2: CONFIG.SPLIT_A ? TITULOS.pieA2 : TITULOS.pieA
    },
    BANDERAS: { titulo: BANDERAS.titulo, cabecera: BANDERAS.cabecera, filas: filas(BANDERAS.filas), nota: BANDERAS.nota },
    BISAGRA: { pregunta: BISAGRA.pregunta, ramas: BISAGRA.ramas, apoyo: BISAGRA.apoyo },
    ARBOL: { filas: ARBOL.filas.map(([n, lineas]) => [n, celda(lineas)]) },
    SINDROMES: { aviso: SINDROMES.aviso, cabecera: CABECERA_SINDROMES, filas: filas(SINDROMES.filas), nota: SINDROMES.nota },
    PRONOSTICO: {
      titulo: PRONOSTICO.titulo, cabecera: PRONOSTICO.cabecera, filas: filas(PRONOSTICO.filas), nota: PRONOSTICO.nota,
      // pie de la cara B: pieC solo si la cara B va partida en dos
      pie: CONFIG.SPLIT_B ? TITULOS.pieC : TITULOS.pieB
    }
  };
  if (BISAGRA.nota) datos.BISAGRA.nota = BISAGRA.nota;
  if (URGENCIA) datos.URGENCIA = { titulo: URGENCIA.titulo, lineas: URGENCIA.lineas };
  if (ORIENTATIVA) datos.ORIENTATIVA = {
    titulo: ORIENTATIVA.titulo, bloque: ORIENTATIVA.bloque || null,
    cabecera: ORIENTATIVA.cabecera, filas: filas(ORIENTATIVA.filas), nota: ORIENTATIVA.nota
  };
  // Campos propios de la SPA: uno por clave, al mismo nivel que el contenido
  for (const [k, v] of Object.entries(campos)) datos[k] = v;
  return datos;
}

// Lee tarjeta_<región>.js y, si existe junto a él, spa_<región>.js
function datosDeRegion(archivo) {
  const captura = leer(archivo);
  const propio = path.join(path.dirname(path.resolve(archivo)), `spa_${captura.REGION}.js`);
  return normalizar(captura, fs.existsSync(propio) ? require(propio) : {});
}

const aJSON = datos => JSON.stringify(datos, null, 1) + '\n';

module.exports = { normalizar, datosDeRegion, aJSON, CABECERA_SINDROMES };
