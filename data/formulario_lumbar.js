// Formulario previo a la primera visita · lumbar
const generarFormulario = require("../tools/plantilla_formularios");

const REGION = "lumbar";

// Cara 2: rama de la región. Piezas disponibles (h): section, q(negrita, resto),
// opts(texto), hint, writeLine, choice(...etiquetas), fila(texto) para tablas
// Sí/No/No sé, run, Paragraph, B, S.
const CONTENIDO = (h) => ({
  titulo: "Sobre su espalda en concreto",
  intro: "Marque lo que mejor describa lo que le pasa. Si duda, marque «No sabría decir».",
  bloques: [
    h.section("DÓNDE NOTA LOS SÍNTOMAS"),
    h.q("Además de la espalda, ¿le baja el dolor por la pierna?"),
    h.opts(h.choice("No, se queda en la espalda", "Hasta la nalga", "Hasta la rodilla")),
    h.opts(h.choice("Por debajo de la rodilla", "Hasta el pie", "No sabría decir")),
    h.opts(`Pierna:   ${h.choice("Derecha", "Izquierda", "Las dos")}`),
    h.q("¿El dolor le cambia de lado de unos días a otros?"),
    h.opts(h.choice("Sí", "No", "No sabría decir")),
    h.q("¿Cómo es ese dolor de pierna, si lo tiene? ", " (puede marcar varias)"),
    h.opts(h.choice("Quemazón", "Como calambres o descargas", "Hormigueo", "Zona dormida")),
    h.opts(h.choice("Distinto a cualquier dolor que haya tenido antes", "No tengo dolor de pierna", "No sabría decir")),
    h.q("¿Ha notado pérdida de fuerza en la pierna, que se le doble o que tropiece?"),
    h.opts(h.choice("Sí", "No", "No sabría decir")),

    h.section("QUÉ LO EMPEORA Y QUÉ LO ALIVIA"),
    h.hint("En cada línea, marque Sí o No. Si duda, marque «No sé»."),
    h.opts(`Al toser, estornudar o hacer fuerza en el baño ______ ${h.B} Sí  ${h.B} No  ${h.B} No sé`),
    h.opts(`Estando sentado un rato ____________________ ${h.B} Sí  ${h.B} No  ${h.B} No sé`),
    h.opts(`Al levantarse de la silla ___________________ ${h.B} Sí  ${h.B} No  ${h.B} No sé`),
    h.opts(`Al agacharse hacia delante _________________ ${h.B} Sí  ${h.B} No  ${h.B} No sé`),
    h.opts(`Al echarse hacia atrás ____________________ ${h.B} Sí  ${h.B} No  ${h.B} No sé`),
    h.opts(`Estando de pie parado un rato ______________ ${h.B} Sí  ${h.B} No  ${h.B} No sé`),
    h.opts(`Caminando ________________________________ ${h.B} Sí  ${h.B} No  ${h.B} No sé`),
    h.q("Si le empeora caminando o de pie, ¿qué hace que se le pase?"),
    h.opts(h.choice("Sentarme", "Inclinarme hacia delante o apoyarme en el carro de la compra")),
    h.opts(h.choice("Basta con pararme quieto de pie", "No se me pasa", "No me pasa esto", "No sabría decir")),
    h.q("¿Aguanta más rato en bicicleta o empujando un carro que caminando normal?"),
    h.opts(h.choice("Sí", "No", "No lo he probado")),
    h.q("¿Hay alguna postura o movimiento que se lo alivie de verdad?"),
    h.opts(`${h.choice("No, nada se lo quita", "No sabría decir")}     ${h.B} Sí: _____________________________________`),
    // [Corrección 3] «¿Cuánto tarda en calmarse…?» trasladada a la cara 1, apartado 3.

    h.section("OTRAS COSAS"),
    h.q("¿Tiene también dolor en la ingle o en la cadera, o le cuesta cruzar las piernas o ponerse los calcetines?"),
    h.opts(h.choice("Sí", "No", "No sabría decir")),
    h.q("¿Está embarazada, o ha dado a luz en el último año?"),
    h.opts(h.choice("Sí", "No", "No procede")),
    h.q("¿Ha tenido alguna vez un golpe fuerte en la pelvis, la espalda o el coxis ", " — una caída, un accidente — o le han operado de la columna?"),
    h.opts(`${h.B} Sí: ______________________________________________________________`),
    h.opts(h.choice("No", "No sabría decir")),
    h.q("¿Hace algún deporte o actividad repetitiva?"),
    h.hint("(cuál, cuántos días por semana, y si ha cambiado algo últimamente)"),
    h.writeLine(),
    h.q("¿Hay algo más que quiera contarme, o algo que le preocupe de este problema?"),
    h.writeLine(), h.writeLine(),
  ],
  pie: "Hoja 2 de 2 · versión lumbar — Preguntas discriminantes: guía clínica lumbar, ap. 3 y 6. Ficha de primera visita: ejes 2 a 6 y bloque 4.",
});

generarFormulario(REGION, CONTENIDO);
