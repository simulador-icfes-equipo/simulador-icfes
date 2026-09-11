class EvaluacionService {

    constructor(evaluacionRepository) {
        this.evaluacionRepository = evaluacionRepository;
    }

    async iniciar(evaluacion) {
        if (!evaluacion) {
            throw new Error("Los datos de la evaluación son obligatorios.");
        }

        const { id_usuario, id_area, total_preguntas } = evaluacion;

        if (!id_usuario || isNaN(Number(id_usuario))) {
            throw new Error("El id_usuario debe ser un número válido.");
        }

        if (!id_area || isNaN(Number(id_area))) {
            throw new Error("El id_area debe ser un número válido.");
        }

        if (!total_preguntas || isNaN(Number(total_preguntas))) {
            throw new Error("El total_preguntas debe ser un número válido.");
        }

        return await this.evaluacionRepository.crear({
            id_usuario: Number(id_usuario),
            id_area: Number(id_area),
            total_preguntas: Number(total_preguntas)
        });
    }

    async obtenerPorId(id_evaluacion) {
        return await this.evaluacionRepository.obtenerPorId(id_evaluacion);
    }

    async obtenerHistorial(id_usuario) {
        if (!id_usuario || isNaN(Number(id_usuario))) {
            throw new Error("El id_usuario debe ser un número válido.");
        }

        return await this.evaluacionRepository.obtenerHistorialPorUsuario(Number(id_usuario));
    }

    async registrarRespuesta(detalle) {
        if (!detalle) {
            throw new Error("Los datos de la respuesta son obligatorios.");
        }

        const { id_pregunta, id_evaluacion, tiempo_usado, respuesta_marcada, es_correcta } = detalle;

        if (!id_pregunta || isNaN(Number(id_pregunta))) {
            throw new Error("El id_pregunta debe ser un número válido.");
        }

        if (!id_evaluacion || isNaN(Number(id_evaluacion))) {
            throw new Error("El id_evaluacion debe ser un número válido.");
        }

        return await this.evaluacionRepository.registrarRespuesta({
            id_pregunta: Number(id_pregunta),
            id_evaluacion: Number(id_evaluacion),
            tiempo_usado: tiempo_usado || 0,
            respuesta_marcada,
            es_correcta: es_correcta || false
        });
    }

    async obtenerDetalle(id_evaluacion) {
        if (!id_evaluacion || isNaN(Number(id_evaluacion))) {
            throw new Error("El id_evaluacion debe ser un número válido.");
        }

        return await this.evaluacionRepository.obtenerDetallePorEvaluacion(Number(id_evaluacion));
    }

    async finalizar(id_evaluacion, puntaje_obtenido) {
        if (!id_evaluacion || isNaN(Number(id_evaluacion))) {
            throw new Error("El id_evaluacion debe ser un número válido.");
        }

        if (!puntaje_obtenido || isNaN(Number(puntaje_obtenido))) {
            throw new Error("El puntaje_obtenido debe ser un número válido.");
        }

        return await this.evaluacionRepository.actualizarPuntaje(Number(id_evaluacion), Number(puntaje_obtenido));
    }

}

module.exports = EvaluacionService;