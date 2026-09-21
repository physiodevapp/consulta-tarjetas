// Formulario previo a la primera visita · hombro
const generarFormulario = require("../tools/plantilla_formularios");

const REGION = "hombro";

// Cara 2: rama de la región. Piezas disponibles (h): section, q(negrita, resto),
// opts(texto), hint, writeLine, choice(...etiquetas), fila(texto) para tablas
// Sí/No/No sé, run, Paragraph, B, S.
const CONTENIDO = (h) => ({
  titulo: "Sobre su hombro en concreto",
  intro: "Marque lo que mejor describa lo que le pasa. Si duda, marque «No sabría decir».",
  bloques: [
    // Ap. 3: SAPS y MR (elevar, debilidad), SLAP y SAPS (por encima de la cabeza), congelado (peinarse,
    // espalda, movimiento brusco), AC (cartera, sujetador, axila contraria), inestabilidad posterior
    // (cargar en flexión, flexión horizontal). Cervicogénico: pregunta aparte, más abajo.
    // Peinarse, espalda, axila y lanzar son también el menú de ③ (ap. 6): se repiten en revisión.
    h.section("QUÉ LE PROVOCA EL DOLOR"),
    h.q("¿Le aparece o le aumenta el dolor al…?"),
    h.fila("Levantar el brazo, por delante o por un lado"),
    h.fila("Hacer cosas con el brazo por encima de la cabeza"),
    h.fila("Peinarse"),
    h.fila("Llevar la mano a la espalda (sujetador, bolsillo)"),
    h.fila("Cruzar el brazo por delante (lavarse la otra axila)"),
    h.fila("Empujar o cargar peso con el brazo por delante"),
    h.fila("Hacer un movimiento rápido o brusco sin esperarlo"),

    // Ap. 3: congelado (dolor que se va convirtiendo en rigidez). Ap. 2, eje «dolor frente a rigidez»;
    // ap. 5 congelado: decide ① (dolor > rigidez) o ② (rigidez > dolor).
    h.section("LO QUE NOTA EN EL HOMBRO"),
    h.q("¿Qué le limita más?"),
    h.opts(h.choice("Sobre todo el dolor", "Sobre todo que el brazo no llega, está rígido", "Las dos cosas por igual")),
    h.opts(h.choice("Empezó con dolor y cada vez está más rígido", "No sabría decir")),
    // Ap. 3: MR y SAPS (debilidad), SLAP (enganche, bloqueo, chasquido),
    // artrosis GH (crepitación), MDI (hormigueos transitorios en el brazo).
    // «Brazo muerto»: ap. 5, ficha del síndrome SLAP («Sospechar si»), no ap. 3.
    h.q("¿Nota alguna de estas cosas?"),
    h.fila("Que le falta fuerza en ese brazo"),
    h.fila("Crujidos o roce al moverlo"),
    h.fila("Que se engancha, se bloquea o da un chasquido"),
    h.fila("Que de golpe el brazo se queda «muerto», sin fuerza"),
    h.fila("Hormigueo en el brazo o la mano que va y viene"),

    // Ap. 3: cervicogénico (dolor que se modifica con el cuello). Árbol, paso 3. Separado de la lista
    // de provocación para no confundirlo con una cervicalgia asociada.
    h.section("EL HOMBRO Y EL CUELLO"),
    h.q("¿El dolor del hombro cambia cuando mueve el cuello? ", " (aunque le duela también el cuello, fíjese solo en el hombro)"),
    h.opts(h.choice("No cambia", "Sí, aumenta", "Sí, disminuye", "No sabría decir")),

    // Ap. 3: inestabilidad anterior (episodio «algo se fue», luxación o subluxación previa,
    // miedo con el brazo en abducción + RE). Ap. 5: muchos no notan que se luxa → miedo para todos.
    h.section("SENSACIÓN DE QUE EL HOMBRO SE SALE"),
    h.q("¿Le da inseguridad o miedo poner el brazo arriba y hacia atrás, como al lanzar?"),
    h.opts(h.choice("No", "Sí", "No sabría decir")),
    h.q("¿Alguna vez se le ha salido el hombro de su sitio, o ha notado que «algo se iba»?"),
    h.opts(h.choice("No", "Sí, y me lo tuvieron que volver a colocar", "Sí, y volvió solo a su sitio", "No sabría decir")),
    h.q("Si en la pregunta anterior ha contestado «No» o «No sabría decir», salte el apartado siguiente."),
    h.section("SI SE LE HA SALIDO"),
    h.q("¿Cuántas veces? ", "  " + h.choice("Una", "Varias", "No sabría decir") + "        ¿Cuándo fue la última? ______________________"),

    // Ap. 3: congelado (diabetes, hipotiroidismo), MDI (laxitud general). Dupuytren: ap. 5 (ficha del
    // hombro congelado), no ap. 3. Lista cerrada porque en «enfermedades importantes» (cara 1) no se suelen apuntar.
    h.section("OTRAS COSAS QUE NOS AYUDAN"),
    h.q("¿Le han dicho alguna vez que tiene…?"),
    h.fila("Diabetes o el azúcar alto"),
    h.fila("Problemas de tiroides"),
    h.fila("Dedos que se le quedan doblados hacia la palma"),
    h.fila("Articulaciones más flexibles de lo normal"),

    // Ap. 3: MDI (natación, gimnasia), SLAP (lanzar). Ap. 5: AC (pesas, natación, lanzamientos, trabajo
    // por encima de la cabeza), SAPS «Ampliar» (aumentos de carga), SLAP ② (velocidad o precisión).
    h.section("TRABAJO, DEPORTE Y EJERCICIO"),
    h.q("En el trabajo o en su tiempo libre, ¿hace a menudo alguna de estas cosas? ", " (puede marcar varias)"),
    h.opts(h.choice("Trabajar con los brazos por encima de la cabeza", "Levantar pesas", "Nadar")),
    h.opts(h.choice("Lanzar", "Gimnasia", "Ninguna", "No sabría decir")),
    h.q("Si NO hace deporte ni ejercicio de forma habitual, salte el resto: ha terminado."),
    h.q("¿Qué deporte o ejercicio hace? "),
    h.writeLine(),
    h.q("En los últimos meses, ¿ha cambiado algo? ", " (puede marcar varias)"),
    h.opts(h.choice("Entreno más días u horas", "Entreno más fuerte o con más peso", "Empecé o volví hace poco")),
    h.opts(h.choice("No ha cambiado nada", "No sabría decir")),
    h.q("Si lanza: desde que le duele, ¿ha perdido velocidad o puntería? ", "    " + h.choice("No", "Sí", "No sabría decir")),
  ],
  pie: "Hoja 2 de 2 · versión 1 — Preguntas discriminantes: guía clínica de hombro, ap. 3 (Dupuytren, trabajo y cambios de carga: ap. 5).",
});

generarFormulario(REGION, CONTENIDO);
