// Tarjeta de región · hombro
// Solo config y contenido. Helpers y montaje: plantilla_tarjetas.js
const generarTarjeta = require('./plantilla_tarjetas');

const REGION = 'hombro';

const CONFIG = {
  DARK: '1F5F4E',      // cabeceras de tabla (color propio de la región)
  SZ_A: 18,          // cuerpo de tabla, cara A
  SZ_B: 17,          // cuerpo de tabla, cara B
  SPLIT_A: false,    // A y A2 en dos caras
  SPLIT_B: false     // B y C en dos caras
};

// ═══════════════════════════════════════════════════════════════════
//  CONTENIDO — REGION HOMBRO
//  Todo lo de aqui sale de la guia clinica de la region. No inventar
//  cifras de S, E ni LR: si no estan en la guia, se omiten.
// ═══════════════════════════════════════════════════════════════════

// --- OPCIONAL: recuadro de urgencia. En hombro no hay una urgencia
//     quirurgica tajante equivalente a la cauda equina: las banderas
//     rojas van todas a derivacion medica, no a urgencias hoy.
const URGENCIA = null;

const BANDERAS = {
  titulo: 'Banderas rojas — derivación médica inmediata, sobre el cribado general de la ficha',
  widths: [1700, 5500, 3386],
  cabecera: ['Sospecha', 'Pistas en entrevista y exploración', 'Ayuda en consulta'],
  filas: [
    ['Tumor', 'Antecedente de cáncer, pérdida de peso inexplicada, dolor sin relación con el movimiento o implacable, dolor nocturno o en reposo con síntomas sistémicos, masa o deformidad inexplicada.', 'Raros en clavícula distal y acromion; pensar en ellos si hay dolor nocturno + síntomas sistémicos.'],
    ['Infección o sistémico', 'Fiebre, sensación de estar enfermo, cambios en la piel (aspecto, erupciones, sudoración), hematomas inexplicados, dolor en otras partes del cuerpo.', 'Preguntar siempre por el estado general reciente.'],
    ['Fractura o luxación no reducida', 'Traumatismo previo (caída sobre el hombro o el codo), pérdida aguda de movilidad, deformidad, osteoporosis.', 'Test de aprensión ósea; signo de percusión olécranon-manubrio (buen valor para luxación anterior y fracturas de clavícula y húmero).'],
    ['Lesión neurológica', 'Déficit motor o sensitivo significativo, atrofia.', 'Exploración neurológica breve: sensibilidad, fuerza y reflejos.'],
    ['Origen visceral', 'Dolor con esfuerzo cardiorrespiratorio o con síntomas digestivos; referido cardiaco, pulmonar o gastrointestinal a la zona AC.', 'Preguntar si el dolor aparece al caminar rápido, al subir escaleras o tras comer.']
  ],
  nota: 'Descartar antes de clasificar (no son banderas rojas, pero cambian la hipótesis): capsulitis, dolor de origen cervical y dolor secundario a traumatismo. Las banderas rojas se revisan en todas las visitas, no solo en la primera.'
};

const BISAGRA = {
  pregunta: '¿La movilidad pasiva GH, sobre todo la RE, está limitada igual que la activa?',
  ramas: 'SÍ → capsulitis · artrosis GH · luxación bloqueada      |      NO → el resto de síndromes',
  apoyo: 'Clasifica síndromes, no estructuras: los test de hombro tienen poca precisión, combinarlos apenas la mejora y un hombro irritable da test positivos por casi cualquier causa.',
  nota: null   // la guia de hombro nombra la bisagra explicitamente
};

const ARBOL = {
  widths: [620, 9966],
  filas: [
    ['1', ['¿Hay banderas rojas? → derivación médica.   ·   No → 2']],
    ['2', ['¿La movilidad pasiva GH (sobre todo la RE) está limitada igual que la activa?   Sí → 2b   ·   No → 3']],
    ['2b', [
      '¿Traumatismo previo?   Sí → LUXACIÓN BLOQUEADA o FRACTURA → Rx.',
      'No: mayor edad + crepitación → ARTROSIS GH (Rx) · resto → HOMBRO CONGELADO.'
    ]],
    ['3', ['¿Los test cervicales reproducen el dolor de hombro?   Sí → CERVICOGÉNICO → explorar columna (pueden coexistir)   ·   No → 4']],
    ['4', [
      'Movilidad pasiva conservada, ¿qué patrón encaja mejor? Dolor focal AC + palpación + aducción horizontal → ACROMIOCLAVICULAR · episodio concreto o aprensión → INESTABILIDAD · debilidad en RE + cluster positivo → ROTURA DEL MANGUITO · síntomas mecánicos (enganche, bloqueo, chasquido) → SLAP · dolor o debilidad al elevar, reproducido de forma consistente con resistidos → SAPS.',
      'Los cuadros se solapan: busca la hipótesis que explica los síntomas, no un hallazgo.'
    ]]
  ]
};

const SINDROMES = {
  widths: [1500, 4286, 2400, 2400],
  aviso: 'Antes de explorar: severidad e irritabilidad. Alta → solo bisagra y 1–2 tests, sin final de rango ni repeticiones provocadoras; el resto, en la próxima visita. Máximo 2–3 tests; la palpación va la última.',
  filas: [
    ['Dolor subacromial (SAPS)',
      'Descartar primero capsulitis (RE pasiva), origen cervical y dolor postraumático. Dolor o debilidad al elevar el brazo; el dolor debe reproducirse de forma consistente con los test resistidos. Regla clínica: SAPS probable si no hay pérdida de RE pasiva y hay dolor anterior, lesión por sobreesfuerzo y ausencia de síntomas en RE final en abducción.',
      'Elevación en el plano de la escápula o RE resistida que reproduce el dolor → EVA',
      'Fuerza isométrica en RE con dinamómetro (brazo junto al cuerpo, codo a 90°) o grados de elevación activa hasta el dolor'],
    ['Inestabilidad GH',
      'Anterior: aprensión, recolocación y sorpresa (S y E >72 %). Interpretar la aprensión, no el dolor. Posterior: no usar un test aislado; agrupar Jerk, Kim y signo de pinzamiento posterior junto con la historia.',
      'Aprensión de 0 a 10 en abducción + RE; en posterior, la posición provocadora',
      'Fuerza isométrica de RE y RI con dinamómetro, siempre en la misma posición'],
    ['Acromioclavicular',
      'Palpación AC (S 96 %, E 10 %): si no duele, hace poco probable el cuadro; si duele, no lo confirma. Aducción horizontal con el brazo a 90° de flexión (S >67 %, E 79 %). Movilidad pasiva sin restricción; posible escalón.',
      'Aducción horizontal → EVA',
      'Grados de aducción horizontal hasta la aparición del dolor, en la misma posición'],
    ['Lesión SLAP',
      'Ningún hallazgo físico es específico. Compresión-rotación activa (S 72 %, E 52 %): sirve para sostener la hipótesis, no para confirmarla.',
      'Gesto por encima de la cabeza que reproduce el síntoma mecánico → EVA',
      'Fuerza isométrica de RE y RI con dinamómetro, siempre en la misma posición'],
    ['Rotura del manguito',
      'Inspección: brazo en cabestrillo, escápula en rotación inferior o inclinación anterior, cabeza humeral anteriorizada. Cluster A: arco doloroso + drop arm + debilidad en RE → LR+ 15,6 con los tres positivos. Cluster B: edad >65 + debilidad en RE + dolor nocturno → LR+ 9,8 con los tres positivos.',
      'Elevación activa o arco doloroso → EVA',
      'Fuerza isométrica en RE con dinamómetro (brazo junto al cuerpo, codo a 90°) o grados de elevación activa'],
    ['Hombro congelado',
      'Restricción equivalente de movilidad activa y pasiva: es el dato que más discrimina. La RE se considera la más afectada, pero la RI suele estar muy limitada con el brazo cerca de 90° de abducción. Criterio de Bunker: restricción igual de RE activa y pasiva + Rx esencialmente normal.',
      'Final del rango de RE pasiva → EVA (más útil cuando dolor > rigidez)',
      'RE pasiva en grados a 0° de abducción y RI a 90° de abducción (más útil cuando rigidez > dolor)']
  ],
  nota: 'No usar en hombro congelado: test específicos de MR, labrum o AC — casi siempre salen positivos al tensar una cápsula sensibilizada. Los test AC por separado son débiles: Paxinos + O’Brien combinados dan S y E >90 % (Ampliar).'
};

// --- OPCIONAL: tabla orientativa. En hombro no reparte un bloque
//     inespecifico: discrimina la rama de rigidez activa = pasiva.
const ORIENTATIVA = {
  bloque: '4',   // la plantilla antepone "Bloque 4 · "
  titulo: 'Rigidez activa = pasiva · qué lo distingue del hombro congelado',
  widths: [2000, 5400, 3186],
  cabecera: ['Condición', 'Qué la distingue del hombro congelado', 'Imagen'],
  filas: [
    ['Dolor del manguito', 'Dolor mecánico provocado por los test de carga del MR; RE y abducción más afectadas; movilidad pasiva no muy limitada.', 'Eco y RM (cambios también en asintomáticos)'],
    ['Acromioclavicular', 'Dolor localizado y a la palpación sobre la AC, posible escalón, provocación con O’Brien o aducción horizontal; sin restricción pasiva.', 'Rx y RM (cambios también en asintomáticos)'],
    ['Artrosis GH', 'Mayor edad, dolor progresivo más largo y a menudo menos intenso, crepitación, posible atrofia.', 'Rx simple la muestra'],
    ['Cervicogénico', 'Dolor reproducible con los test cervicales; sin restricción pasiva GH.', 'Rx y RM cervical (cambios también en asintomáticos)'],
    ['Neoplasia', 'Se presenta parecido; antecedente de cáncer, pérdida de peso, fiebre, dolor implacable.', 'Rx, gammagrafía, RM'],
    ['Luxación bloqueada', 'Traumatismo previo, cualquier edad, rigidez activa y pasiva similar al congelado.', 'Rx simple'],
    ['Fractura', 'Traumatismo previo, osteoporosis.', 'Rx; RM si fractura no desplazada del troquíter']
  ],
  nota: 'Los estadios del congelado se solapan: en la práctica es más útil clasificar como dolor > rigidez o rigidez > dolor y ajustar el tratamiento a eso.'
};

const PRONOSTICO = {
  titulo: 'para «a las X sesiones espero Y; si no lo veo → Z»',
  widths: [1600, 4746, 4240],
  cabecera: ['Síndrome', 'Horizonte e imagen', 'Criterio de derivación o cuidado'],
  filas: [
    ['SAPS', 'Una rotura completa del supraespinoso en ecografía aumenta la probabilidad, pero la imagen no mejora la capacidad de descartarlo.', 'Dolor en reposo: puede indicar bursitis o proceso inflamatorio que tolere mal el movimiento vigoroso → dosificar. La idea de «espacio subacromial estrecho» es controvertida.'],
    ['Inestabilidad', 'Diagnóstico sobre todo clínico; la Rx simple puede identificar Bankart y Hill-Sachs. A las 3–4 semanas del episodio agudo hay poco dolor y recuperan movilidad y fuerza.', 'La MDI se confunde con inestabilidad unidireccional, SAPS, patología discal cervical, plexitis braquial y desfiladero torácico. Tener presente Ehlers-Danlos o Marfan.'],
    ['Acromioclavicular', 'Rx y RM muestran patología AC, pero muchos cambios aparecen en personas sin síntomas.', 'La infiltración ecoguiada tiene efecto diagnóstico y terapéutico: decisión médica.'],
    ['SLAP', 'La artro-RM es más precisa que la RM sin contraste.', 'El SLAP aislado es raro y es frecuente en asintomáticos: tratarlo solo tiene sentido si explica los síntomas. Suele acompañar a rotura del MR, inestabilidad, rotura del bíceps o bursitis.'],
    ['Rotura del manguito', 'RM como referencia: rotura completa S 90 %, E 100 %; parcial S 100 %, E 87 %. No se observa curación espontánea y el tamaño puede aumentar en unos 2 años, también en asintomáticas.', 'Alrededor del 40 % de la población tiene roturas asintomáticas: la rotura no explica por sí sola el dolor. La degeneración crece desde los 50–55 años mientras el dolor no traumático baja a partir de los 60–65.'],
    ['Hombro congelado', 'Se suele decir que se resuelve en 2–3 años, pero un 41 % sigue con síntomas a los 4 años y la mitad a los 7. No hay evidencia de que avance por estadios hasta curarse sin tratamiento. Rx normal salvo osteopenia o calcificación; RM no necesaria.', 'Ejercicio en grupo supervisado: mejores resultados que el individual y que el ejercicio en casa. Derivar a psicología si los factores psicosociales superan tu competencia. Baja autoeficacia predice peor evolución. Contralateral en el 6–34 %.']
  ],
  nota: '③ lo elige el paciente; si no sabe: cartera del bolsillo trasero, sujetador o axila contraria (AC); peinarse, vestirse, alcanzar detrás de la espalda (congelado); lanzar (SLAP). Dosis y progresión no están en la guía: son tuyas.'
};

const TITULOS = {
  caraA: ['HOMBRO · cara A', 'bloque 0 (con el paciente fuera) y bloques 3–4'],
  caraB: ['HOMBRO · cara B', 'bloques 4, 5 y 6, ya dentro de una rama del árbol'],
  pieA: 'Guía clínica de hombro, ap. 1 y 4 · Struyf · Powell y Lewis, cap. 3 — Ficha de primera visita, bloques 0, 3 y 4',
  pieB: 'Guía clínica de hombro, ap. 5 y 6 · las filas ① y ② son propuestas de la guía, no proceden del capítulo'
};

generarTarjeta(REGION, CONFIG, {
  URGENCIA, BANDERAS, BISAGRA, ARBOL, SINDROMES, ORIENTATIVA, PRONOSTICO, TITULOS
});
