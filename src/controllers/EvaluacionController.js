class EvaluacionController {

    constructor(evaluacionService) {
        this.evaluacionService = evaluacionService;
    }

    iniciar = async (req, res) => {
        try {
            const { id_usuario, id_area, total_preguntas } = req.body;

            if (!id_usuario) {
                return res.status(400).json({
                    success: false,
                    message: "id_usuario es obligatorio."
                });
            }

            if (!id_area) {
                return res.status(400).json({
                    success: false,
                    message: "id_area es obligatorio."
                });
            }

            if (!total_preguntas) {
                return res.status(400).json({
                    success: false,
                    message: "total_preguntas es obligatorio."
                });
            }

            const nuevaEvaluacion = await this.evaluacionService.iniciar({
                id_usuario,
                id_area,
                total_preguntas
            });

            return res.status(201).json({
                success: true,
                message: "Evaluación iniciada correctamente.",
                data: nuevaEvaluacion
            });

        } catch (error) {
            console.error("Error al iniciar la evaluación:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    obtenerPorId = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: "El id_evaluacion debe ser un número válido."
                });
            }

            const evaluacion = await this.evaluacionService.obtenerPorId(Number(id));

            if (!evaluacion) {
                return res.status(404).json({
                    success: false,
                    message: "Evaluación no encontrada."
                });
            }

            return res.status(200).json({
                success: true,
                data: evaluacion
            });

        } catch (error) {
            console.error("Error al obtener la evaluación:", error);

            return res.status(500).json({
                success: false,
                message: "Error interno del servidor."
            });
        }
    };

    obtenerHistorial = async (req, res) => {
        try {
            const { idUsuario } = req.params;

            if (!idUsuario || isNaN(Number(idUsuario))) {
                return res.status(400).json({
                    success: false,
                    message: "El idUsuario debe ser un número válido."
                });
            }

            const historial = await this.evaluacionService.obtenerHistorial(Number(idUsuario));

            return res.status(200).json({
                success: true,
                data: historial
            });

        } catch (error) {
            console.error("Error al obtener el historial de evaluaciones:", error);

            return res.status(500).json({
                success: false,
                message: "Error interno del servidor."
            });
        }
    };

    registrarRespuesta = async (req, res) => {
        try {
            const { id } = req.params;
            const { id_pregunta, tiempo_usado, respuesta_marcada, es_correcta } = req.body;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: "El id_evaluacion debe ser un número válido."
                });
            }

            if (!id_pregunta) {
                return res.status(400).json({
                    success: false,
                    message: "id_pregunta es obligatorio."
                });
            }

            const respuesta = await this.evaluacionService.registrarRespuesta({
                id_pregunta,
                id_evaluacion: Number(id),
                tiempo_usado,
                respuesta_marcada,
                es_correcta
            });

            return res.status(201).json({
                success: true,
                message: "Respuesta registrada correctamente.",
                data: respuesta
            });

        } catch (error) {
            console.error("Error al registrar la respuesta:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    finalizar = async (req, res) => {
        try {
            const { id } = req.params;
            const { puntaje_obtenido } = req.body;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: "El id_evaluacion debe ser un número válido."
                });
            }

            if (!puntaje_obtenido) {
                return res.status(400).json({
                    success: false,
                    message: "puntaje_obtenido es obligatorio."
                });
            }

            const evaluacionFinalizada = await this.evaluacionService.finalizar(Number(id), puntaje_obtenido);

            if (!evaluacionFinalizada) {
                return res.status(404).json({
                    success: false,
                    message: "Evaluación no encontrada."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Evaluación finalizada correctamente.",
                data: evaluacionFinalizada
            });

        } catch (error) {
            console.error("Error al finalizar la evaluación:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

}

module.exports = EvaluacionController;