// Tarjeta de región · tobillo y pie
// Solo config y contenido. Helpers y montaje: plantilla_tarjetas.js
const generarTarjeta = require('../tools/plantilla_tarjetas');

const REGION = 'tobillo_pie';

const CONFIG = {
  DARK: '3E6A2E',      // cabeceras de tabla (color propio de la región)
  SZ_A: 17,          // cuerpo de tabla, cara A
  SZ_B: 15,          // cuerpo de tabla, cara B (muchos síndromes)
  SPLIT_A: true,    // A y A2 en dos caras
  SPLIT_B: true     // B y C en dos caras
};

// ═══════════════════════════════════════════════════════════════════
//  CONTENIDO — REGION TOBILLO Y PIE
//  Todo lo de aqui sale de la guia clinica de la region. No inventar
//  cifras de S, E ni LR: si no estan en la guia, se omiten. La celda
//  «Explorar · 10′» solo lleva la fila «Explorar · 10’» de la ficha.
// ═══════════════════════════════════════════════════════════════════

const URGENCIA = {
  titulo: 'URGENCIAS · COMPARTIMENTAL Y NEUROVASCULAR · ARTRITIS INFECCIOSA · ROTURA DEL AQUILES · OTTAWA',
  lineas: [
    'SÍNDROME COMPARTIMENTAL Y COMPROMISO NEUROVASCULAR tras lesión grave del mediopié (Lisfranc): el flujo puede caer tras luxarse el 2.º MT → cirugía urgente. Cinco P: palidez · dolor desproporcionado · parestesias · sin pulso · frialdad.',
    'ARTRITIS INFECCIOSA: monoartritis aguda con MALESTAR SISTÉMICO Y FIEBRE ALTA → URGENCIA HOY. En la gota, en cambio, está sistémicamente bien.',
    'ROTURA AGUDA DEL AQUILES: golpe o patada detrás de la pierna en un gesto explosivo, a veces chasquido; camina sorprendentemente bien, con cojera. Thompson: prono, pie fuera de la camilla; al comprimir la pantorrilla el tobillo no se mueve → S 96 % · E 93 % → derivación preferente.',
    'REGLAS DE OTTAWA, antes de explorar cualquier traumatismo agudo. TOBILLO → radiografía si dolor en la zona maleolar Y alguno: dolor óseo en los 6 cm distales del borde posterior de la tibia o punta del maléolo medial · ídem del peroné o punta del maléolo lateral · no carga cuatro pasos, ni justo tras la lesión ni en consulta. PIE → radiografía si dolor en el mediopié Y alguno: dolor óseo en la base del 5.º MT · en el navicular · no carga cuatro pasos. Muy sensible, moderadamente específica (sin cifras en el capítulo). Excluidas embarazadas y personas que no pueden seguir la prueba (p. ej., traumatismo craneal). ≈10 % de las inversiones acaban en fractura.'
  ]
};

const BANDERAS = {
  titulo: 'Banderas rojas de la región — sobre el cribado general de la ficha',
  widths: [1800, 5400, 3386],
  cabecera: ['Sospecha → derivación médica', 'Pistas en entrevista y exploración', 'Ayuda en consulta'],
  filas: [
    ['Lisfranc', 'Caída hacia delante sobre el pie en punta (fallar un escalón), pie fijo con sacudida, aplastamiento. Dolor inmediato, no carga. Casi el 20 % pasa desapercibido.', 'Equimosis plantar: patognomónica (tarda 24–48 h). 1.º y 2.º MT en direcciones opuestas → dolor. Cinco P.'],
    ['Fractura de calcáneo', 'Caída desde altura sobre el talón; a menudo con alcohol, no recuerda el mecanismo. No quiere apoyar.', 'Talón doloroso, hinchado, con equimosis. La radiografía es poco sensible: TC.'],
    ['Fracturas del 5.º MT', 'Inversión con flexión plantar. Jones: dolor lateral previo de bajo grado.', 'Dolor en la base del 5.º MT. Jones: riesgo de pseudoartrosis sin fijación.'],
    ['Fractura de estrés de alto riesgo o múltiple', 'Insidiosa tras un cambio de carga, sin efecto de calentamiento, dolor nocturno. Más de dos en huesos distintos → densidad ósea, RED-S, endocrino, nutricional.', 'Punto N doloroso > lado sano: navicular hasta que se demuestre lo contrario. Calcáneo: compresión medial y lateral a la vez.'],
    ['Rotura del tibial posterior o del FHL', 'Tendinopatía que progresa o eversión forzada (TP). Impulso o aterrizaje forzado; artritis reumatoide (FHL).', 'TP: arco aplanado, «demasiados dedos», no inicia la ETM. FHL: no flexiona la interfalángica del primer dedo.'],
    ['Osteoma osteoide y otros tumores', 'Segunda década. Dolor sordo peor de noche, sin relación con la actividad; alivio en <20 min con AINE. Sin alivio → otras causas (osteosarcoma: masa blanda).', 'Dolor puntual y tumefacción. ≈25 % no se ve en radiografía.'],
    ['Artritis inflamatoria', 'Rigidez matutina de más de 60 min que mejora con la actividad (reumatoide, espondiloartropatía, psoriásica, reactiva).', 'Tumefacción caliente, a menudo simétrica; dactilitis y uñas en la psoriásica.'],
    ['Malignidad o infección', 'Síntomas sistémicos, pérdida de peso, sudores nocturnos; dolor nocturno que despierta.', 'Cribado general de la ficha. No reproducir el dolor conocido también obliga a pensarlo.'],
    ['Claudicación vascular o neurógena', 'Dolor o calambre a una distancia o duración de esfuerzo reproducible.', 'Pulsos distales y exploración neurológica.'],
    ['SDRC', 'Signos autonómicos tras una lesión: rubor, hinchazón más allá de la fase aguda, hiperestesia, hiperalgesia.', 'Temperatura, color, sudoración y sensibilidad frente al lado sano.'],
    ['Neuropatía sistémica', 'Dolor neuropático simétrico (diabetes), pie caído (mononeuritis múltiple), debilidad simétrica progresiva en 2–4 semanas con arreflexia (desmielinizante aguda → mismo día).', 'Reflejo aquíleo, vibración, pinchazo, temperatura.'],
    ['TVP tras inmovilización · Wells (anexo)', '+1 cada uno: cáncer activo · parálisis, paresia o inmovilización con férula · encamamiento ≥3 días o cirugía mayor en 12 semanas · dolor en el trayecto venoso profundo · hinchazón de toda la pierna · pantorrilla >3 cm más gruesa (10 cm bajo la tuberosidad tibial) · edema con fóvea solo en esa pierna · venas colaterales no varicosas · TVP previa. −2: diagnóstico alternativo al menos tan probable.', 'El capítulo no la menciona. ≥2 → probable; ≤1 → improbable. Orienta la derivación, no la sustituye.']
  ],
  nota: 'Las banderas rojas se revisan en todas las visitas, no solo en la primera.'
};

const BISAGRA = {
  pregunta: '¿Hubo traumatismo agudo, y dónde se localiza el dolor?',
  ramas: 'TRAUMÁTICO → Ottawa primero, después por mecanismo: inversión · rotación externa con flexión dorsal · caída sobre el pie en punta · caída sobre el talón · gesto explosivo      |      NO TRAUMÁTICO → por localización: posterior · medial · lateral · anterior · talón plantar · mediopié · antepié',
  apoyo: 'La localización orienta hacia hueso, articulación, tendón, nervio o músculo, pero el dolor puede venir de más de una estructura. El hallazgo clave es reproducir el dolor conocido: si no se reproduce, repensar (columna lumbar, origen proximal, malignidad).',
  nota: 'La guía de tobillo y pie no nombra una bisagra: son los pasos 2, 7 y 8 de su árbol — traumatismo primero, localización después — usados como tal.'
};

const ARBOL = {
  widths: [620, 9966],
  filas: [
    ['1', ['¿Cinco P tras lesión grave del mediopié, monoartritis aguda con fiebre y malestar, o debilidad simétrica progresiva con arreflexia? → URGENCIA: derivación médica hoy.   ·   No → 2']],
    ['2', ['¿Traumatismo agudo?   Sí → 3   ·   No → 5']],
    ['3', ['¿Algún criterio de Ottawa de tobillo o de pie, Thompson positivo, o mecanismo de Lisfranc o de caída sobre el talón? → DERIVAR para radiografía (Ottawa) o derivación preferente (Aquiles, Lisfranc, calcáneo) antes de seguir explorando.   ·   No → 4']],
    ['4', ['Tobillo agudo traumático, ¿qué mecanismo cuenta? Inversión del retropié o flexión plantar con aducción → ESGUINCE LATERAL (LPAA y LPC; dolor en la base del 5.º MT → Ottawa) · rotación externa del pie con flexión dorsal forzada, contacto → SINDESMOSIS · inversión en plantígrado en terreno irregular → CALCANEOCUBOIDEA · flexión dorsal e inversión con contracción forzada, chasquido medial → LUXACIÓN DEL TIBIAL POSTERIOR.']],
    ['5', ['¿Niño o adolescente con dolor bien localizado o sin mecanismo claro? Inserción del Aquiles (8–12 años) → SEVER · base del 5.º MT (8–13) → ISELIN · navicular → APOFISITIS DEL TIBIAL POSTERIOR o KÖHLER (menores de 10, cojera) · cabeza del 2.º–4.º MT (14–18) → FREIBERG · esguince que no se resuelve, bloqueo → OSTEOCONDRITIS DISECANTE · dolor nocturno con alivio rápido por AINE → OSTEOMA OSTEOIDE.   ·   No → 6']],
    ['6', ['¿La exploración local no reproduce el dolor conocido? → COLUMNA LUMBAR u origen proximal: slump con flexión plantar e inversión. Si persiste la duda, replantear (malignidad).   ·   No → 7']],
    ['7', [
      '¿Dolor sin traumatismo en el tobillo? POSTERIOR → pinzamiento posterior (flexión plantar máxima) · Aquiles porción media (pinza, 2–6 cm) · insercional (un dedo, flexión dorsal) · vaina (crepitación, rango amplio) · plantar (medial y proximal) · sural (lateral, neuropático) · bursa superficial (roce del zapato).',
      'MEDIAL → tibial posterior (retromaleolar, ETM sin varo del retropié) · FHL (transición de flexión dorsal a plantar) · túnel del tarso (Tinel) · fractura de estrés. LATERAL → seno del tarso · peroneos · estrés del astrágalo · referido. ANTERIOR → pinzamiento anterior (KTW).   ·   No → 8'
    ]],
    ['8', [
      '¿Dolor en el pie? TALÓN PLANTAR → dolor plantar crónico (tuberosidad medial) · almohadilla grasa (posterolateral) · atrapamiento nervioso (Tinel) · estrés del calcáneo. MEDIOPIÉ → calcaneocuboidea · navicular (punto N) · Lisfranc · cuboides y cuñas · coalición. ANTEPIÉ → 1.ª MTF · base del 2.º MT · cuello de MT · 5.º MT · Morton · gota.',
      'No → DOLOR VAGO DEL TOBILLO o que no se resuelve tras un esguince → inestabilidad crónica · sindesmosis · sinovitis postraumática · coalición tarsiana · artrosis · osteocondritis disecante.'
    ]]
  ]
};

const SINDROMES = {
  widths: [1450, 4536, 2300, 2300],
  aviso: 'Antes de explorar: severidad e irritabilidad. Alta — esguince agudo con derrame, sospecha de fractura de estrés, tendón muy reactivo → solo bisagra y 1–2 tests; sin saltos, sin series de ETM hasta la fatiga, sin final de rango forzado. ETM = elevación de talón monopodal (objetivo: 25 o más con buena técnica) · KTW = rodilla a la pared (deseable: 8 cm o más) · LPAA peroneoastragalino anterior · LPC peroneocalcáneo · LTPAI tibioperoneo anteroinferior. Aquiles: la palpación no ayuda al diagnóstico.',
  filas: [
    ['Esguince lateral agudo',
      'Si no carga: Ottawa antes de nada. Priorizar LPAA (palpar y estirar: flexión plantar con inversión y rotación interna) y LPC (palpar y estirar: inversión del retropié con el tobillo en flexión dorsal). Reproducir el dolor conocido indica lesión de ese ligamento.',
      'Estiramiento pasivo del LPAA o apoyo monopodal → EVA',
      'Tiempo de apoyo monopodal descalzo sin dolor; cuando tolere carga, KTW en cm frente al lado sano'],
    ['Sindesmosis',
      'Palpación del LTPAI (la más sensible) + squeeze test (la más específica). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo.',
      'Squeeze test o flexión dorsal en carga → EVA',
      'KTW en cm frente al lado sano, cuando tolere la carga'],
    ['Rotura del Aquiles',
      'Thompson (Simmonds): S 96 % · E 93 %. Hueco palpable, que se pierde con el tiempo.',
      { span: 'No procede: derivar. Tras el alta, el gesto que reproduce → EVA y ETM a tempo fijo frente al lado sano.' }],
    ['Lisfranc',
      'Neurovascular y cinco P. Equimosis plantar patognomónica (falta en esguinces aislados, tarda 24–48 h). Dolor en todo el ancho del mediopié. 1.º y 2.º MT en direcciones opuestas → dolor.',
      { span: 'No procede en fase aguda: derivar. Tras el alta, despegue o ETM → EVA; ETM a tempo fijo.' }],
    ['Fracturas del pie (5.º MT, calcáneo)',
      'Ottawa. 5.º MT: dolor en la base en todos los tipos; en la espiral, a lo largo del hueso. Calcáneo: talón doloroso, hinchado, con equimosis.',
      { span: 'No procede en fase aguda: derivar.' }],
    ['Luxación del tibial posterior',
      'Hinchazón y equimosis perimaleolar medial. Se subluxa hacia delante con la flexión dorsal y se recoloca con la plantar.',
      'Flexión dorsal y plantar activa que provoca el resalte → EVA',
      'Sin medida propia: derivar para confirmar'],
    ['Pinzamiento posterior',
      'Dolor conocido con la flexión plantar pasiva o el test de pinzamiento posterior (flexión plantar comprimiendo el calcáneo contra la tibia): confirma. Hinchazón a ambos lados del Aquiles; dolor por detrás del astrágalo.',
      'Test de pinzamiento posterior o media punta en carga → EVA',
      'ETM a tempo fijo hasta dolor o pérdida de técnica, frente al lado sano; o KTW en cm'],
    ['Aquiles porción media',
      'Batería progresiva: ETM bipodal → monopodal → saltos bipodales → monopodales, hasta reproducir; dolor localizado (1–2 dedos). EVA en cada escalón. Vigilar la descarga: aterrizar con el talón; saltar con el talón elevado aumenta el dolor.',
      'Primer escalón de la batería que reproduce → EVA',
      'Repeticiones de ETM monopodal a tempo fijo en el suelo, hasta dolor o fatiga, frente al lado sano'],
    ['Aquiles insercional',
      'Dolor con carga y flexión dorsal, menos en flexión plantar. Menos dolor al saltar con el talón elevado, más al aterrizar con el talón abajo y la rodilla flexionada. ETM monopodal sobre plano inclinado como provocación.',
      'ETM monopodal desde flexión dorsal en el borde de un step → EVA',
      'Repeticiones de ETM monopodal a tempo fijo en suelo plano, hasta dolor o fatiga'],
    ['Vaina del Aquiles',
      'Crepitación en la flexión plantar y dorsal; dolor más difuso. Duelen las ETM (rango amplio); el salto puede doler menos.',
      'Flexión plantar y dorsal activas repetidas en prono sobre la camilla → EVA',
      'Repeticiones de ETM monopodal en todo el rango, a tempo fijo, hasta el dolor'],
    ['Plantar delgado',
      'Dolor con la ETM desde flexión dorsal completa hasta flexión plantar completa sobre un step. Dolor medial del Aquiles caminando descalzo.',
      'ETM monopodal sobre un step desde flexión dorsal completa → EVA',
      'Repeticiones de ETM monopodal a tempo fijo en suelo plano, hasta el dolor'],
    ['Nervio sural',
      'Tinel a lo largo del sural. Palpación en prono con flexión dorsal pasiva: una diferencia entre lados, con el perfil clínico, hace sospechar.',
      'Prueba neurodinámica con sesgo del sural → EVA',
      'Grados de flexión dorsal (o de la articulación de la prueba) hasta los síntomas, misma posición'],
    ['Bursa calcánea superficial',
      'Dolor superficial e hinchazón en el talón posterior que aumentan con la presión.',
      'Presión sobre la bursa o contrafuerte del zapato → EVA',
      'Sin medida de capacidad: no depende de la carga. Basta ①'],
    ['Tibial posterior',
      'Dolor por detrás y por debajo del maléolo medial. Dolor conocido y debilidad relativa en la inversión resistida. ETM: el retropié no va a varo; en fases avanzadas no inicia. «Demasiados dedos».',
      'ETM monopodal (inicio del despegue) o inversión resistida → EVA',
      'Repeticiones de ETM monopodal a tempo fijo con el retropié a varo, frente al lado sano'],
    ['FHL',
      'Flexión dorsal y plantar activas del primer dedo con el tobillo en flexión plantar completa: reproduce. Crepitación e hinchazón en la vaina, posteromedial.',
      'Flexoextensión activa del primer dedo con el tobillo en flexión plantar completa → EVA',
      'Repeticiones de ETM monopodal a tempo fijo hasta el dolor, frente al lado sano'],
    ['Túnel del tarso',
      'Tinel a lo largo del túnel. Hinchazón en el túnel o en la subastragalina posterior, proximal al sustentaculum tali. Explorar el FHL, que puede ser la fuente.',
      'Tinel o la posición que reproduce → EVA',
      'Grados de flexión dorsal con eversión hasta los síntomas, misma posición'],
    ['Estrés del tobillo (maléolo medial, astrágalo, calcáneo)',
      'Dolor óseo a la palpación; puede haber derrame. Calcáneo: compresión medial y lateral a la vez. Astrágalo: hinchazón en el seno del tarso o posterior.',
      'Carga monopodal o marcha → EVA. Sin saltos ni series',
      'Minutos de marcha en cinta sin dolor, a velocidad e inclinación fijas'],
    ['Seno del tarso',
      'Dolor conocido a la palpación del seno del tarso, a menudo también con el estrés en inversión de la subastragalina o el KTW con pronación excesiva.',
      'Palpación del seno del tarso o KTW con pronación → EVA',
      'KTW en cm frente al lado sano'],
    ['Peroneos',
      'Dolor localizado sobre los tendones por detrás del maléolo lateral. Posible subluxación por encima y por delante del maléolo. Crepitación e hinchazón si hay peritendón.',
      'Eversión resistida o el gesto en carga que reproduce → EVA',
      'Repeticiones de ETM monopodal a tempo fijo, frente al lado sano'],
    ['Pinzamiento anterior',
      'El KTW reproduce el dolor y muestra limitación. Hinchazón y palpación dolorosa y engrosada: interlínea anterior, astragaloescafoidea, seno del tarso, LTPAI, LPAA.',
      'Zancada o KTW en carga → EVA',
      'KTW en cm frente al lado sano'],
    ['Referido lumbar',
      'Elevación de la pierna recta o slump con el tobillo en flexión plantar e inversión: pueden reproducir.',
      'La prueba neurodinámica o el movimiento lumbar que reproduce → EVA',
      'Grados de elevación de la pierna recta hasta los síntomas, tobillo en la misma posición']
  ],
};

const ORIENTATIVA = {
  bloque: '4 y 5',   // la plantilla antepone "Bloque 4 y 5 · "
  titulo: 'Dolor vago del tobillo, talón plantar, mediopié y antepié',
  widths: [1450, 4536, 2300, 2300],
  cabecera: ['Síndrome', 'Explorar · 10′', '① Gesto testigo', '② Medida objetiva'],
  filas: [
    ['Inestabilidad crónica', 'Hinchazón articular. Laxitud tibioastragalina (signo del surco en el cajón anterior → rotura completa del LPAA probable) y subastragalina (inversión excesiva del retropié frente al lado sano).', 'El gesto que provoca aprensión o fallo → EVA; si no hay dolor, fallos por semana', 'Tiempo de apoyo monopodal descalzo, ojos abiertos, sin manos, frente al lado sano'],
    ['Sinovitis postraumática', 'Hinchazón y dolor a la palpación. Puede haber laxitud del LPAA y del LPC.', 'El gesto en carga que reproduce (zancada, apoyo monopodal) → EVA', 'KTW en cm frente al lado sano'],
    ['Coalición tarsiana', 'Restricción de la movilidad subastragalina, a menudo también mediotarsiana.', 'Inversión y eversión del retropié, o el gesto en carga que reproduce → EVA', 'Grados de inversión y eversión del retropié frente al lado sano, misma posición'],
    ['Artrosis', 'Dolor a la palpación de la interlínea; según la evolución, rango limitado, derrame, deformidad, debilidad; tumefacción ósea periarticular.', 'Bajar un escalón o zancada → EVA', 'KTW en cm, o grados de flexión dorsal de la 1.ª MTF si es la afectada'],
    ['Osteocondritis disecante del astrágalo', 'Dolor a la palpación de la cara anterior de la cúpula astragalina con el pie en flexión plantar completa. Hinchazón, derrame, crepitación.', 'El gesto de impacto o carga que reproduce → EVA', 'KTW en cm frente al lado sano'],
    ['Dolor plantar crónico del talón', 'Dolor conocido a la palpación de la inserción de la fascia en la tuberosidad medial del calcáneo.', 'Primeros pasos tras estar sentado, o palpación de la tuberosidad → EVA', 'Minutos de marcha en cinta sin aumento del dolor, velocidad fija; o ETM a tempo fijo'],
    ['Almohadilla grasa', 'Dolor a la palpación de la región posterolateral del talón.', 'Apoyo del talón en la marcha o palpación posterolateral → EVA', 'Minutos de marcha en cinta sin dolor, velocidad fija'],
    ['Atrapamiento nervioso del talón', 'Tinel justo proximal al origen de la fascia en la tuberosidad medial, o a lo largo del calcáneo medial.', 'Tinel o la carga que reproduce → EVA', 'Minutos de marcha en cinta hasta los síntomas, velocidad fija'],
    ['Calcaneocuboidea y cubometatarsiana', 'Aguda: dolor en calcaneocuboidea dorsal, ligamento bifurcado, apófisis anterior del calcáneo o ligamentos cubometatarsianos. Gradual: dolor en las interlíneas del cuboides hacia las bases del 4.º–5.º MT. Caminar, cargar el antepié y el inicio de la ETM dan dolor agudo.', 'Inicio de la ETM, o presión plantar sobre el cuboides → EVA', 'Repeticiones de ETM monopodal a tempo fijo hasta el dolor, frente al lado sano'],
    ['Estrés del mediopié (navicular, cuboides, cuñas)', 'Punto N doloroso frente al lado sano: navicular hasta que se demuestre lo contrario. Dolor puntual sobre cuboides o cuñas.', 'Marcha o carga monopodal → EVA. Sin saltos', 'Minutos de marcha en cinta sin dolor, velocidad e inclinación fijas'],
    ['1.ª MTF', 'Dirigida por la historia. Equimosis tras esguince o fractura; hinchazón en la interlínea. Rango frente al lado sano (flexión dorsal normal ≈60°; danza y gimnasia hasta 90°). Dolor sobre los sesamoideos.', 'Flexión dorsal de la 1.ª MTF en carga (media punta, despegue) → EVA', 'Grados de flexión dorsal pasiva de la 1.ª MTF con goniómetro, primer radio estabilizado, frente al lado sano'],
    ['Base del 2.º MT', 'Dolor a la palpación de la base del 2.º MT y de la articulación de Lisfranc. Mediotarsiana posiblemente rígida.', 'Media punta, o palpación de la base del 2.º MT → EVA', 'Repeticiones de ETM monopodal a tempo fijo hasta el dolor'],
    ['Cuello de MT (fractura de marcha)', 'Dolor puntual sobre el cuello. La carga axial del MT provoca dolor en la lesión ósea, menos en la de partes blandas.', 'Marcha o carga del antepié → EVA', 'Minutos de marcha en cinta sin dolor, velocidad fija'],
    ['Morton o bursitis intermetatarsiana', 'Dolor a la palpación directa del espacio (sobre todo 3.º–4.º); posible chasquido al palpar mientras se comprimen los metatarsianos.', 'Palpación del espacio con compresión transversal → EVA', 'Minutos de marcha en cinta hasta los síntomas, mismo calzado y velocidad'],
    ['Gota', 'Articulación roja, hinchada, muy dolorosa al tacto y al movimiento; puede parecer una dactilitis. Sistémicamente bien; tofos en la gota de larga evolución.', { span: 'No procede en la crisis: derivar para confirmar. Con fiebre y malestar → artritis infecciosa: urgencia.' }]
  ],
  nota: 'Estrés o fractura de estrés de la base del 2.º MT: dolor nocturno, sin efecto de calentamiento. Sinovitis: sin dolor nocturno, con efecto de calentamiento. Morton frente a metatarsalgia (callosidad, colapso del arco), Freiberg (14–18 años, cabeza del MT) y estrés de MT (dolor más dorsal).'
};

const PRONOSTICO = {
  titulo: 'para «a las X sesiones espero Y; si no lo veo → Z»',
  widths: [1700, 4646, 4240],
  cabecera: ['Síndrome', 'Horizonte e imagen', 'Criterio de derivación o cuidado'],
  filas: [
    ['Esguince lateral', 'Ottawa decide la radiografía. Cajón anterior con mejor S y E a los 4–6 días; sin signo del surco, el LPAA no está roto del todo.', 'Una proporción alta evoluciona a inestabilidad crónica. Si no se recupera: coalición, osteocondritis disecante, sinovitis, pinzamiento posterior secundario, peroneos.'],
    ['Sindesmosis', 'Si LTPAI y squeeze son positivos, hace falta imagen: la RM tiene una precisión de hasta el 95 %.', '—'],
    ['Aquiles roto · Lisfranc · fracturas', 'Aquiles: imagen solo para decidir quirúrgico o conservador. Lisfranc: radiografía en carga con los dos pies en la misma placa, S y E bajas → TC o RM. Calcáneo: TC. 5.º MT: radiografía.', 'Fractura de Jones: riesgo de pseudoartrosis sin fijación quirúrgica.'],
    ['Pinzamiento posterior', 'Radiografía en flexión plantar en carga y RM; ningún hallazgo se correlaciona con los síntomas. La infiltración con anestésico confirma.', 'Responde bien a conservador, técnica y retorno graduado. Si no responde a la infiltración o la recuperación se complica → replantear el diagnóstico.'],
    ['Aquiles (media, insercional, vaina, plantar)', 'Diagnóstico clínico: la patología en imagen es frecuente sin síntomas; neovasos y calcificación no son diagnósticos.', 'VISA-A mes a mes; entre medias, dolor y rigidez matutinos y EVA en saltos. La bursa retrocalcánea no se trata aislada de la insercional. Dolor nocturno → otro diagnóstico.'],
    ['Tibial posterior', 'Ecografía (tendón frente a peritendón); RM para complicaciones. La imagen no se correlaciona necesariamente con los síntomas.', 'Puede progresar a rotura y pie plano adquirido: no hace ETM + «demasiados dedos» → derivar.'],
    ['FHL', 'Ecografía dinámica de elección; sus hallazgos son frecuentes sin síntomas.', 'Crónico: tenosinovitis estenosante. No flexiona la interfalángica → rotura: derivar.'],
    ['Nervios (sural, túnel del tarso, talón)', 'Túnel: la conducción no siempre es positiva (diagnóstico clínico). Talón: infiltración diagnóstica ecoguiada; conducción si se plantea cirugía.', 'Túnel del tarso: tratar la causa de la hinchazón (FHL, sinovitis subastragalina, esguince).'],
    ['Fracturas de estrés', 'Radiografía poco sensible al principio; RM de elección; TC para caracterizar.', '3–4 meses hasta el deporte tras una no complicada; complicada si no se resuelve con reposo relativo. Varias → causas sistémicas (RED-S, endocrinas, densidad ósea).'],
    ['Seno del tarso · sinovitis · pinzamiento anterior', 'La infiltración con anestésico local en la zona confirma si alivia el dolor conocido. Pinzamiento anterior: radiografía para osteofitos; TC si se sospecha navicular u osteocondral.', 'La sinovitis postraumática suele resolverse con reposo relativo y rehabilitación. En el pinzamiento anterior, las partes blandas duelen más a menudo que los osteofitos.'],
    ['Peroneos', 'Diagnóstico sobre todo clínico; RM o ecografía si hace falta.', 'Tras esguince grave o fractura, una rotura aguda puede pasar desapercibida porque la función se conserva: con sospecha alta, imagen.'],
    ['Inestabilidad crónica', 'CAIT menos de 24, o IdFAI más de 11: indican inestabilidad crónica (cuestionarios aparte de los tres números).', 'Valorar deficiencias mecánicas y sensoriomotoras: guían el tratamiento.'],
    ['Coalición · osteocondritis disecante', 'Coalición: radiografía oblicua a 45°; la TC es poco sensible a las no óseas. Osteocondritis: hasta un tercio de las radiografías son normales al principio → RM.', 'La coalición suele ser asintomática hasta una lesión (12,7 % en disección, relevancia incierta).'],
    ['Artrosis', 'Diagnóstico clínico: más de 45 años, dolor con el uso, rigidez de menos de 30 min. La radiografía no se correlaciona de forma fiable.', 'En jóvenes o con rasgos inflamatorios, progresión rápida o síntomas constitucionales → más pruebas; VSG y PCR deben ser normales.'],
    ['Talón plantar', 'Imagen innecesaria si la clínica encaja; ecografía para la fasciopatía. El espolón no se relaciona con el dolor.', 'Atrapamiento nervioso coexistente en el 20–52 %: valorar el componente neural si no mejora.'],
    ['Calcaneocuboidea · 1.ª MTF · Morton', 'Calcaneocuboidea: diagnóstico clínico, la imagen ayuda poco. 1.ª MTF: radiografía si fractura o artrosis; sesamoideos bipartitos frecuentes. Morton: ecografía.', '1.ª MTF caliente e hinchada sin cambio de carga → gota o artritis inflamatoria.'],
    ['Pediátricos', 'Apofisitis: imagen rara vez necesaria. Köhler y Freiberg: radiografía característica (mirar el otro pie en Köhler).', 'Las apofisitis suelen resolverse en 6–12 meses, a veces hasta 2 años. Osteoma osteoide sin alivio por AINE → otras causas.']
  ],
  nota: '③ lo elige el paciente: es la PSFS (anexo), 3 actividades de 0 a 10, cambio mínimo relevante en torno a 2 puntos. Cuestionarios aparte, al inicio y al alta: VISA-A en el Aquiles (capítulo); FAAM o LEFS como generales (anexo, orientativos). Dosis y progresión no están en la guía: son tuyas.'
};

const TITULOS = {
  caraA: ['TOBILLO Y PIE · cara A', 'bloque 0 (con el paciente fuera) y bloques 3–4'],
  caraA2: ['TOBILLO Y PIE · cara A2', 'bisagra y árbol — entrada al bloque 4'],
  caraB: ['TOBILLO Y PIE · cara B', 'tobillo agudo y dolor posterior, medial, lateral y anterior'],
  caraC: ['TOBILLO Y PIE · cara C', 'dolor vago, talón plantar, mediopié y antepié, y bloque 6 de decisión'],
  pieA: 'Guía clínica de tobillo y pie, ap. 1 y anexo A1 · lo marcado (anexo) no procede del capítulo — Ficha de primera visita, bloques 0 y 3',
  pieA2: 'Guía clínica de tobillo y pie, ap. 4 — Ficha de primera visita, bloque 4',
  pieB: 'Guía clínica de tobillo y pie, ap. 5 · las filas ① y ② son propuestas de la guía, no proceden del capítulo',
  pieC: 'Guía clínica de tobillo y pie, ap. 5, 6 y anexo A2 · filas Imagen, Cuidado y Pronóstico'
};

generarTarjeta(REGION, CONFIG, {
  URGENCIA, BANDERAS, BISAGRA, ARBOL, SINDROMES, ORIENTATIVA, PRONOSTICO, TITULOS
});
