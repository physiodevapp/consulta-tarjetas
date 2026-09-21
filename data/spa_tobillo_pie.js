// ═══════════════════════════════════════════════════════════════════
//  CABLEADO DE LA SPA · TOBILLO Y PIE
//  Esto NO es contenido de la tarjeta: no añade ni reescribe texto
//  clínico. Solo dice cómo se enlazan entre sí las tablas que ya están
//  en tarjeta_tobillo_pie.js, nombrando filas que existen allí. El docx
//  no lo ve: plantilla_tarjetas.js no lee este archivo. datos.js lo
//  funde con el CONTENIDO, una clave por campo.
//
//  La región más densa hasta ahora: 21 síndromes + 15 entidades de
//  ORIENTATIVA. Ningún nodo tiene el patrón limpio de una línea (como
//  hombro o el nodo 4 de lumbar): el nodo 4 lo parece a primera vista,
//  pero uno de sus destinos («ESGUINCE LATERAL») lleva un «→» anidado
//  dentro del propio paréntesis explicativo, lo que rompe el split de
//  `patrones`; y el nodo 5 tiene un destino con dos fichas posibles
//  separadas por «o» en vez de «·». Todo va por `botones`.
//  El nodo 7 (14 destinos) y el nodo 8 (con ORIENTATIVA de por medio)
//  son los más cargados de toda la SPA.
// ═══════════════════════════════════════════════════════════════════

const ENLACES = {
  '1': { botones: [{ pantalla: 'banderas' }] },
  // Ottawa/Thompson/Lisfranc/calcáneo: deriva antes de seguir explorando. Las tres
  // fichas de destino no muestran ①② (SINDROMES las marca con { span }: no procede).
  '3': { botones: [
    { pantalla: 'banderas', sub: 'Reglas de Ottawa completas' },
    { pantalla: 'sindrome', fila: 'Rotura del Aquiles', sub: 'Thompson positivo' },
    { pantalla: 'sindrome', fila: 'Lisfranc', sub: 'Mecanismo o equimosis plantar de Lisfranc' },
    { pantalla: 'sindrome', fila: 'Fracturas del pie (5.º MT, calcáneo)', sub: 'Ottawa positivo, o caída sobre el talón' }
  ] },
  // Mecanismo del tobillo agudo traumático. CALCANEOCUBOIDEA no es un síndrome propio
  // aquí: es una fila de ORIENTATIVA (calcaneocuboidea y cubometatarsiana).
  '4': { botones: [
    { pantalla: 'sindrome', fila: 'Esguince lateral agudo', sub: 'Inversión del retropié o flexión plantar con aducción' },
    { pantalla: 'sindrome', fila: 'Sindesmosis', sub: 'Rotación externa del pie con flexión dorsal forzada, contacto' },
    { pantalla: 'orientativa', sub: 'Inversión en plantígrado en terreno irregular (calcaneocuboidea)' },
    { pantalla: 'sindrome', fila: 'Luxación del tibial posterior', sub: 'Flexión dorsal e inversión con contracción forzada, chasquido medial' }
  ] },
  // Patrones pediátricos (Sever, Iselin, Köhler, Freiberg, apofisitis del tibial
  // posterior...): ninguno tiene ficha propia en esta tarjeta, se quedan en el texto
  // del nodo sin botón (como VESTIBULAR en cervical). Solo dos sí tienen destino real.
  '5': { botones: [
    { pantalla: 'orientativa', sub: 'Esguince que no se resuelve, con bloqueo (osteocondritis disecante)' },
    { pantalla: 'banderas', sub: 'Dolor nocturno con alivio rápido por AINE (osteoma osteoide)' }
  ] },
  '6': { botones: [{ pantalla: 'sindrome', fila: 'Referido lumbar', sub: 'La exploración local no reproduce el dolor conocido' }] },
  // Dolor sin traumatismo: posterior (7 fichas) + medial/lateral/anterior (7 más).
  '7': { botones: [
    { pantalla: 'sindrome', fila: 'Pinzamiento posterior', sub: 'Posterior: flexión plantar máxima' },
    { pantalla: 'sindrome', fila: 'Aquiles porción media', sub: 'Posterior: porción media del Aquiles, 2–6 cm' },
    { pantalla: 'sindrome', fila: 'Aquiles insercional', sub: 'Posterior: inserción, un dedo, flexión dorsal' },
    { pantalla: 'sindrome', fila: 'Vaina del Aquiles', sub: 'Posterior: crepitación, rango amplio' },
    { pantalla: 'sindrome', fila: 'Plantar delgado', sub: 'Posterior: medial y proximal' },
    { pantalla: 'sindrome', fila: 'Nervio sural', sub: 'Posterior: lateral, neuropático' },
    { pantalla: 'sindrome', fila: 'Bursa calcánea superficial', sub: 'Posterior: roce del zapato' },
    { pantalla: 'sindrome', fila: 'Tibial posterior', sub: 'Medial: retromaleolar, sin varo del retropié' },
    { pantalla: 'sindrome', fila: 'FHL', sub: 'Medial: transición de flexión dorsal a plantar' },
    { pantalla: 'sindrome', fila: 'Túnel del tarso', sub: 'Medial: Tinel' },
    { pantalla: 'sindrome', fila: 'Estrés del tobillo (maléolo medial, astrágalo, calcáneo)', sub: 'Medial o lateral: fractura de estrés' },
    { pantalla: 'sindrome', fila: 'Seno del tarso', sub: 'Lateral' },
    { pantalla: 'sindrome', fila: 'Peroneos', sub: 'Lateral' },
    { pantalla: 'sindrome', fila: 'Pinzamiento anterior', sub: 'Anterior: KTW' }
  ] },
  // Dolor en el pie por localización (talón plantar, mediopié, antepié) o, si no
  // encaja, dolor vago del tobillo. La mayoría de destinos son de ORIENTATIVA (segunda
  // tabla), consolidados en un botón por grupo en vez de uno por fila (como en rodilla,
  // nodo 7); los que sí son síndromes propios llevan botón aparte.
  '8': { botones: [
    { pantalla: 'orientativa', sub: 'Talón plantar' },
    { pantalla: 'sindrome', fila: 'Estrés del tobillo (maléolo medial, astrágalo, calcáneo)', sub: 'Talón plantar: estrés del calcáneo' },
    { pantalla: 'orientativa', sub: 'Mediopié' },
    { pantalla: 'sindrome', fila: 'Lisfranc', sub: 'Mediopié: mecanismo de Lisfranc' },
    { pantalla: 'orientativa', sub: 'Antepié' },
    { pantalla: 'sindrome', fila: 'Fracturas del pie (5.º MT, calcáneo)', sub: 'Antepié: base del 5.º MT' },
    { pantalla: 'orientativa', sub: 'Dolor vago del tobillo, si no encaja ninguna localización' },
    { pantalla: 'sindrome', fila: 'Sindesmosis', sub: 'Dolor vago que no se resuelve tras un esguince' }
  ] }
};

// Fila de SINDROMES -> fila de PRONOSTICO: aquí la correspondencia está lejos de ser 1 a
// 1 (17 filas de pronóstico para 21 síndromes), con varias filas combinadas (Aquiles roto
// · Lisfranc · fracturas; Aquiles media/insercional/vaina/plantar; Nervios sural/túnel del
// tarso/talón; Seno del tarso/sinovitis/pinzamiento anterior). Tres síndromes se quedan sin
// fila de pronóstico (null explícito, no un despiste): la tarjeta no se la da.
const PRONOSTICO_DE = {
  'Esguince lateral agudo': 'Esguince lateral',
  'Rotura del Aquiles': 'Aquiles roto · Lisfranc · fracturas',
  'Lisfranc': 'Aquiles roto · Lisfranc · fracturas',
  'Fracturas del pie (5.º MT, calcáneo)': 'Aquiles roto · Lisfranc · fracturas',
  'Luxación del tibial posterior': null,
  'Aquiles porción media': 'Aquiles (media, insercional, vaina, plantar)',
  'Aquiles insercional': 'Aquiles (media, insercional, vaina, plantar)',
  'Vaina del Aquiles': 'Aquiles (media, insercional, vaina, plantar)',
  'Plantar delgado': 'Aquiles (media, insercional, vaina, plantar)',
  'Nervio sural': 'Nervios (sural, túnel del tarso, talón)',
  'Bursa calcánea superficial': null,
  'Túnel del tarso': 'Nervios (sural, túnel del tarso, talón)',
  'Estrés del tobillo (maléolo medial, astrágalo, calcáneo)': 'Fracturas de estrés',
  'Seno del tarso': 'Seno del tarso · sinovitis · pinzamiento anterior',
  'Pinzamiento anterior': 'Seno del tarso · sinovitis · pinzamiento anterior',
  'Referido lumbar': null
};

// Fichas con algo propio. Ninguna llega por `patrones`, así que las 21 llevan pista a
// mano. Esta tarjeta no tiene SINDROMES.nota (a diferencia de las otras cinco regiones):
// solo trae `aviso` general, ya mostrado arriba del árbol — ninguna ficha lleva nota:true.
const FICHAS = {
  'Esguince lateral agudo': { pista: 'Inversión del retropié o flexión plantar con aducción (nodo 4)' },
  'Sindesmosis': { pista: 'Rotación externa del pie con flexión dorsal forzada, contacto (nodo 4)' },
  'Rotura del Aquiles': { pista: 'Thompson positivo (nodo 3)' },
  'Lisfranc': { pista: 'Mecanismo o equimosis plantar de Lisfranc (nodos 3 y 8)' },
  'Fracturas del pie (5.º MT, calcáneo)': { pista: 'Ottawa positivo o caída sobre el talón (nodos 3 y 8)' },
  'Luxación del tibial posterior': { pista: 'Flexión dorsal e inversión con contracción forzada, chasquido medial (nodo 4)' },
  'Pinzamiento posterior': { pista: 'Dolor posterior con la flexión plantar (nodo 7)' },
  'Aquiles porción media': { pista: 'Dolor posterior en la porción media del Aquiles (nodo 7)' },
  'Aquiles insercional': { pista: 'Dolor posterior en la inserción del Aquiles (nodo 7)' },
  'Vaina del Aquiles': { pista: 'Dolor posterior con crepitación en la vaina del Aquiles (nodo 7)' },
  'Plantar delgado': { pista: 'Dolor posterior en el plantar delgado (nodo 7)' },
  'Nervio sural': { pista: 'Dolor posterior de perfil neuropático, lateral (nodo 7)' },
  'Bursa calcánea superficial': { pista: 'Dolor posterior superficial, por roce del zapato (nodo 7)' },
  'Tibial posterior': { pista: 'Dolor medial retromaleolar (nodo 7)' },
  'FHL': { pista: 'Dolor medial con la flexión del primer dedo (nodo 7)' },
  'Túnel del tarso': { pista: 'Dolor medial con Tinel en el túnel del tarso (nodo 7)' },
  'Estrés del tobillo (maléolo medial, astrágalo, calcáneo)': { pista: 'Fractura de estrés medial, del astrágalo o del calcáneo (nodos 7 y 8)' },
  'Seno del tarso': { pista: 'Dolor lateral en el seno del tarso (nodo 7)' },
  'Peroneos': { pista: 'Dolor lateral sobre los peroneos (nodo 7)' },
  'Pinzamiento anterior': { pista: 'Dolor anterior con el KTW (nodo 7)' },
  'Referido lumbar': { pista: 'La exploración local no reproduce el dolor conocido (nodo 6)' }
};

// Agrupación propia de ORIENTATIVA: el propio nodo 8 organiza sus 15 entidades por
// localización (talón plantar, mediopié, antepié) y, aparte, la lista de «dolor vago del
// tobillo» — no es una agrupación inventada, cubre las 15 filas sin resto.
const ORIENTATIVA_GRUPOS = {
  aviso: 'Agrupación propia: la tarjeta reparte las 15 entidades por localización en el nodo 8 (talón plantar, mediopié, antepié, dolor vago), no en una tabla aparte.',
  grupos: [
    { titulo: 'Talón plantar', filas: ['Dolor plantar crónico del talón', 'Almohadilla grasa', 'Atrapamiento nervioso del talón'] },
    { titulo: 'Mediopié', filas: ['Calcaneocuboidea y cubometatarsiana', 'Estrés del mediopié (navicular, cuboides, cuñas)'] },
    { titulo: 'Antepié', filas: ['1.ª MTF', 'Base del 2.º MT', 'Cuello de MT (fractura de marcha)', 'Morton o bursitis intermetatarsiana', 'Gota'] },
    { titulo: 'Dolor vago del tobillo', filas: ['Inestabilidad crónica', 'Sinovitis postraumática', 'Coalición tarsiana', 'Artrosis', 'Osteocondritis disecante del astrágalo'] }
  ]
};

// La nota de PRONOSTICO se parte en dos párrafos por esta frase, como en las demás.
const CORTE_NOTA = 'Dosis y progresión';

module.exports = { ENLACES, PRONOSTICO_DE, FICHAS, ORIENTATIVA_GRUPOS, CORTE_NOTA };
