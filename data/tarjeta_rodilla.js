// Tarjeta de región · rodilla
// Solo config y contenido. Helpers y montaje: plantilla_tarjetas.js
const generarTarjeta = require('../tools/plantilla_tarjetas');

const REGION = 'rodilla';

const CONFIG = {
  DARK: '7A5A2E',      // cabeceras de tabla (color propio de la región)
  SZ_A: 18,          // cuerpo de tabla, cara A
  SZ_B: 16,          // cuerpo de tabla, cara B
  SPLIT_A: true,    // A y A2 en dos caras
  SPLIT_B: true     // B y C en dos caras
};

// ═══════════════════════════════════════════════════════════════════
//  CONTENIDO — REGION RODILLA
//  Todo lo de aqui sale de la guia clinica de la region. No inventar
//  cifras de S, E ni LR: si no estan en la guia, se omiten.
// ═══════════════════════════════════════════════════════════════════

// --- OPCIONAL: recuadro de urgencia. Rodilla tiene tres, mas la regla
//     de Ottawa, que se aplica ANTES de explorar cualquier rodilla aguda.
const URGENCIA = {
  titulo: 'URGENCIAS · TVP · ARTRITIS SÉPTICA · APARATO EXTENSOR · BURSA CON FIEBRE · NEUROVASCULAR',
  lineas: [
    'TVP: no identificarla puede llevar a embolia pulmonar, que ocurre en más de un tercio de los casos. Dolor intenso e inexplicado, calambre en el hueco poplíteo, calor o hinchazón. Wells está en la tabla de abajo. Derivar a quien pueda excluirla.',
    'ARTRITIS SÉPTICA (anexo): rodilla caliente, roja y con derrame a tensión. Dolor intenso en todo el arco, incluso en recorridos mínimos. Fiebre, malestar general, incapacidad para cargar. Factores: infiltración o cirugía articular reciente, prótesis, inmunodepresión, diabetes, AR, infección cutánea, drogas parenterales. Puede coexistir con artrosis o gota y despistar. Ningún signo aislado es bastante sensible para descartarla → URGENCIA HOSPITALARIA HOY.',
    'ROTURA DEL APARATO EXTENSOR (anexo): la regla de Ottawa NO lo detecta. Carga excéntrica brusca sobre la rodilla flexionada o caída, con chasquido y caída inmediata. NO puede elevar la pierna extendida ni mantener la rodilla extendida contra gravedad. Escalón palpable por encima de la rótula (cuádriceps) o por debajo (rotuliano); hemartrosis; rótula alta o baja. La elevación de la pierna extendida es prueba aparte y obligatoria en toda rodilla traumática con dolor anterior. Reparación precoz (2 primeras semanas) → mejores resultados.',
    'Bursitis prerrotuliana séptica: la FIEBRE >37,7 °C solo se ha descrito en la séptica. Derivación el mismo día. · Compromiso neurovascular tras traumatismo: cambios de temperatura, adormecimiento, parestesias o debilidad tras fractura de meseta o luxación → pulsos distales, cribado neurológico e índice tobillo-brazo.',
    'REGLA DE OTTAWA, antes de explorar cualquier rodilla con traumatismo agudo → radiografía si hay ALGUNO de los cinco, por separado: ≥55 años · dolor a la palpación de la cabeza del peroné · dolor aislado a la palpación de la rótula · no flexiona hasta 90° · no carga cuatro pasos, ni justo tras la lesión ni ahora, aunque sea cojeando. S 98–100 %, E ≈50 %: sirve para descartar, no para confirmar. Excluida si la lesión tiene más de 7 días.'
  ]
};

const BANDERAS = {
  titulo: 'Banderas rojas de la región — sobre el cribado general de la ficha',
  widths: [1700, 5500, 3386],
  cabecera: ['Sospecha → derivación médica', 'Pistas en entrevista y exploración', 'Ayuda en consulta'],
  filas: [
    ['Fractura de rótula o de meseta tibial', 'Mecanismo conocido: golpe directo, rótula contra el salpicadero, caída sobre la rodilla, o indirecto (saltar y caer mal). Meseta: alta energía en varones jóvenes, baja energía en mujeres mayores u osteoporóticas. Hinchazón inmediata, incapacidad para cargar, movilidad limitada, chasquido en el momento.', 'Regla de Ottawa. Palpación de rótula, cabeza del peroné y meseta; posible escalón palpable; dolor con extensión resistida; marcha antiálgica con rodilla rígida.'],
    ['Epifisiólisis femoral proximal o Perthes', 'Niño o adolescente con dolor de rodilla SIN mecanismo conocido. El patrón de dolor es constante y obliga a derivar.', 'Cribado de cadera PRIMERO: rango activo y pasivo de la cadera ipsilateral. Solo si es normal, la rodilla es la localización primaria.'],
    ['Luxación de rodilla y traumatismo multiligamentoso', 'Alta energía, golpe en la cara anteromedial, lesión de salpicadero o hiperextensión. Hasta el 95 % de las lesiones del LCP vistas en urgencias son combinadas; en hemartrosis agudas por lesión ligamentosa, un 9 % tiene lesión de la EPL.', 'Hemartrosis aguda tras alta energía: valorar función neurovascular y derivar antes de forzar la exploración.'],
    ['Lesión del nervio peroneo común', 'Pie caído, tropezar con el pie, parestesias y debilidad en la cara lateral de la pierna y el dorso del pie, tras esguince o luxación de la tibioperonea proximal, fractura de tibia o peroné, lesión ligamentosa o cirugía de rodilla.', 'Marcha en steppage; fuerza de eversión y de flexión dorsal de tobillo y dedos; sensibilidad; Tinel sobre la cabeza del peroné.'],
    ['Pseudotromboflebitis por quiste poplíteo', 'Dolor o hinchazón en la pantorrilla y signo de Homans positivo en un quiste grande, disecado o roto. El quiste también puede causar síndrome compartimental y neuropatías por compresión.', 'Clínicamente no se puede separar de una tromboflebitis real: derivar. La ecografía es la primera opción para diferenciar quiste de TVP.'],
    ['Lesión osteocondral inestable', 'Chasquidos, enganches o bloqueos muy dolorosos: el fragmento bloquea físicamente el movimiento. Derrame y pérdida de rango.', 'Derrame + tope mecánico + rango limitado → imagen (radiografía de elección) y derivación.'],
    ['TVP · Wells con puntuación (anexo)', '+1 cada uno: cáncer activo (tratamiento en 6 meses o paliativo) · parálisis, paresia o inmovilización con férula · encamamiento ≥3 días o cirugía mayor en 12 SEMANAS · dolor en el trayecto venoso profundo · hinchazón de toda la pierna · pantorrilla >3 cm más gruesa, medida 10 cm bajo la tuberosidad tibial · edema con fóvea solo en la pierna sintomática · venas colaterales no varicosas · TVP previa documentada. −2: hay un diagnóstico alternativo al menos tan probable como la TVP.', '2 o más → TVP probable; 1 o menos → improbable. El capítulo lista el ítem que resta junto a los demás y sobreestima. Orienta la derivación, no la sustituye.'],
    ['Tumor', 'El capítulo no da criterios clínicos propios: solo lo menciona como bandera roja que la radiografía ayuda a descartar al valorar una apofisitis tibial en el adolescente.', 'Si se pide imagen en un adolescente con dolor en la tuberosidad tibial, la radiografía simple ayuda a descartar fractura aguda y tumor.']
  ],
  nota: 'Las banderas rojas se revisan en todas las visitas, no solo en la primera.'
};

const BISAGRA = {
  pregunta: '¿Hubo traumatismo agudo, y dónde se localiza el dolor?',
  ramas: 'TRAUMÁTICO → Ottawa primero, después por mecanismo: pivote · valgo · giro · salpicadero · varo · rótula      |      NO TRAUMÁTICO → por localización: anterior · medial · lateral · posterior',
  apoyo: 'La localización orienta, pero mira arriba y abajo: el dolor puede venir de la cadera o de la columna lumbar, y la función de la rodilla depende del rendimiento de cadera y tobillo. En menores sin mecanismo, cadera antes que rodilla.',
  nota: 'La guía de rodilla no nombra una bisagra como la RE pasiva del hombro: son los pasos 2 y 7 de su árbol — mecanismo primero, localización después — usados como tal.'
};

const ARBOL = {
  widths: [620, 9966],
  filas: [
    ['1', ['¿Sospecha de TVP, bursa caliente y roja con fiebre, o alteración neurovascular distal? → URGENCIA: derivación médica hoy.   ·   No → 2']],
    ['2', ['¿Traumatismo agudo?   Sí → 3   ·   No → 5']],
    ['3', [
      '¿Algún criterio de Ottawa (≥55 años · cabeza del peroné · rótula aislada · no flexiona 90° · no carga cuatro pasos)? → DERIVAR PARA RADIOGRAFÍA antes de seguir explorando.   ·   No → 4',
      'Y en toda rodilla traumática con dolor anterior, elevación de la pierna extendida: si no puede → aparato extensor, que Ottawa no detecta. Alternativa a Ottawa (anexo): Pittsburgh — contusión o caída MÁS (<12 o >50 años, o no da cuatro pasos ahora); S ≈99 % con E ≈60 %, pide menos radiografías.'
    ]],
    ['4', [
      'Rodilla aguda traumática, ¿qué mecanismo cuenta? Pivote o caída de un salto + chasquido + derrame inmediato → LCA · valgo con el pie fijo → LCM (mirar LCA y menisco medial) · giro con el pie apoyado + bloqueo o enganche + derrame en 6–24 h → MENISCO.',
      'Golpe en tibia anterior con rodilla flexionada (salpicadero) → LCP y EPL · golpe anteromedial o varo cerca de la extensión → LLE y EPL · la rótula «se salió», aprensión al trasladarla lateralmente → INESTABILIDAD ROTULIANA · golpe directo anterior, dolor con extensión resistida, escalón palpable → FRACTURA.'
    ]],
    ['5', ['¿Niño o adolescente con dolor de rodilla sin mecanismo conocido? → EXPLORAR PRIMERO LA CADERA (epifisiólisis, Perthes). Solo si el cribado es normal, seguir en la rodilla.   ·   No → 6']],
    ['6', ['¿Reproduce el dolor de rodilla la exploración de la cadera o de la columna lumbar? → CADERA (artrosis) o COLUMNA LUMBAR (radiculopatía o pseudorradiculopatía): tratar el origen.   ·   No → 7']],
    ['7', [
      'Dolor persistente o sin traumatismo, ¿dónde se localiza? ANTERIOR → tendinopatía rotuliana (polo inferior, sentadilla monopodal) · dolor FR (difuso, sentadilla) · Hoffa (recurvatum, test de Hoffa) · bursitis prerrotuliana (superficial, arrodillarse) · inestabilidad rotuliana (fallo, aprensión) · lesión osteocondral (bloqueo) · en menores, apofisitis por tracción.',
      'MEDIAL → menisco medial · artrosis (criterios ACR) · bursitis anserina · plica medial. LATERAL → cintilla iliotibial (2–3 cm sobre la interlínea) · tibioperonea proximal · menisco lateral · nervio peroneo común. POSTERIOR → quiste poplíteo (signo de Foucher) · LCP crónico · columna lumbar. Descartada siempre la TVP.'
    ]]
  ]
};

const SINDROMES = {
  widths: [1500, 4286, 2400, 2400],
  aviso: 'Antes de explorar: severidad e irritabilidad. Alta → solo bisagra y 1–2 tests; nada de sentadilla monopodal, step-down repetido, saltos ni flexión con sobrepresión. DERRAME (anexo): stroke test, barriendo la cara medial hacia el fondo de saco — 0 sin onda · traza · 1+ abombamiento · 2+ el líquido vuelve solo · 3+ no se desplaza. 2+ o 3+ → trátalo como irritabilidad alta. El peloteo solo detecta derrames grandes: negativo NO descarta. En fase aguda el grado del stroke test vale como ②: cambia rápido y no obliga a provocar dolor. Cronología: <2 h → hemartrosis (LCA, fractura osteocondral, luxación de rótula) · 6–24 h → menisco o reacción sinovial.',
  filas: [
    ['LCA',
      'Confirmar: mecanismo de pivote + derrame inmediato + Lachman positivo → S 0,58 · E 0,95 · LR+ 17,5. Descartar: sin mecanismo de pivote ni chasquido + Lachman o pivot shift negativos → S 0,93 · E 0,87 · LR− 0,08.',
      'Apoyo monopodal o bajada de un escalón → EVA. Si predomina la inestabilidad, anotar episodios de fallo por semana',
      'Déficit de extensión activa frente al lado sano, en supino con el talón sobre una toalla (grados)'],
    ['LCM',
      'Valgo forzado a 30° de flexión. Combinar el mecanismo de la entrevista con dolor y laxitud en el test → S 0,56 · E 0,91 · LR+ 6,4 · LR− 0,5.',
      'Valgo forzado a 30°, o el gesto de apoyo o giro que reproduce el dolor → EVA',
      'Arco de flexión activa indoloro, con goniómetro en supino con la cadera a 0°'],
    ['Menisco',
      'Traumática: traumatismo (caída o pivote) + dolor medial o difuso + dolor a la palpación de la interlínea medial → S 0,91 · E 0,90 · LR+ 8,9 · LR− 0,10. Degenerativa: inicio progresivo + dolor medial aislado + uno de tres — dolor al pivotar, flexión pasiva completa, o sin desalineación → S 0,58 · E 0,91 · LR+ 6,4.',
      'Flexión máxima con sobrepresión o cuclilla parcial → EVA',
      'Grados de flexión hasta la aparición del dolor, en supino con la cadera a 90°'],
    ['LCP',
      'Cajón posterior a 90° de flexión: carga tibial posterior comparando con la rodilla sana. Grados: I <5 mm · II 5–10 mm · III >10 mm. Signo del sag posterior: supino, rodillas a 90° y pies apoyados; hundimiento de la tibia proximal visto de lado.',
      'Arrodillarse o bajar un escalón → EVA',
      'Grados de flexión activa tolerados sin dolor, en sedestación al borde de la camilla'],
    ['LLE y EPL',
      'Hinchazón y equimosis laterales en fase aguda; palpación dolorosa del ligamento. Varo forzado a unos 30° de flexión: laxitud y pérdida del tope firme; repetir a 0° para valorar el LCA. Marcha con empuje en varo.',
      'Varo forzado a 30° o el gesto en carga que provoca el fallo → EVA',
      'Tiempo de apoyo monopodal tolerado sin dolor ni fallo, descalzo y sin apoyo de manos'],
    ['Fracturas',
      'Regla de Ottawa antes de nada. Rótula: dolor localizado, posible escalón, dolor con extensión resistida, marcha con rodilla rígida. Meseta: hinchada y enrojecida, dolor exquisito sobre el foco, rango limitado, cojera marcada; valorar SIEMPRE la función neurovascular.',
      'No procede en fase aguda: derivar. Tras el alta traumatológica, el gesto que reproduce el dolor → EVA',
      'Tras el alta: déficit de extensión activa frente al lado sano (grados), o tiempo de apoyo monopodal'],
    ['Tendinopatía rotuliana',
      'La mayoría se diagnostica solo con la exploración. Sentadilla monopodal, mejor sobre plano inclinado: suele reproducir los síntomas. Dolor a la palpación del polo inferior de la rótula.',
      'Sentadilla monopodal sobre plano inclinado (o el escalón que tolere) → EVA',
      'Repeticiones de sentadilla monopodal, mismo plano y cadencia, hasta el umbral de dolor; o grados de flexión antes del dolor'],
    ['Dolor femororrotuliano',
      'La sentadilla es el test clínico propuesto; progresar la carga según irritabilidad: monopodal, step-down o más repeticiones. Palpación alrededor de la FR, sobre todo de las facetas.',
      'Sentadilla bilateral o monopodal, o bajada de escalón, hasta donde tolere → EVA',
      'Step-down desde escalón de altura fija: repeticiones en 30 s sin aumentar el dolor, o grados de flexión sin dolor'],
    ['Inestabilidad rotuliana',
      'Si hay traumatismo, diferenciar de la inestabilidad tibiofemoral: los test de estrés tibiofemoral deben ser normales y la movilidad rotuliana estará aumentada en al menos una dirección. Movilidad excesiva: el borde medial de la rótula llega al borde lateral del surco troclear. Test de aprensión.',
      'El gesto que provoca la aprensión o el fallo → EVA; si no hay dolor, episodios de fallo por semana',
      'Fuerza de extensión frente al lado sano, en sedestación a 60° de flexión, siempre con la misma prueba'],
    ['Hoffa',
      'Observación: suelen estar de pie en hiperextensión (genu recurvatum). Test de Hoffa: rodilla pasiva entre 30 y 60°, presión firme sobre el cuerpo graso bajo la rótula, medial o lateral al tendón, y llevar pasivamente a extensión final. Positivo si reproduce el dolor familiar. Repetir al otro lado del tendón.',
      'Contracción isométrica del cuádriceps en extensión completa, o el test de Hoffa → EVA',
      'Grados de extensión pasiva tolerados sin dolor, en supino con el talón elevado sobre una toalla'],
    ['Bursitis pre e infrarrotuliana',
      'PRIMERO diferenciar séptica de aséptica: la fiebre >37,7 °C solo se ha descrito en la séptica → urgencia. Aséptica: dolor localizado, hinchazón EN LA PROPIA BURSA (no difusa), dolor con flexión activa y pasiva, arrodillarse intolerable. Integridad articular normal.',
      'Apoyar la rodilla en el suelo, o la flexión activa máxima → EVA',
      'Grados de flexión activa hasta la aparición del dolor, en sedestación al borde de la camilla'],
    ['Apofisitis del adolescente',
      'PRIMERO la cadera. Después, palpación: tuberosidad tibial dolorosa y visiblemente aumentada (Osgood-Schlatter), o polo inferior de la rótula doloroso sin dolor a lo largo del tendón (Sinding-Larsen). Sentadillas, escaleras, step-down y saltos dolorosos. Extensión resistida dolorosa y débil.',
      'Bajada de escalón o sentadilla monopodal → EVA',
      'Fuerza de extensión resistida en sedestación a 60° frente al lado sano, o repeticiones de step-down con altura fija'],
    ['Lesión osteocondral',
      'Depende de la estabilidad. Dolor a la palpación de la articulación en la zona afectada. Marcha antiálgica con menos flexión en la respuesta de carga. Si es inestable: derrame y signos mecánicos de bloqueo con rango disminuido.',
      'Cuclilla o el gesto de impacto que reproduce el dolor → EVA',
      'Grados de flexión activa en supino hasta el dolor o el tope mecánico']
  ],
  nota: 'Las tendinopatías son más superficiales que las lesiones ligamentosas, más fáciles de palpar y se reproducen con la activación muscular. Ningún test aislado cierra el diagnóstico: lo que funciona son los conjuntos.'
};

// --- OPCIONAL: en rodilla la «orientativa» es la segunda mitad de las
//     fichas: el dolor persistente medial, lateral y posterior.
const ORIENTATIVA = {
  bloque: '4 y 5',   // la plantilla antepone "Bloque 4 y 5 · "
  titulo: 'Dolor persistente · medial, lateral y posterior',
  widths: [1500, 4286, 2400, 2400],
  cabecera: ['Síndrome', 'Explorar · 10′', '① Gesto testigo', '② Medida objetiva'],
  filas: [
    ['Artrosis', 'Criterios clínicos del ACR: dolor de rodilla la mayoría de los días del mes previo MÁS al menos 3 de — edad >50, rigidez <30 min, crepitación, dolor óseo a la palpación, aumento de tamaño óseo, sin calor palpable → S 0,95 · E 0,69 · LR+ 3,06 · LR− 0,07. Rango disminuido, hinchazón persistente, debilidad de cuádriceps.', 'Subir o bajar un escalón, o levantarse de la silla → EVA', 'Sit-to-stand de 30 s con silla, brazos y apoyo fijos; o flexión en supino con goniómetro'],
    ['Bursitis anserina', 'Dolor reproducido con la flexión de rodilla EN CARGA y con la palpación de la pata de ganso (cara medial superior de la tibia).', 'Flexión de rodilla en carga (bajar un escalón) o palpación de la pata de ganso → EVA', 'Repeticiones de subida y bajada de un escalón de altura fija hasta el umbral de dolor'],
    ['Plica sinovial medial', 'Test de provocación de la plica rotuliana medial: S 0,90 · E 0,89 · LR+ 8,18 · LR− 0,11. Es la mejor forma de diagnosticarlo en consulta.', 'El test de provocación de la plica, o la flexión repetida que reproduce el chasquido → EVA', 'Grados de flexión activa hasta el dolor o el enganche, en sedestación al borde de la camilla'],
    ['Cintilla iliotibial', 'Dolor localizado a la palpación a lo largo de la cintilla, sobre todo cerca del epicóndilo lateral y sobre el tubérculo de Gerdy. Step-down lateral: dificultad o Trendelenburg.', 'Step-down lateral, o la carrera o pedaleo reproducidos en consulta → EVA', 'Repeticiones de step-down lateral con altura fija hasta el umbral de dolor; o minutos de carrera hasta el dolor'],
    ['Tibioperonea proximal', 'Dolor lateral que aumenta con la presión directa sobre la cabeza del peroné o con la movilidad accesoria. Movimiento de rodilla doloroso sobre todo con los isquiotibiales en tensión, y movimiento de tobillo doloroso. Cabeza del peroné prominente; hipermovilidad o luxación franca.', 'Presión directa sobre la cabeza del peroné, o el gesto en carga que reproduce el dolor → EVA', 'Grados de flexión activa en prono hasta el dolor, y flexión dorsal de tobillo frente al lado sano'],
    ['Nervio peroneo común', 'Marcha en steppage. Sensibilidad alterada en la cara lateral inferior de la pierna y el dorso del pie. Debilidad de eversión y de flexión dorsal de tobillo y dedos. Tinel o dolor a la palpación cerca de la cabeza del peroné.', 'Si hay dolor, la posición o prueba que lo reproduce (cruzar las piernas, cuclillas, neurodinámica) → EVA', 'Fuerza de flexión dorsal frente al lado sano, misma posición; o repeticiones de elevación del antepié en bipedestación'],
    ['Quiste poplíteo', 'La exploración suele mostrar signos de patología meniscal o condral. Si es palpable, signo de Foucher: firme en extensión completa y blando con la rodilla flexionada. Descartada siempre la TVP.', 'Extensión final de rodilla o flexión máxima → EVA', 'Grados de flexión activa en prono hasta el tope o el dolor'],
    ['Referido de cadera o lumbar', 'Cribado de cadera: rango activo y pasivo de la cadera ipsilateral; el hallazgo clave es la REPRODUCCIÓN del dolor de rodilla. Cribado lumbar: reproducción con el rango activo o la movilidad accesoria pasiva, más exploración neurológica.', 'El movimiento de cadera o de columna lumbar que reproduce el dolor de rodilla → EVA', 'Rotación interna de cadera en supino con cadera y rodilla a 90°, grados frente al lado sano']
  ],
  nota: 'Pseudorradiculopatía: dolor profundo, difícil de localizar, que no sigue la distribución de un nervio ni de una raíz. La imagen de la rodilla puede mostrar cambios degenerativos y dar apoyo aparente a un diagnóstico de rodilla equivocado.'
};

const PRONOSTICO = {
  titulo: 'para «a las X sesiones espero Y; si no lo veo → Z»',
  widths: [1600, 4746, 4240],
  cabecera: ['Síndrome', 'Horizonte e imagen', 'Criterio de derivación o cuidado'],
  filas: [
    ['LCA', 'RM o artroscopia como patrón de referencia. El tratamiento no quirúrgico obtiene buenos resultados, pero casi el 75 % opta por la reconstrucción.', 'Riesgo alto de nueva lesión los dos primeros años tras la reconstrucción, y mayor en quienes vuelven al deporte con déficits.'],
    ['LCM', 'RM como patrón de referencia.', 'La lesión aislada se maneja sin cirugía, con vuelta a la actividad en 2–5 semanas.'],
    ['Menisco', 'RM o artroscopia. En roturas degenerativas, la meniscectomía parcial NO ha demostrado más beneficio que la fisioterapia.', 'Tras lesión meniscal, el riesgo de artrosis es 7 veces mayor. Solo el 30 % periférico está vascularizado, y disminuye con la edad. Jóvenes: mejores candidatos a reparación.'],
    ['LCP · LLE · EPL', 'RM de elección. En urgencias, el 95 % de las lesiones del LCP son combinadas.', 'Las lesiones de LCP grado III se asocian a lesión de la EPL. Siempre que se sospeche LLE, explorar la EPL, y al revés.'],
    ['LLE y EPL', '—', 'NO usar el varo forzado como prueba de descarte: S 25 %, sin E publicada. Un test negativo no descarta la lesión de LLE/EPL.'],
    ['Fracturas', 'Rótula: radiografía AP y lateral; TC en conminutas. Meseta: radiografía primero, TC para clasificar, RM si se sospecha lesión meniscal o ligamentosa.', 'El dolor y el derrame limitan la exploración: no forzar. Ante déficit neurovascular, urgencia.'],
    ['Tendinopatía rotuliana', 'Ecografía o RM. La alteración del tendón en imagen NO se correlaciona de forma constante con el dolor ni con la pérdida de función.', 'Si los síntomas aparecen antes y tardan más en irse, ser más prudente al progresar. VISA-P como cuestionario, aparte de los tres números.'],
    ['Dolor FR', 'Diagnóstico clínico: la imagen solo sirve para descartar otras condiciones.', 'Patogenia multifactorial. Se han descrito hiperalgesia generalizada y peor modulación del dolor: el modelo mecánico no lo explica todo.'],
    ['Inestabilidad rotuliana', 'La entrevista y la exploración completas bastan para el diagnóstico. La imagen sirve para identificar factores predisponentes (ángulo Q aumentado, rótula alta, tróclea displásica) o para descartar fracturas y lesiones osteocondrales; el ligamento femororrotuliano medial se ve en RM.', 'La displasia troclear dificulta la contención de la rótula; laxitud ligamentosa y desequilibrio de tejidos blandos alteran la línea de tracción. Con el ligamento femororrotuliano medial dañado, la cintilla iliotibial tiende a llevar la rótula hacia lateral en la flexión.'],
    ['Hoffa', 'RM: edema, sangrado y fibrosis en el cuerpo graso en fases iniciales; en casos avanzados, metaplasia osteocondral en radiografía o TC.', '—'],
    ['Bursitis pre e infrarrotuliana', 'El diagnóstico clínico suele bastar. Ecografía o RM si hace falta diferenciar séptica de aséptica o descartar otras condiciones: líquido aumentado y engrosamiento de la bursa; la infiltración guiada por ecografía puede ser diagnóstica y terapéutica.', '—'],
    ['Artrosis', 'Kellgren-Lawrence u OARSI. Hasta el 43 % de los mayores de 40 no tiene síntomas. Criterios clínicos + imagen → S 0,91 · E 0,86 · LR+ 6,5 · LR− 0,10.', 'Los criterios del ACR identifican mejor la artrosis avanzada: con criterios negativos en un cuadro incipiente, no descartes. La debilidad del cuádriceps es el factor modificable más potente.'],
    ['Apofisitis', 'La exploración suele bastar; radiografía si hace falta, y ayuda a descartar fractura aguda y tumor.', 'El Sinding-Larsen-Johansson es generalmente autolimitado. Entrenar en otras modalidades o en piscina reduce intensidad y duración.'],
    ['Cintilla iliotibial', 'Diagnóstico clínico: la entrevista y la exploración completas suelen bastar. Las pruebas complementarias sirven para confirmar o descartar otras condiciones.', 'La explicación clásica (fricción de la cintilla sobre el epicóndilo lateral) ha sido cuestionada: los estudios anatómicos apuntan a compresión contra el cuerpo graso muy inervado que hay debajo.'],
    ['Tibioperonea proximal', 'Radiografía de rodilla en AP y lateral para valorar la patología articular. TC si la radiografía no aclara el diagnóstico.', 'La articulación puede ser continua con la tibiofemoral: una presión elevada afecta a las dos. Entre sus causas, además de artrosis e inestabilidad, hay otras condiciones patológicas graves.'],
    ['Nervio peroneo', 'Conducción nerviosa y EMG confirman el diagnóstico y ayudan a establecer el pronóstico. Ecografía útil por lo superficial del nervio.', 'Neurapraxia: pronóstico excelente. Axonotmesis: recuperación parcial o completa. Neurotmesis: mínima. A partir de 4 semanas de compresión aparecen inflamación y cicatriz que enlentecen más la conducción.'],
    ['Quiste poplíteo', 'RM de referencia; ecografía como primera opción, sobre todo para diferenciarlo de una TVP. Se encuentra en el 38 % de las RM de rodillas sintomáticas.', 'El 94 % en adultos se asocia a un trastorno intraarticular: no es un diagnóstico de exclusión. Ante duda con tromboflebitis, derivar.']
  ],
  nota: '③ lo elige el paciente: es la PSFS (anexo), 3 actividades de 0 a 10, cambio mínimo relevante en torno a 2 puntos en una actividad. Cuestionarios aparte, al inicio y al alta (anexo): KOOS-12 general · KOOS-PF en dolor FR · IKDC subjetivo en ligamento, menisco o cartílago · VISA-P en tendinopatía rotuliana. Los valores de cambio mínimo varían mucho entre estudios: orientación, no umbral de alta. Dosis y progresión no están en la guía: son tuyas.'
};

const TITULOS = {
  caraA: ['RODILLA · cara A', 'bloque 0 (con el paciente fuera) y bloques 3–4'],
  caraA2: ['RODILLA · cara A2', 'bisagra y árbol — entrada al bloque 4'],
  caraB: ['RODILLA · cara B', 'rodilla aguda traumática y dolor anterior persistente'],
  caraC: ['RODILLA · cara C', 'dolor medial, lateral y posterior, y bloque 6 de decisión'],
  pieA: 'Guía clínica de rodilla, ap. 1 y anexo A2–A3 · lo marcado (anexo) no procede del capítulo — Ficha de primera visita, bloques 0 y 3',
  pieA2: 'Guía clínica de rodilla, ap. 4 — Ficha de primera visita, bloque 4',
  pieB: 'Guía clínica de rodilla, ap. 5 y anexo A1 · las filas ① y ② son propuestas de la guía, no proceden del capítulo',
  pieC: 'Guía clínica de rodilla, ap. 5, 6 y anexo A4 · filas Imagen, Cuidado y Pronóstico'
};

generarTarjeta(REGION, CONFIG, {
  URGENCIA, BANDERAS, BISAGRA, ARBOL, SINDROMES, ORIENTATIVA, PRONOSTICO, TITULOS
});
