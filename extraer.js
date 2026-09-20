// Genera <región>.data.json a partir de tarjeta_<región>.js (+ spa_<región>.js si existe).
// Uso:  node extraer.js tarjeta_hombro.js [salida.json]
const fs = require('fs');
const { datosDeRegion, aJSON } = require('./datos');

const archivo = process.argv[2];
if (!archivo) { console.error('Uso: node extraer.js tarjeta_<region>.js [salida.json]'); process.exit(1); }
let datos;
try { datos = datosDeRegion(archivo); } catch (e) { console.error(e.message); process.exit(1); }
const salida = process.argv[3] || `${datos.REGION}.data.json`;
fs.writeFileSync(salida, aJSON(datos));
console.log('ok', salida);
