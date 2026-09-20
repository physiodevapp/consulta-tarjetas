// Genera <región>.data.json a partir de tarjeta_<región>.js (+ spa_<región>.js si existe).
// Uso:  node tools/extraer.js data/tarjeta_hombro.js [salida.json]
const fs = require('fs');
const path = require('path');
const { datosDeRegion, aJSON } = require('./datos');

const archivo = process.argv[2];
if (!archivo) { console.error('Uso: node tools/extraer.js data/tarjeta_<region>.js [salida.json]'); process.exit(1); }
let datos;
try { datos = datosDeRegion(archivo); } catch (e) { console.error(e.message); process.exit(1); }
// Sin salida explícita: junto a la tarjeta de origen (la carpeta data/)
const salida = process.argv[3] || path.join(path.dirname(archivo), `${datos.REGION}.data.json`);
fs.writeFileSync(salida, aJSON(datos));
console.log('ok', salida);
