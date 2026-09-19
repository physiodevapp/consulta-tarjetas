// Extrae { REGION, CONFIG, CONTENIDO } de un tarjeta_<región>.js SIN generar el docx.
// Uso:  node extraer-js.js tarjeta_lumbar.js [salida.json]     (por defecto: <region>.data.json)
const Module = require('module');
const path = require('path');
const fs = require('fs');

const archivo = process.argv[2];
if (!archivo) { console.error('Uso: node extraer-js.js tarjeta_<region>.js [salida.json]'); process.exit(1); }

let captura = null;
const cargar = Module._load;
Module._load = function (peticion, ...resto) {
  // Sustituimos el generador: en vez de montar el docx, guardamos lo que recibe
  if (/(^|\/)plantilla_tarjetas(\.js)?$/.test(peticion)) return (REGION, CONFIG, CONTENIDO) => { captura = { REGION, CONFIG, CONTENIDO }; };
  return cargar.call(this, peticion, ...resto);
};
require(path.resolve(archivo));
Module._load = cargar;

if (!captura) { console.error('El archivo no llamó a generarTarjeta'); process.exit(1); }
const salida = process.argv[3] || `${captura.REGION}.data.json`;
fs.writeFileSync(salida, JSON.stringify(captura, null, 1));
console.log('ok', salida);
