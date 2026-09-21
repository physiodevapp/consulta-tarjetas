// Formulario previo a la primera visita · tobillo y pie
const generarFormulario = require("../tools/plantilla_formularios");

const REGION = "tobillo_pie";

// Cara 2: rama de la región. Piezas disponibles (h): section, q(negrita, resto),
// opts(texto), hint, writeLine, choice(...etiquetas), fila(texto) para tablas
// Sí/No/No sé, run, Paragraph, B, S.
// Criterios: solo preguntas del ap. 3 de la guía, en lenguaje de paciente. Ni banderas rojas ni
// localización (eje 1): se preguntan en persona. Las reglas de Ottawa se exploran, no se preguntan.
const CONTENIDO = (h) => ({
  titulo: "Sobre su tobillo o su pie en concreto",
  intro: "Marque lo que mejor describa lo que le pasa. Si duda, marque «No sabría decir».",
  bloques: [
    // Ap. 3 y árbol paso 4: esguince lateral (inversión), sindesmosis (rotación externa con flexión dorsal,
    // contacto), Lisfranc (caída hacia delante sobre el pie en punta, fallar un escalón), calcáneo (caída
    // sobre el talón), rotura del Aquiles (golpe o patada detrás de la pierna en un gesto explosivo),
    // 1.ª MTF (hiperextensión del dedo gordo). La puerta es la hoja 1 («¿Hubo algo concreto…?»).
    h.q("Si en la hoja 1 contestó que NO hubo nada concreto que lo desencadenara, salte el apartado siguiente."),
    h.section("SI EMPEZÓ CON UNA TORCEDURA, UN GOLPE O UNA CAÍDA"),
    h.q("¿Qué pasó? ", " (puede marcar varias)"),
    h.opts(h.choice("Se me torció el tobillo hacia dentro, apoyando el borde de fuera del pie")),
    h.opts(h.choice("Me giraron el pie hacia fuera con el tobillo doblado hacia arriba (un placaje, una entrada)")),
    h.opts(h.choice("Me caí hacia delante con el pie de puntillas, o fallé un escalón al bajar")),
    h.opts(h.choice("Caí de pie desde una altura, sobre el talón", "Se me dobló el dedo gordo hacia arriba o hacia abajo")),
    h.opts(h.choice("Al arrancar o impulsarme, noté como una patada o un golpe detrás de la pierna")),
    h.opts(h.choice("Ninguna de estas", "No sabría decir")),
    h.q("¿Oyó o notó un chasquido en ese momento? ", "    " + h.choice("Sí", "No", "No sabría decir")),
    h.q("¿Pudo seguir con lo que estaba haciendo? ", "    " + h.choice("Sí", "No, tuve que parar", "No sabría decir")),
    // Ap. 3: esguinces repetidos → inestabilidad crónica y coalición tarsiana.
    h.q("¿Se le había torcido ese tobillo otras veces? ", "    " + h.choice("No", "Una vez", "Varias veces", "No sabría decir")),

    // Ap. 3: dolor plantar del talón y Aquiles (primeros pasos, tras estar sentado), Aquiles porción media
    // (peor al día siguiente), insercional y plantar (descalzo o plano), pinzamiento posterior y FHL
    // (puntillas, media punta), pinzamiento anterior (agacharse, zancada), vaina (bici, natación),
    // calcaneocuboidea (terreno irregular, arena), bursa superficial y Morton (calzado). Casi todas son
    // también el menú de ③ (ap. 6).
    h.section("QUÉ LE PROVOCA EL DOLOR"),
    h.q("¿Le aparece o le aumenta el dolor al…?"),
    h.fila("Dar los primeros pasos al levantarse de la cama"),
    h.fila("Echar a andar después de estar sentado un rato"),
    h.fila("Caminar descalzo o con calzado plano"),
    h.fila("Ponerse de puntillas"),
    h.fila("Agacharse doblando mucho el tobillo"),
    h.fila("Correr"),
    h.fila("Saltar o caer de un salto"),
    h.fila("Caminar por terreno irregular o arena"),
    h.fila("Montar en bici o nadar"),
    h.fila("Llevar ciertos zapatos (le rozan o le aprietan)"),
    // Ap. 3 y 6: rasgo distintivo del Aquiles (peor al día siguiente); efecto del calentamiento (lo sinovial
    // se calienta, el tendón muy provocado y el hueso no); tacón (alivia insercional y plantar).
    h.q("El día después de hacer más de lo normal, ¿está peor? ", "    " + h.choice("Sí", "No", "No sabría decir")),
    h.q("Cuando empieza a moverse, el dolor…"),
    h.opts(h.choice("Se me pasa al calentar", "Va a más cuanto más hago", "No cambia", "No sabría decir")),
    h.q("¿Está mejor con un zapato que tenga algo de tacón? ", "    " + h.choice("Sí", "No", "No lo he notado")),

    // Ap. 3: inestabilidad crónica (se va, miedo), vaina y FHL (crujidos), sinovitis e hinchazón,
    // pinzamiento posterior (bloqueado en punta), osteocondritis disecante (bloqueo, cuerpo libre),
    // sural, túnel del tarso y atrapamientos del talón (síntomas neuropáticos), Morton («pisar una
    // canica»), bursa superficial (bulto detrás del talón que roza).
    h.section("LO QUE NOTA EN EL TOBILLO O EL PIE"),
    h.q("¿Nota alguna de estas cosas?"),
    h.fila("El tobillo le falla o «se le va», o tiene miedo a torcérselo"),
    h.fila("Crujidos o roces al mover el tobillo o el dedo gordo"),
    h.fila("Hinchazón en el tobillo o el pie"),
    h.fila("Se le queda trabado o no llega a estirar la punta"),
    h.fila("Hormigueo, quemazón o descargas en el pie"),
    h.fila("Al caminar, como si pisara una canica bajo los dedos"),
    h.fila("Un bulto detrás del talón que le roza con el zapato"),
    // Ap. 3 y 5: sinovial (seno del tarso, 1.ª MTF: se calienta en <60 min), Aquiles (<60 min), artrosis
    // (<30 min). Una hora o más se pregunta además en persona como bandera (ap. 1: artritis inflamatoria).
    h.q("Por la mañana, ¿está rígido o le duele al levantarse? "),
    h.opts(h.choice("No", "Sí, se me pasa en menos de una hora", "Sí, me dura una hora o más", "No sabría decir")),

    // Ap. 3 y 6: cambios de carga, calzado o terreno; danza (pinzamiento posterior, FHL, base del 2.º MT);
    // saltos y cambios de dirección; carrera (Aquiles, estrés, talón plantar); muchas horas de pie.
    h.section("TRABAJO, DEPORTE Y EJERCICIO"),
    h.q("En el trabajo o en su tiempo libre, ¿hace a menudo alguna de estas cosas? ", " (puede marcar varias)"),
    h.opts(h.choice("Estar muchas horas de pie", "Caminar mucho", "Correr", "Danza", "Deportes con saltos o giros")),
    h.opts(h.choice("Ninguna", "No sabría decir")),
    h.q("Si NO hace deporte ni ejercicio de forma habitual, salte la última pregunta: ha terminado."),
    h.q("En los últimos meses, ¿ha cambiado algo? ", " (puede marcar varias)"),
    h.opts(h.choice("Entreno más días u horas", "Entreno más fuerte", "Empecé o volví hace poco")),
    h.opts(h.choice("Cambié de calzado", "Cambié de terreno o superficie", "No ha cambiado nada", "No sabría decir")),
  ],
  pie: "Hoja 2 de 2 · versión 1 — Preguntas discriminantes: guía clínica de tobillo y pie, ap. 3 (carga y calzado: ap. 6; rigidez: ap. 3 y 5).",
});

generarFormulario(REGION, CONTENIDO);
