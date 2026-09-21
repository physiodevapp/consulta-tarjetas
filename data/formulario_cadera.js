// Formulario previo a la primera visita · cadera
const generarFormulario = require("../tools/plantilla_formularios");

const REGION = "cadera";

// Cara 2: rama de la región. Piezas disponibles (h): section, q(negrita, resto),
// opts(texto), hint, writeLine, choice(...etiquetas), fila(texto) para tablas
// Sí/No/No sé, run, Paragraph, B, S.
const CONTENIDO = (h) => ({
  titulo: "Sobre su cadera o ingle en concreto",
  intro: "Marque lo que mejor describa lo que le pasa. Si duda, marque «No sabría decir».",
  bloques: [
    // Ap. 3: intraarticular (agacharse, silla baja, coche, calzarse), artrosis (calzarse, levantarse,
    // caminar), psoas (levantarse), SDTM (lado, piernas cruzadas, una pierna, escaleras),
    // ligamento redondo (abrir la pierna), inguinal (tos, estornudo, abdominales).
    h.section("QUÉ LE PROVOCA EL DOLOR"),
    h.q("¿Le aparece o le aumenta el dolor al…?"),
    h.fila("Agacharse o sentarse en una silla baja"),
    h.fila("Entrar o salir del coche"),
    h.fila("Ponerse los zapatos o los calcetines"),
    h.fila("Levantarse de una silla"),
    h.fila("Caminar"),
    h.fila("Subir o bajar escaleras"),
    h.fila("Tumbarse sobre ese lado"),
    h.fila("Cruzar las piernas"),
    h.fila("Apoyarse en esa pierna sola (al vestirse)"),
    h.fila("Separar mucho la pierna hacia un lado"),
    h.fila("Toser, estornudar o hacer abdominales"),

    // Ap. 3: labrum / intraarticular (chasquido doloroso, enganche, bloqueo), ligamento redondo
    // e inestabilidad (fallo, «clunk»), meralgia parestésica (quemazón u hormigueo en el muslo),
    // artrosis (rigidez matutina de menos de una hora: criterio del ap. 3, sin pregunta propia en la cara 1).
    h.section("LO QUE NOTA EN LA CADERA"),
    h.q("¿Nota alguna de estas cosas?"),
    h.fila("Un chasquido o un clic que le duele"),
    h.fila("Que la cadera se engancha o se bloquea"),
    h.fila("Que la cadera le falla, como si cediera"),
    h.fila("Quemazón, hormigueo o piel dormida en el muslo"),
    h.fila("Rigidez por la mañana que se le pasa en menos de una hora"),

    // Ap. 1 (lesiones del desarrollo) y ap. 6 (antecedentes infantiles). No es del ap. 3.
    h.section("DE PEQUEÑO"),
    h.q("De niño o adolescente, ¿tuvo algún problema en las caderas? ", " (le trataron, llevó férula o arnés, cojeaba, le operaron)"),
    h.opts(h.choice("No", "No sabría decir") + h.S + h.B + " Sí: ___________________________________________"),

    // Ap. 3: extraarticular de larga evolución, lesión aguda, ballet/gimnasia/artes marciales,
    // corredora de fondo. Ap. 1: perfil de fractura de estrés. Ap. 6: frecuencia y cambios de carga.
    h.section("DEPORTE Y EJERCICIO"),
    h.q("Si NO hace deporte ni ejercicio de forma habitual, salte este apartado: ha terminado."),
    h.q("¿Qué deporte o ejercicio hace? "),
    h.writeLine(),
    h.q("¿Cuántos días a la semana? ", "    " + h.choice("1 o 2", "3 o 4", "5 o más", "No sabría decir")),
    h.q("En los últimos meses, ¿ha cambiado algo? ", " (puede marcar varias)"),
    h.opts(h.choice("Entreno más días u horas", "Entreno más fuerte", "Empecé o volví hace poco")),
    h.opts(h.choice("Cambié de superficie o de calzado", "No ha cambiado nada", "No sabría decir")),
    h.q("¿Empezó de golpe haciendo alguno de estos gestos?"),
    h.opts(h.choice("Chutar", "Esprintar", "Cambiar de dirección", "Estirarme", "No", "No sabría decir")),
    h.q("Con el deporte, ¿cuándo le duele? ", " (puede marcar varias)"),
    h.opts(h.choice("Mientras lo hago", "Al acabar", "Al día siguiente, sobre todo por la mañana")),
    h.opts(h.choice("Se me pasa al calentar", "Con descanso mejora, pero vuelve al retomar", "No sabría decir")),
  ],
  pie: "Hoja 2 de 2 · versión 2 — Preguntas discriminantes: guía clínica de cadera e ingle, ap. 3 (deporte y antecedentes: ap. 1 y 6).",
});

generarFormulario(REGION, CONTENIDO);
