class PreguntaService {


constructor(preguntaRepository) {
    this.preguntaRepository = preguntaRepository;
}


async obtenerTodos() {

    return await this.preguntaRepository.obtenerTodos();

}


async obtenerPorId(id) {

    if (!id || isNaN(id)) {
        throw new Error("El ID de la pregunta no es válido");
    }


    return await this.preguntaRepository.obtenerPorId(id);

}


async obtenerPorArea(idArea) {

    if (!idArea || isNaN(idArea)) {
        throw new Error("El ID del área no es válido");
    }


    return await this.preguntaRepository.obtenerPorArea(
        idArea
    );

}


async crear(datos) {

    const {
        id_area,
        id_contexto,
        enunciado,
        opcion_a,
        opcion_b,
        opcion_c,
        opcion_d,
        respuesta_correcta,
        nivel_dificultad,
        id_explicacion,
        url_imagen
    } = datos;


    if (!id_area || isNaN(id_area)) {
        throw new Error("Debe seleccionar un área válida");
    }


    if (!enunciado || enunciado.trim() === "") {
        throw new Error(
            "El enunciado de la pregunta es obligatorio"
        );
    }


    if (!opcion_a || opcion_a.trim() === "") {
        throw new Error(
            "La opción A es obligatoria"
        );
    }

    if (!opcion_b || opcion_b.trim() === "") {
        throw new Error(
            "La opción B es obligatoria"
        );
    }

    if (!opcion_c || opcion_c.trim() === "") {
        throw new Error(
            "La opción C es obligatoria"
        );
    }

    if (!opcion_d || opcion_d.trim() === "") {
        throw new Error(
            "La opción D es obligatoria"
        );
    }


    const respuesta = respuesta_correcta
        ? respuesta_correcta.toUpperCase()
        : "";


    if (
        !["A", "B", "C", "D"].includes(respuesta)
    ) {
        throw new Error(
            "La respuesta correcta debe ser A, B, C o D"
        );
    }


    const nivelesValidos = [
        "FACIL",
        "MEDIA",
        "DIFICIL"
    ];


    const nivel = nivel_dificultad
        ? nivel_dificultad.toUpperCase()
        : "";


    if (!nivelesValidos.includes(nivel)) {
        throw new Error(
            "El nivel de dificultad debe ser FACIL, MEDIA o DIFICIL"
        );
    }


    const nuevaPregunta = {

        id_area: Number(id_area),

        id_contexto:
            id_contexto
                ? Number(id_contexto)
                : null,

        enunciado:
            enunciado.trim(),

        opcion_a:
            opcion_a.trim(),

        opcion_b:
            opcion_b.trim(),

        opcion_c:
            opcion_c.trim(),

        opcion_d:
            opcion_d.trim(),

        respuesta_correcta:
            respuesta,

        nivel_dificultad:
            nivel,

        id_explicacion:
            id_explicacion
                ? Number(id_explicacion)
                : null,

        url_imagen:
            url_imagen || null

    };


    return await this.preguntaRepository.crear(
        nuevaPregunta
    );

}


async actualizar(id, datos) {

    if (!id || isNaN(id)) {
        throw new Error("El ID de la pregunta no es válido");
    }


    const preguntaExistente =
        await this.preguntaRepository.obtenerPorId(id);


    if (!preguntaExistente) {
        return null;
    }


    const preguntaActualizada = {
        ...preguntaExistente,
        ...datos
    };


    return await this.preguntaRepository.actualizar(
        id,
        preguntaActualizada
    );

}


async eliminar(id) {

    if (!id || isNaN(id)) {
        throw new Error("El ID de la pregunta no es válido");
    }


    const preguntaExistente =
        await this.preguntaRepository.obtenerPorId(id);


    if (!preguntaExistente) {
        return false;
    }


    return await this.preguntaRepository.eliminar(id);

}


}

module.exports = PreguntaService;
