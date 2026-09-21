// Formulario previo a la primera visita · rodilla
const generarFormulario = require("../tools/plantilla_formularios");

const REGION = "rodilla";

// Cara 2: rama de la región. Piezas disponibles (h): section, q(negrita, resto),
// opts(texto), hint, writeLine, choice(...etiquetas), fila(texto) para tablas
// Sí/No/No sé, run, Paragraph, B, S.
const CONTENIDO = (h) => ({
  titulo: "Sobre su rodilla en concreto",
  intro: "Marque lo que mejor describa lo que le pasa. Si duda, marque «No sabría decir».",
  bloques: [
    // Ap. 2 y árbol paso 2: primero el mecanismo. La puerta es la hoja 1 («¿Hubo algo concreto que lo
    // desencadenara?»), así no se repite la pregunta. Ap. 3 y árbol paso 4: LCA (pivote, frenar, caer de
    // un salto; chasquido; no pudo seguir; derrame inmediato), LCM (valgo con el pie apoyado), menisco
    // (giro con el pie apoyado; derrame en 6–24 h), LCP (salpicadero, caída sobre la rodilla), LLE/EPL
    // (golpe anteromedial o varo cerca de la extensión), inestabilidad rotuliana (la rótula se salió).
    h.q("Si en la hoja 1 contestó que NO hubo nada concreto que lo desencadenara, salte el apartado siguiente."),
    h.section("SI EMPEZÓ CON UN GOLPE, UNA CAÍDA O UN MAL GESTO"),
    h.q("¿Qué pasó? ", " (puede marcar varias)"),
    h.opts(h.choice("Giré o cambié de dirección con el pie apoyado", "Frené en seco", "Caí mal de un salto")),
    h.opts(h.choice("Me caí de rodillas", "Un golpe por fuera de la rodilla que la metió hacia dentro")),
    h.opts(h.choice("Un golpe justo debajo de la rodilla, por delante, con ella doblada (como contra el salpicadero)")),
    h.opts(h.choice("Un golpe por dentro, o la rodilla se me fue hacia fuera, con la pierna estirada")),
    h.opts(h.choice("Noté que la rótula se salía de su sitio", "Ninguna de estas", "No sabría decir")),
    h.q("¿Oyó o notó un chasquido en ese momento? ", "    " + h.choice("Sí", "No", "No sabría decir")),
    h.q("¿Pudo seguir con lo que estaba haciendo? ", "    " + h.choice("Sí", "No, tuve que parar", "No sabría decir")),
    h.q("¿Se le hinchó la rodilla?"),
    h.opts(h.choice("Sí, enseguida, al poco de pasar", "Sí, horas después: esa noche o a la mañana siguiente")),
    h.opts(h.choice("No se hinchó", "No sabría decir")),

    // Ap. 3: FR (cuclillas, escaleras, arrodillarse, sentado; sin dolor en reposo), menisco (sentado,
    // escaleras, pivotar), LCP (arrodillarse), tendinopatía y apofisitis (saltar, escaleras), osteocondral
    // (impacto), artrosis (caminar, escaleras), cintilla (correr), Hoffa (de pie en hiperextensión).
    // Tibioperonea: pregunta aparte, más abajo. Casi todas son también el menú de ③ (ap. 6).
    h.section("QUÉ LE PROVOCA EL DOLOR"),
    h.q("¿Le aparece o le aumenta el dolor al…?"),
    h.fila("Ponerse en cuclillas"),
    h.fila("Subir o bajar escaleras"),
    h.fila("Arrodillarse"),
    h.fila("Estar mucho rato sentado"),
    h.fila("Caminar"),
    h.fila("Correr"),
    h.fila("Saltar"),
    h.fila("Girar o pivotar sobre esa pierna"),
    h.fila("Estar de pie con la rodilla estirada del todo"),
    h.q("¿Le duele también estando quieto, sin hacer nada? ", "    " + h.choice("Sí", "No", "No sabría decir")),

    // Ap. 3: menisco y osteocondral (bloqueo, enganche), plica (enganche, chasquido, crepitación),
    // artrosis (crepitación, fallo), LLE/EPL (fallo al cargar), inestabilidad rotuliana (se sale, evita
    // pivotar por aprensión), tibioperonea (chasquidos, resaltes), quiste poplíteo (plenitud posterior),
    // columna lumbar (parestesias, quemazón). Bloqueo y enganche descritos por lo que pasa, no por la palabra.
    h.section("LO QUE NOTA EN LA RODILLA"),
    h.q("¿Nota alguna de estas cosas?"),
    h.fila("Se queda trabada y no la puede estirar o doblar"),
    h.fila("Se engancha un momento al moverla y luego sigue"),
    h.fila("Le falla o cede, como si se doblara sola"),
    h.fila("La rótula se le sale de su sitio"),
    h.fila("Evita girar sobre esa pierna por miedo a que falle"),
    // Crujidos (artrosis) y chasquido o resalte (plica, osteocondral, tibioperonea) en una sola fila para
    // que quepa la pregunta del tobillo; la edad (hoja 1) y la exploración los separan.
    h.fila("Crujidos, chasquidos o resaltes al moverla"),
    h.fila("Hinchazón o tirantez por detrás de la rodilla"),
    h.fila("Hormigueo, quemazón o piel dormida en la pierna"),
    // Ap. 3 y ACR/EULAR (ap. 5): rigidez matutina de menos de 30 minutos en artrosis.
    // La hoja 1 ya no trae la pregunta general de rigidez: se pregunta aquí directamente, sin condicional.
    h.q("Por la mañana, ¿está rígido al levantarse? ", "    " + h.choice("No", "Sí, menos de media hora", "Sí, media hora o más", "No sabría decir")),

    // Ap. 3: FR (pico de carga), cintilla (corredor o ciclista; cambios de entrenamiento, calzado o bici),
    // tendinopatía rotuliana (saltar; «calienta» y luego frena el rendimiento), apofisitis (adolescente
    // deportista). Trabajo de rodillas o en cuclillas: ap. 5–6 (menisco degenerativo, bursitis prerrotuliana).
    // Ap. 3: tibioperonea proximal (dolor al mover el tobillo). Separada de la lista de provocación para
    // no confundirla con un tobillo lesionado.
    h.section("LA RODILLA Y EL TOBILLO"),
    h.q("¿Le duele la rodilla al mover el tobillo? ", " (fíjese solo en la rodilla)    " + h.choice("Sí", "No", "No sabría decir")),

    h.section("TRABAJO, DEPORTE Y EJERCICIO"),
    h.q("En el trabajo o en su tiempo libre, ¿hace a menudo alguna de estas cosas? ", " (puede marcar varias)"),
    h.opts(h.choice("Trabajar de rodillas o en cuclillas", "Correr", "Bicicleta", "Deportes con saltos")),
    h.opts(h.choice("Ninguna", "No sabría decir")),
    h.q("Si NO hace deporte ni ejercicio de forma habitual, salte el resto: ha terminado."),
    h.q("En los últimos meses, ¿ha cambiado algo? ", " (puede marcar varias)"),
    h.opts(h.choice("Entreno más días u horas", "Entreno más fuerte", "Empecé o volví hace poco", "Cambié de calzado")),
    h.opts(h.choice("Cambié la posición en la bicicleta", "No ha cambiado nada", "No sabría decir")),
    h.q("Cuando hace deporte, el dolor… ", " (puede marcar varias)"),
    h.opts(h.choice("Se me pasa al calentar", "Acaba obligándome a bajar el ritmo o a parar", "No sabría decir")),
  ],
  pie: "Hoja 2 de 2 · versión 1 — Preguntas discriminantes: guía clínica de rodilla, ap. 3 (trabajo de rodillas: ap. 5–6; rigidez <30 min: ap. 5).",
});

generarFormulario(REGION, CONTENIDO);
