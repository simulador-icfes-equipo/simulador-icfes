class RepasoController {

    constructor(repasoService) {
        this.repasoService = repasoService;
    }

    agregar = async (req, res) => {
        try {
            const repaso = await this.repasoService.agregar(req.body);

            return res.status(201).json({
                mensaje: "Pregunta agregada a repaso correctamente",
                datos: repaso
            });

        } catch (error) {
            console.error("Error al agregar a repaso:", error);
            return res.status(400).json({ mensaje: error.message });
        }
    };

    obtenerPorUsuario = async (req, res) => {
        try {
            const repasos = await this.repasoService.obtenerPorUsuario(
                req.params.idUsuario
            );

            return res.status(200).json(repasos);

        } catch (error) {
            console.error("Error al obtener repaso:", error);
            return res.status(400).json({ mensaje: error.message });
        }
    };

    eliminar = async (req, res) => {
        try {
            const eliminado = await this.repasoService.eliminar(req.params.id);

            if (!eliminado) {
                return res.status(404).json({ mensaje: "Registro de repaso no encontrado" });
            }

            return res.status(200).json({ mensaje: "Eliminado de repaso correctamente" });

        } catch (error) {
            console.error("Error al eliminar de repaso:", error);
            return res.status(400).json({ mensaje: error.message });
        }
    };

}

module.exports = RepasoController;