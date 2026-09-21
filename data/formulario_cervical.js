// Formulario previo a la primera visita · cervical
const generarFormulario = require("../tools/plantilla_formularios");

const REGION = "cervical";

// Cara 2: rama de la región. Piezas disponibles (h): section, q(negrita, resto),
// opts(texto), hint, writeLine, choice(...etiquetas), fila(texto) para tablas
// Sí/No/No sé, run, Paragraph, B, S.
const CONTENIDO = (h) => ({
  titulo: "Sobre su cuello en concreto",
  intro: "Marque lo que mejor describa lo que le pasa. Si duda, marque «No sabría decir». Si un apartado no va con usted, páselo.",
  bloques: [
    // Inicio: separa idiopático de latigazo (ap. 3). Va primero porque un accidente cambia la visita (ap. 2, bloque 0).
    h.section("CÓMO EMPEZÓ EN SU CASO"),
    h.q("Si hubo algo que lo desencadenara, ¿qué fue? ", " (puede marcar varias)"),
    h.opts(h.choice("Un accidente de tráfico", "Un golpe haciendo deporte o en su tiempo libre")),
    h.opts(h.choice("Estar mucho rato en una postura, en el trabajo o en casa", "Un giro brusco de la cabeza")),
    h.opts(h.choice("Una actividad poco habitual (por ejemplo, pintar un techo)", "Nada concreto", "No sabría decir")),

    // Radicular / radiculopatía (ap. 3). Sin «hasta dónde»: eje 1, en persona.
    h.section("DOLOR EN EL BRAZO"),
    h.q("¿Le baja el dolor por el brazo al mover el cuello? ", "    " + h.choice("Sí", "No", "No sabría decir")),
    h.q("¿Cómo es ese dolor del brazo, si lo tiene? ", " (puede marcar varias)"),
    h.opts(h.choice("Quemazón", "Como descargas", "Como pinchazos", "Zona dormida")),
    h.opts(h.choice("No tengo dolor en el brazo", "No sabría decir")),
    h.q("¿Le duele el cuello o el brazo al llevar el brazo hacia atrás? ", "    " + h.choice("Sí", "No", "No sabría decir")),
    h.q("¿Ha notado menos fuerza en el brazo? ", "    " + h.choice("Sí", "No", "No sabría decir")),

    // Cefalea: cervicogénica, migraña, tensional, abuso de medicación, ATM (ap. 3).
    h.section("DOLOR DE CABEZA"),
    h.q("Si NO tiene dolores de cabeza, salte este apartado y vaya a MAREO."),
    h.q("¿Tiene también dolores de cabeza? ", "    " + h.choice("Sí", "No", "No sabría decir")),
    h.q("¿Le dan siempre en el mismo lado de la cabeza?"),
    h.opts(h.choice("Sí, siempre en el mismo lado", "No, cambian de lado o son en los dos", "No sabría decir")),
    h.q("¿Le empieza el dolor de cabeza en el cuello? ", "    " + h.choice("Sí", "No", "No sabría decir")),
    h.q("¿Se lo desencadenan ciertos movimientos o posturas del cuello? ", "    " + h.choice("Sí", "No", "No sabría decir")),
    h.q("¿Cómo es? ", "    " + h.choice("Late, como el pulso", "Aprieta, como una cinta", "Ni una cosa ni otra", "No sabría decir")),
    h.q("¿Le empeora al caminar o al subir escaleras? ", "    " + h.choice("Sí", "No", "No sabría decir")),
    h.q("Un rato antes de que empiece, ¿nota hormigueo en el brazo, la lengua o el cuello, o menos fuerza en el brazo?"),
    h.opts(h.choice("Sí", "No", "No sabría decir")),
    h.q("¿Le cuesta abrir la boca, se le desvía la mandíbula al abrirla o le hace ruido?"),
    h.opts(h.choice("Sí", "No", "No sabría decir")),

    // Mareo cervicogénico frente a vestibular; síntomas visuales y de concentración (ap. 3).
    h.section("MAREO"),
    h.q("Si NO nota mareo ni inestabilidad, salte este apartado y vaya a QUÉ LO EMPEORA Y QUÉ LO ALIVIA."),
    h.q("¿Nota mareo o sensación de inestabilidad? ", "    " + h.choice("Sí", "No", "No sabría decir")),
    h.q("¿Cómo es? ", "    " + h.choice("Me siento aturdido o inestable", "Todo me da vueltas", "No sabría decir")),
    h.q("¿Le aumenta cuando le duele más el cuello o al moverlo? ", "    " + h.choice("Sí", "No", "No sabría decir")),
    h.q("¿Le cuesta concentrarse para leer, o se le cansa la vista? ", "    " + h.choice("Sí", "No", "No sabría decir")),

    // Patrón mecánico —postura y movimiento como agravantes— (principios iniciales / ficha idiopático, ap. 5); movimientos rápidos sí es discriminante de ap. 3.
    h.section("QUÉ LO EMPEORA Y QUÉ LO ALIVIA"),
    h.hint("En cada línea, marque Sí o No. Si duda, marque «No sé»."),
    h.fila("Estando mucho rato en la misma postura"),
    h.fila("Al mover el cuello"),
    h.q("¿Se le alivia al cambiar de postura o al moverse?"),
    h.opts(h.choice("Sí", "No, nada lo cambia", "No sabría decir")),
    h.q("¿Le cuesta hacer movimientos rápidos con la cabeza, o mover la cabeza sin mover el cuerpo?"),
    h.opts(h.choice("Sí", "No", "No sabría decir")),
  ],
  pie: "Hoja 2 de 2 · versión cervical — Preguntas discriminantes: guía clínica cervical, ap. 3. Ficha de primera visita: ejes 2 a 6 y bloque 4.",
});

generarFormulario(REGION, CONTENIDO);
