// Tarjeta de región · cervical
// Solo config y contenido. Helpers y montaje: plantilla_tarjetas.js
const generarTarjeta = require('../tools/plantilla_tarjetas');

const REGION = 'cervical';

const CONFIG = {
  DARK: '4A5A7A',      // cabeceras de tabla (color propio de la región)
  SZ_A: 16,          // cuerpo de tabla, cara A
  SZ_B: 16,          // cuerpo de tabla, cara B
  SPLIT_A: false,    // A y A2 en dos caras
  SPLIT_B: false     // B y C en dos caras
};

// ═══════════════════════════════════════════════════════════════════
//  CONTENIDO — REGION CERVICAL
//  Todo lo de aqui sale de la guia clinica de la region. No inventar
//  cifras de S, E ni LR: si no estan en la guia, se omiten.
// ═══════════════════════════════════════════════════════════════════

// --- OPCIONAL: recuadro de urgencia.
const URGENCIA = {
  titulo: 'URGENCIAS HOY · disfunción arterial · lesión tras traumatismo · cefalea con signos de alarma',
  lineas: [
    'Disección arterial (<55 a): cefalea o dolor cervical súbito, DESCONOCIDO PARA EL PACIENTE, moderado o grave y a menudo progresivo. Alteración del equilibrio o la marcha, Horner, déficit de pares craneales. Puede imitar una cefalea cervicogénica.',
    'Insuficiencia vertebrobasilar (suele ser >65 a, posible en jóvenes) · 5 D y 3 N: mareo o inestabilidad, diplopía o pérdida de campo visual, disartria o disfasia, disfagia o ronquera, caídas súbitas sin pérdida de conciencia; nistagmo espontáneo, náuseas o vómitos, entumecimiento peribucal.',
    'Fractura, subluxación o luxación: traumatismo importante en persona mayor o mecanismo peligroso (flexión con compresión en deporte de colisión). Se sujeta la cabeza, espasmo defensivo, movilidad muy limitada, posibles signos neurológicos. Incluye la inestabilidad cervical alta traumática.',
    'Cefalea con signos de alarma: cambio súbito de calidad, intensidad o frecuencia; síntomas neurológicos nuevos; inicio súbito y grave; fiebre u otros síntomas sistémicos.'
  ]
};

const BANDERAS = {
  titulo: 'Banderas rojas de la región — sobre el cribado general de la ficha',
  widths: [1700, 5500, 3386],
  cabecera: ['Sospecha → derivación médica', 'Pistas en entrevista y exploración', 'Ayuda en consulta'],
  filas: [
    ['Mielopatía cervical', 'Espondilosis avanzada que estrecha el canal y comprime la médula; más probable de mediana edad en adelante. También con tumores avanzados o malformación congénita (Klippel-Feil).', 'Falla la conducción de la médula, no la de la raíz: exploración neurológica que incluya pruebas centrales (Babinski, dedo-nariz). La RM muestra la compresión. El capítulo no detalla signos específicos.'],
    ['Inestabilidad cervical alta no traumática', 'Erosión del ligamento transverso en AR; ausencia congénita de ligamentos; síndrome de Down; Klippel-Feil (cuello corto, asimetría facial, cefalea crónica).', 'La queja principal puede ser una cefalea con rasgos de cervicogénica. El capítulo no describe los test de estabilidad.'],
    ['Tumor vertebral (benigno, maligno o metástasis)', 'Dolor cervical incesante que no cambia con postura, movimiento ni reposo; dolor nocturno frecuente; rigidez y pérdida de movilidad posibles; debilidad o entumecimiento si comprime médula o raíces.', 'Malestar general: febrícula, sudor nocturno, cansancio, inapetencia.'],
    ['Infección (discitis, osteomielitis, absceso epidural)', 'Dolor incesante y nocturno que no alivia con reposo, postura ni movimiento; cuello rígido con pérdida de movilidad; signos neurológicos si está avanzada.', 'Mismo malestar general. Analítica si se sospecha (decisión médica).'],
    ['Artritis inflamatoria (AR, EA)', 'Dolor y rigidez prolongada, sobre todo por la mañana.', 'AR: visible en articulaciones periféricas. EA: empieza en lo lumbopélvico.'],
    ['Cardiaco', 'Dolor cervical, habitualmente anterior.', 'No se relaciona con movimientos ni posturas del cuello.'],
    ['Distonía cervical', 'Contracciones involuntarias con postura y movimientos anómalos de la cabeza; puede doler.', 'Observación de la postura y del movimiento.'],
    ['Fijación rotatoria atloaxoidea', 'Más frecuente en niños. Tortícolis con rotación muy limitada. Puede aparecer tras amigdalitis o adenoamigdalectomía (síndrome de Grisel).', 'Requiere derivación médica.'],
    ['Otras cefaleas secundarias', 'Pseudotumor cerebri; arteritis temporal; sospecha de tumor, aneurisma, hemorragia, ictus o meningitis.', 'Pseudotumor: examen ocular, TC o RM, punción lumbar. Arteria temporal: palpación, analítica, biopsia. Resto: RM y analítica.']
  ],
  nota: 'El patrón mecánico es el primer filtro: el dolor cambia con posturas, movimientos y cargas, alivia al cambiarlos y el paciente está bien en lo demás. Si no sigue ese patrón, sospecha y deriva. Se revisan en todas las visitas.'
};

const BISAGRA = {
  pregunta: '¿Cómo empezó, y hay síntomas en el brazo, cefalea o mareo?',
  ramas: 'Traumático → LATIGAZO   ·   brazo con rasgos neuropáticos o déficit → RADICULAR o RADICULOPATÍA   ·   cefalea o mareo → su ficha   ·   nada de lo anterior → IDIOPÁTICO',
  apoyo: 'Los test valen en grupo, no solos: un hallazgo aislado engaña (FRT positivo en el 100 % de una muestra con migraña crónica; desviaciones posturales en asintomáticos). Cuenta si al cambiar postura o carga cambian los síntomas.',
  nota: 'La guía cervical no nombra una bisagra como la RE pasiva del hombro, y aquí el reparto no es binario: son las tres categorías del capítulo (idiopático, latigazo, radicular) más el eje cefalea-mareo. Pueden coexistir.'
};

const ARBOL = {
  widths: [620, 9966],
  filas: [
    ['1', ['¿Signos de disfunción arterial, traumatismo con sospecha de fractura o inestabilidad, o cefalea con signos de alarma? → URGENCIAS HOY.   ·   No → 2']],
    ['2', ['¿Otras banderas rojas, o un relato que no sigue el patrón mecánico (no cambia con postura, movimiento ni reposo; malestar general)? → derivación médica.   ·   No → 3']],
    ['3', ['¿Síntomas en el brazo con rasgos neuropáticos, o pérdida de sensibilidad o fuerza?   Sí → 3b   ·   No → 4']],
    ['3b', [
      'Quemazón o descargas + ULNT1 positivo con diferenciación estructural → DOLOR RADICULAR · déficit de sensibilidad, fuerza o reflejos → RADICULOPATÍA (pueden coexistir; si falla la médula → derivar).',
      'Síntomas que preceden a la cefalea y duran hasta 60 min → AURA MIGRAÑOSA, no radicular. Si el inicio fue traumático, añadir la ficha de latigazo.'
    ]],
    ['4', ['¿Inicio con traumatismo (tráfico, deporte, ocio)? → LATIGAZO CERVICAL, con la fractura ya descartada en el paso 1.   ·   No → 5']],
    ['5', ['¿Cefalea o mareo como queja principal o acompañante?   Sí → 5b   ·   No → 6']],
    ['5b', [
      'Cefalea unilateral sin cambio de lado que empieza en el cuello + FRT ≤30° + cluster cervical → CEFALEA CERVICOGÉNICA · criterios de migraña o tensional → CEFALEA PRIMARIA (el cuello puede contribuir).',
      'Aturdimiento o inestabilidad ligados al cuello + error de reposición >4–5° → MAREO CERVICOGÉNICO · vértigo rotatorio → VESTIBULAR; tras golpe en cabeza o cuello, pensar también en conmoción.'
    ]],
    ['6', [
      'IDIOPÁTICO, ¿dónde está la disfunción? Dolor en los primeros grados de rotación, restricción precoz, FRT <30° o 10° de asimetría → CRANEOCERVICAL (C1–2) · extensión-rotación positiva + disfunción segmentaria palpable y dolorosa → FACETA CERVICAL · giro libre al inicio pero excursión final limitada → CERVICAL BAJA Y CERVICOTORÁCICA.',
      'En todos: tarea provocadora, postura, control motor y región torácica.'
    ]]
  ]
};

const SINDROMES = {
  widths: [1500, 4286, 2400, 2400],
  aviso: 'Antes de explorar: severidad e irritabilidad. Alta → solo bisagra y 1–2 tests, sin final de rango ni repeticiones provocadoras; el resto, en la próxima visita. Máximo 2 tests; la palpación va la última.',
  filas: [
    ['Idiopático',
      'Tarea provocadora: que muestre la actividad que le duele; modificar la postura y ver el efecto inmediato. Movilidad activa en los tres planos y las tres regiones. Extensión: la cabeza debe pasar por detrás del plano de los hombros. Rotación: giro libre en los primeros 30° = craneocervical sin gran alteración; restricción precoz → problema craneocervical. Examen manual segmentario.',
      'Tarea o postura provocadora que el paciente demuestra (rotación al lado del dolor, mirar al techo, postura de ordenador un tiempo fijo) → EVA',
      'Rotación cervical activa hacia el lado limitado, sentado con la espalda apoyada (inclinómetro). Si es craneocervical: grados del FRT en supino'],
    ['Latigazo (WAD)',
      'Fractura e inestabilidad ya descartadas. Son frecuentes el dolor intenso y la poca tolerancia al movimiento: dosificar. Movilidad activa en los tres planos respetando la irritabilidad. Hielo sobre la nuca: dolor >5/10 → hiperalgesia al frío (LR+ 8,44). Mareo o inestabilidad → reposición articular. Síntomas en brazo → ULNT1 y neurológico.',
      'Movimiento activo más doloroso o limitado (p. ej. rotación hacia el peor lado) → EVA',
      'Rotación cervical activa sentado, misma silla y apoyo (grados). Si hay mareo: error medio de reposición con láser'],
    ['Dolor radicular',
      'ULNT1 (sesgo mediano): positivo si reproduce los síntomas y estos cambian con la diferenciación estructural. Es el más estudiado (el capítulo no da cifras). Movilidad cervical: qué movimiento dispara el dolor de brazo y cuánto se tolera. Si hay adormecimiento o debilidad, pasar a la ficha de radiculopatía.',
      'Movimiento cervical que dispara el dolor de brazo (p. ej. extensión), o ULNT1 hasta una posición fija → EVA del brazo',
      'Grados de extensión de codo en el ULNT1 en que aparecen los síntomas, con hombro, muñeca y cuello en posición fija'],
    ['Radiculopatía',
      'Exploración neurológica: sensibilidad, fuerza y reflejos del miembro superior, siempre que se sospeche conducción comprometida. Sensibilidad a vibración y temperatura: buscar hipoestesia. Comparar con el lado sano.',
      'Si hay dolor, el gesto testigo del cuadro que lo acompaña (radicular o referido)',
      'Fuerza del grupo muscular débil con dinamómetro de mano, en la misma posición y frente al lado sano'],
    ['Cefalea cervicogénica',
      'FRT: positivo ≤30°; el test con mayor fiabilidad y precisión diagnóstica según revisión sistemática, y su limitación se correlaciona con el índice de cefalea. Examen manual cervical alto: buscar reproducción y resolución de la cefalea.',
      'Postura o movimiento cervical que desencadena la cefalea, o presión manual mantenida en el segmento alto que la reproduce → EVA de la cefalea',
      'Grados del FRT hacia el lado limitado, en supino con flexión cervical completa'],
    ['Mareo cervicogénico',
      'Primero descartar lo vascular (5 D y 3 N, disección). Sentido de posición articular: ojos cerrados, rotación a cada lado y extensión, y volver a la posición natural. Error >4–5° = déficit. Con láser en cinta de cabeza y diana, al menos 3 intentos por movimiento y hacer la media.',
      'Movimiento o postura cervical que desencadena el mareo → EVA del mareo',
      'Error medio de reposición en grados por movimiento (rotación derecha, izquierda, extensión), sentado a la misma distancia de la diana']
  ],
  nota: 'Que el dolor llegue al hombro o al brazo no lo convierte en radicular: C4–5 se refiere a cuello y hombro, y C5–6 a C7–T1 a cuello, hombro y brazo. Separan los rasgos neuropáticos y la diferenciación estructural del ULNT1.'
};

// --- OPCIONAL: en cervical la tabla orientativa decide si la cefalea
//     viene del cuello, que es la pregunta que mas se repite.
const ORIENTATIVA = {
  bloque: '4',   // la plantilla antepone "Bloque 4 · "
  titulo: 'Cefalea · ¿viene del cuello? — tabla orientativa',
  widths: [1800, 2928, 2929, 2929],
  cabecera: ['Rasgo', 'Migraña', 'Tensional', 'Cervicogénica'],
  filas: [
    ['Duración y frecuencia', 'Al menos 5 crisis de 4 a 72 h', '30 min a 7 días', 'Al menos 1 por semana de media; duración variable'],
    ['Rasgos del dolor', '2 de 4: moderada o grave, unilateral, pulsátil, empeora con la actividad habitual', '2 de 4: bilateral, opresiva no pulsátil, leve o moderada, no empeora con la actividad', 'Unilateral sin cambio de lado, no pulsátil, empieza en el cuello, la desencadenan movimientos o posturas cervicales'],
    ['Síntomas asociados', 'Foto y fonofobia, o náuseas o vómitos', 'Como mucho uno entre fotofobia, fonofobia o náusea leve', 'Dolor o rigidez cervical'],
    ['Antes de la cefalea', 'Pródromos: humor, antojos, cansancio, bostezos, dolor de cuello. Aura (subgrupo): 5–60 min, visual en >90 %', '—', '—'],
    ['Cuello en la exploración', '70 % con dolor cervical antes, durante o tras la cefalea; 93 % con ≥3 disfunciones; examen cervical alto positivo en ~2/3 y reproduce la cefalea en ~1/3', 'Cabeza adelantada y menos movilidad (sobre todo crónica) y PGM, de relevancia discutida', 'Cluster con S 100 % y E 94 %; FRT ≤30°'],
    ['A tener en cuenta', 'Descartar abuso de medicación: analgésicos no más de 10–15 días al mes', 'Estrés, ánimo y sueño como factores', 'Si no cambia al tratar el cuello, revisar ATM y otras formas']
  ],
  nota: 'No sobreestimes el cuello: en cefalea cervicogénica persistente, el 44,1 % tenía signos claros de ATM y tras tratamiento manual de la ATM el 85 % redujo signos craneocervicales y cefalea. El dolor de cuello acompañante no confirma nada: lo refiere hasta el 70 % de quienes tienen cefalea frecuente.'
};

const PRONOSTICO = {
  titulo: 'para «a las X sesiones espero Y; si no lo veo → Z»',
  widths: [1600, 4746, 4240],
  cabecera: ['Síndrome', 'Horizonte e imagen', 'Criterio de derivación o cuidado'],
  filas: [
    ['Idiopático', 'Recurrente: tras un episodio, el 50–85 % vuelve a tener dolor en meses o pocos años. Radiografía solo con indicación concreta de la exploración: hay dolor sin cambios y cambios sin dolor.', 'Dolor constante y sordo → componente inflamatorio. Dolor que no cambia con postura, movimiento ni reposo → banderas rojas. Espondilosis avanzada: posible radiculopatía o mielopatía.'],
    ['Latigazo', 'Peor recuperación con síntomas de estrés postraumático, sobre todo de hiperactivación. Baja expectativa de recuperación: factor pronóstico independiente de más discapacidad (OR 4,2). El mecanismo del accidente no predice el daño estructural.', 'No prejuzgar: un factor de riesgo no condena a un paciente concreto; el miedo suele ceder al bajar el dolor. Mareo tras golpe en cabeza o cuello: pensar también en vestibular, conmoción y disección.'],
    ['Dolor radicular', 'RM para compromiso de raíz, solo si la exploración lo indica: los cambios son frecuentes en asintomáticos.', 'Con más dolor y discapacidad aparece sensibilización central: exploración mínima. La espondilosis que avanza puede comprimir la médula.'],
    ['Radiculopatía', 'RM: compresión de raíz o médula. EMG y conducción nerviosa localizan el daño y apoyan el diagnóstico clínico.', 'Ante cualquier duda de afectación medular → derivar. El aura migrañosa puede presentarse como pérdida de fuerza en el brazo antes de la cefalea, hasta 60 min.'],
    ['Cefalea cervicogénica', 'La remisión de la cefalea tras tratar el cuello es un buen apoyo diagnóstico. La imagen no confirma ni descarta: solo sirve para descartar patología grave.', 'Si no cambia al tratar el cuello → revisar ATM y otras formas de cefalea. El 30 % con cervicogénica cumple también criterios de migraña.'],
    ['Mareo cervicogénico', 'Identificar la fuente del mareo es clave para que el manejo funcione.', 'Vértigo rotatorio → vestibular. Golpe en cabeza o cuello → conmoción. Visión doble verdadera en mayores → IVB; súbito en jóvenes → disección. Los dos últimos, urgencias.']
  ],
  nota: '③ en formato PSFS; si no sabe: cuidado personal, levantar peso, leer, conducir, dormir, ordenador o móvil, mirar arriba, llevar el brazo atrás. Dosis y progresión no están en la guía: son tuyas.'
};

const TITULOS = {
  caraA: ['CERVICAL · cara A', 'bloque 0 (con el paciente fuera) y bloques 3–4'],
  caraB: ['CERVICAL · cara B', 'bloques 4, 5 y 6, ya dentro de una rama del árbol'],
  pieA: 'Guía clínica cervical, ap. 1 y 4 — Ficha de primera visita, bloques 0, 3 y 4',
  pieB: 'Guía clínica cervical, ap. 5 y 6 · las filas ① y ② son propuestas de la guía, no proceden del capítulo'
};

generarTarjeta(REGION, CONFIG, {
  URGENCIA, BANDERAS, BISAGRA, ARBOL, SINDROMES, ORIENTATIVA, PRONOSTICO, TITULOS
});
