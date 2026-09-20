// Extrae { REGION, CONFIG, CONTENIDO } de un tarjeta_<región>.js SIN generar el docx.
// Uso:  node tools/extraer-js.js data/tarjeta_lumbar.js [salida.json]  (por defecto: junto a la tarjeta)
// Como módulo:  const { leer } = require('./extraer-js');  leer('data/tarjeta_hombro.js')
const Module = require('module');
const path = require('path');
const fs = require('fs');

function leer(archivo) {
  const ruta = path.resolve(archivo);
  let captura = null;
  const cargar = Module._load;
  Module._load = function (peticion, ...resto) {
    // Sustituimos el generador: en vez de montar el docx, guardamos lo que recibe
    if (/(^|\/)plantilla_tarjetas(\.js)?$/.test(peticion)) return (REGION, CONFIG, CONTENIDO) => { captura = { REGION, CONFIG, CONTENIDO }; };
    return cargar.call(this, peticion, ...resto);
  };
  try {
    delete require.cache[ruta];   // que se pueda leer varias veces en el mismo proceso
    require(ruta);
  } finally {
    Module._load = cargar;
  }
  if (!captura) throw new Error('El archivo no llamó a generarTarjeta: ' + archivo);
  return captura;
}

module.exports = { leer };

if (require.main === module) {
  const archivo = process.argv[2];
  if (!archivo) { console.error('Uso: node tools/extraer-js.js data/tarjeta_<region>.js [salida.json]'); process.exit(1); }
  let captura;
  try { captura = leer(archivo); } catch (e) { console.error(e.message); process.exit(1); }
  const salida = process.argv[3] || path.join(path.dirname(archivo), `${captura.REGION}.data.json`);
  fs.writeFileSync(salida, JSON.stringify(captura, null, 1));
  console.log('ok', salida);
}
