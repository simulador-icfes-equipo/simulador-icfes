class EvaluacionController {

    constructor(evaluacionService) {
        this.evaluacionService = evaluacionService;

        this.iniciar = this.iniciar.bind(this);
        this.obtenerPorId = this.obtenerPorId.bind(this);
        this.obtenerHistorial = this.obtenerHistorial.bind(this);
        this.registrarRespuesta = this.registrarRespuesta.bind(this);
        this.finalizar = this.finalizar.bind(this);
        this.obtenerRankingPorArea =
            this.obtenerRankingPorArea.bind(this);
    }

    // ============================
    // INICIAR EVALUACION
    // ============================

    async iniciar(req, res) {
        try {

            const resultado =
                await this.evaluacionService.iniciar(req.body);

            return res.status(201).json({
                mensaje: "Evaluación iniciada correctamente",
                evaluacion: resultado
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    }

    // ============================
    // OBTENER EVALUACION POR ID
    // ============================

    async obtenerPorId(req, res) {
        try {

            const { id } = req.params;

            const evaluacion =
                await this.evaluacionService.obtenerPorId(id);

            if (!evaluacion) {
                return res.status(404).json({
                    error: "Evaluación no encontrada"
                });
            }

            return res.status(200).json(evaluacion);

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    }

    // ============================
    // HISTORIAL DEL USUARIO
    // ============================

    async obtenerHistorial(req, res) {
        try {

            const { idUsuario } = req.params;

            const historial =
                await this.evaluacionService.obtenerHistorial(
                    idUsuario
                );

            return res.status(200).json(historial);

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    }

    // ============================
    // REGISTRAR RESPUESTA
    // ============================

    async registrarRespuesta(req, res) {
        try {

            const { id } = req.params;

            const resultado =
                await this.evaluacionService.registrarRespuesta(
                    id,
                    req.body
                );

            return res.status(201).json({
                mensaje: "Respuesta registrada correctamente",
                resultado
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    }

    // ============================
    // FINALIZAR EVALUACION
    // ============================

    async finalizar(req, res) {
        try {

            const { id } = req.params;

            const resultado =
                await this.evaluacionService.finalizar(id);

            if (!resultado) {
                return res.status(404).json({
                    error: "Evaluación no encontrada"
                });
            }

            return res.status(200).json({
                mensaje: "Evaluación finalizada correctamente",
                evaluacion: resultado
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    }

    // ============================
    // RANKING POR AREA
    // ============================

    async obtenerRankingPorArea(req, res) {
        try {

            const { idArea } = req.params;

            const ranking =
                await this.evaluacionService.obtenerRankingPorArea(
                    idArea
                );

            return res.status(200).json({
                area: Number(idArea),
                total: ranking.length,
                ranking
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    }

}

module.exports = EvaluacionController;