class EvaluacionService {

    constructor(evaluacionRepository) {
        this.evaluacionRepository = evaluacionRepository;
    }

    async iniciar(datos) {
        const { id_usuario, id_area, total_preguntas } = datos;

        if (!id_usuario || isNaN(id_usuario)) {
            throw new Error("Debe indicar un usuario válido");
        }

        if (!id_area || isNaN(id_area)) {
            throw new Error("Debe indicar un área válida");
        }

        if (!total_preguntas || isNaN(total_preguntas) || total_preguntas <= 0) {
            throw new Error("El total de preguntas debe ser un número mayor a 0");
        }

        return await this.evaluacionRepository.crear({
            id_usuario: Number(id_usuario),
            id_area: Number(id_area),
            total_preguntas: Number(total_preguntas)
        });
    }

    async obtenerPorId(id_evaluacion) {
        if (!id_evaluacion || isNaN(id_evaluacion)) {
            throw new Error("El ID de la evaluación no es válido");
        }

        const evaluacion = await this.evaluacionRepository.obtenerPorId(id_evaluacion);

        if (!evaluacion) {
            return null;
        }

        const detalle = await this.evaluacionRepository.obtenerDetallePorEvaluacion(id_evaluacion);

        return { ...evaluacion, detalle };
    }

    async obtenerHistorial(id_usuario) {
        if (!id_usuario || isNaN(id_usuario)) {
            throw new Error("El ID del usuario no es válido");
        }

        return await this.evaluacionRepository.obtenerHistorialPorUsuario(id_usuario);
    }

    async registrarRespuesta(id_evaluacion, datos) {
        const { id_pregunta, respuesta_marcada, tiempo_usado } = datos;

        if (!id_evaluacion || isNaN(id_evaluacion)) {
            throw new Error("El ID de la evaluación no es válido");
        }

        const evaluacion = await this.evaluacionRepository.obtenerPorId(id_evaluacion);

        if (!evaluacion) {
            throw new Error("La evaluación no existe");
        }

        const respondidas = await this.evaluacionRepository.contarRespuestasRegistradas(id_evaluacion);

        if (respondidas >= evaluacion.total_preguntas) {
            throw new Error("Ya se respondieron todas las preguntas de esta evaluación");
        }

        if (!id_pregunta || isNaN(id_pregunta)) {
            throw new Error("Debe indicar una pregunta válida");
        }

        const yaRespondida = await this.evaluacionRepository.yaRespondioPregunta(
            id_evaluacion,
            id_pregunta
        );

        if (yaRespondida) {
            throw new Error("Esta pregunta ya fue respondida en esta evaluación");
        }

        const respuesta = respuesta_marcada
            ? respuesta_marcada.toUpperCase()
            : "";

        if (!["A", "B", "C", "D"].includes(respuesta)) {
            throw new Error("La respuesta debe ser A, B, C o D");
        }

        const respuestaCorrecta =
            await this.evaluacionRepository.obtenerRespuestaCorrecta(id_pregunta);

        if (!respuestaCorrecta) {
            throw new Error("La pregunta indicada no existe");
        }

        const esCorrecta = respuesta === respuestaCorrecta;

        return await this.evaluacionRepository.registrarRespuesta({
            id_evaluacion: Number(id_evaluacion),
            id_pregunta: Number(id_pregunta),
            respuesta_marcada: respuesta,
            es_correcta: esCorrecta ? 1 : 0,
            tiempo_usado: tiempo_usado || null // formato "HH:MM:SS", opcional
        });
    }

    async finalizar(id_evaluacion) {
        if (!id_evaluacion || isNaN(id_evaluacion)) {
            throw new Error("El ID de la evaluación no es válido");
        }

        const evaluacion = await this.evaluacionRepository.obtenerPorId(id_evaluacion);

        if (!evaluacion) {
            return null;
        }

        const correctas =
            await this.evaluacionRepository.contarRespuestasCorrectas(id_evaluacion);

        const puntaje = Math.round(
            (correctas / evaluacion.total_preguntas) * 100
        );

        return await this.evaluacionRepository.actualizarPuntaje(id_evaluacion, puntaje);
    }

}

module.exports = EvaluacionService;