class ExplicacionController {

    constructor(explicacionService) {
        this.explicacionService = explicacionService;
    }

    crear = async (req, res) => {
        try {
            const explicacion = await this.explicacionService.crear(req.body);

            return res.status(201).json({
                mensaje: "Explicación creada correctamente. Usa su id_explicacion para asociarla a una pregunta.",
                datos: explicacion
            });

        } catch (error) {
            console.error("Error al crear explicación:", error);
            return res.status(400).json({ mensaje: error.message });
        }
    };

    obtenerPorId = async (req, res) => {
        try {
            const explicacion = await this.explicacionService.obtenerPorId(req.params.id);

            if (!explicacion) {
                return res.status(404).json({ mensaje: "Explicación no encontrada" });
            }

            return res.status(200).json(explicacion);

        } catch (error) {
            console.error("Error al obtener explicación:", error);
            return res.status(400).json({ mensaje: error.message });
        }
    };

    actualizar = async (req, res) => {
        try {
            const explicacion = await this.explicacionService.actualizar(
                req.params.id,
                req.body
            );

            if (!explicacion) {
                return res.status(404).json({ mensaje: "Explicación no encontrada" });
            }

            return res.status(200).json({
                mensaje: "Explicación actualizada correctamente",
                datos: explicacion
            });

        } catch (error) {
            console.error("Error al actualizar explicación:", error);
            return res.status(400).json({ mensaje: error.message });
        }
    };

}

module.exports = ExplicacionController;