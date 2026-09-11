class PreguntaController {


constructor(preguntaService) {
    this.preguntaService = preguntaService;
}


async obtenerTodos(req, res) {
    try {

        const preguntas =
            await this.preguntaService.obtenerTodos();

        return res.status(200).json(preguntas);

    } catch (error) {

        console.error("Error al obtener preguntas:", error);

        return res.status(500).json({
            mensaje: "Error al obtener las preguntas"
        });

    }
}


async obtenerPorId(req, res) {
    try {

        const { id } = req.params;

        const pregunta =
            await this.preguntaService.obtenerPorId(id);

        if (!pregunta) {

            return res.status(404).json({
                mensaje: "Pregunta no encontrada"
            });

        }

        return res.status(200).json(pregunta);

    } catch (error) {

        console.error("Error al obtener pregunta:", error);

        return res.status(500).json({
            mensaje: "Error al obtener la pregunta"
        });

    }
}


async obtenerPorArea(req, res) {
    try {

        const { idArea } = req.params;

        const preguntas =
            await this.preguntaService.obtenerPorArea(idArea);

        return res.status(200).json(preguntas);

    } catch (error) {

        console.error(
            "Error al obtener preguntas por área:",
            error
        );

        return res.status(500).json({
            mensaje: "Error al obtener las preguntas del área"
        });

    }
}


async crear(req, res) {
    try {

        const nuevaPregunta =
            await this.preguntaService.crear(req.body);

        return res.status(201).json({
            mensaje: "Pregunta creada correctamente",
            datos: nuevaPregunta
        });

    } catch (error) {

        console.error("Error al crear pregunta:", error);

        return res.status(400).json({
            mensaje: error.message
        });

    }
}


async actualizar(req, res) {
    try {

        const { id } = req.params;

        const preguntaActualizada =
            await this.preguntaService.actualizar(
                id,
                req.body
            );

        if (!preguntaActualizada) {

            return res.status(404).json({
                mensaje: "Pregunta no encontrada"
            });

        }

        return res.status(200).json({
            mensaje: "Pregunta actualizada correctamente",
            datos: preguntaActualizada
        });

    } catch (error) {

        console.error("Error al actualizar pregunta:", error);

        return res.status(400).json({
            mensaje: error.message
        });

    }
}


async eliminar(req, res) {
    try {

        const { id } = req.params;

        const eliminado =
            await this.preguntaService.eliminar(id);

        if (!eliminado) {

            return res.status(404).json({
                mensaje: "Pregunta no encontrada"
            });

        }

        return res.status(200).json({
            mensaje: "Pregunta eliminada correctamente"
        });

    } catch (error) {

        console.error("Error al eliminar pregunta:", error);

        return res.status(500).json({
            mensaje: "Error al eliminar la pregunta"
        });

    }
}


}

module.exports = PreguntaController;
