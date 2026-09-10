class EvaluacionController {

    constructor(evaluacionService) {
        this.evaluacionService = evaluacionService;
    }

    iniciar = async (req, res) => {
        try {
            const evaluacion = await this.evaluacionService.iniciar(req.body);

            return res.status(201).json({
                mensaje: "Evaluación iniciada correctamente",
                datos: evaluacion
            });

        } catch (error) {
            console.error("Error al iniciar evaluación:", error);
            return res.status(400).json({ mensaje: error.message });
        }
    };

    obtenerPorId = async (req, res) => {
        try {
            const evaluacion = await this.evaluacionService.obtenerPorId(req.params.id);

            if (!evaluacion) {
                return res.status(404).json({ mensaje: "Evaluación no encontrada" });
            }

            return res.status(200).json(evaluacion);

        } catch (error) {
            console.error("Error al obtener evaluación:", error);
            return res.status(400).json({ mensaje: error.message });
        }
    };

    obtenerHistorial = async (req, res) => {
        try {
            const historial = await this.evaluacionService.obtenerHistorial(
                req.params.idUsuario
            );

            return res.status(200).json(historial);

        } catch (error) {
            console.error("Error al obtener historial:", error);
            return res.status(400).json({ mensaje: error.message });
        }
    };

    registrarRespuesta = async (req, res) => {
        try {
            const detalle = await this.evaluacionService.registrarRespuesta(
                req.params.id,
                req.body
            );

            return res.status(201).json({
                mensaje: "Respuesta registrada correctamente",
                datos: detalle
            });

        } catch (error) {
            console.error("Error al registrar respuesta:", error);
            return res.status(400).json({ mensaje: error.message });
        }
    };

    finalizar = async (req, res) => {
        try {
            const evaluacion = await this.evaluacionService.finalizar(req.params.id);

            if (!evaluacion) {
                return res.status(404).json({ mensaje: "Evaluación no encontrada" });
            }

            return res.status(200).json({
                mensaje: "Evaluación finalizada correctamente",
                datos: evaluacion
            });

        } catch (error) {
            console.error("Error al finalizar evaluación:", error);
            return res.status(400).json({ mensaje: error.message });
        }
    };

}

module.exports = EvaluacionController;
