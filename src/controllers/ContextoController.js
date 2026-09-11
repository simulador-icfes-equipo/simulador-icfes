class ContextoController {


constructor(contextoService) {
    this.contextoService = contextoService;
}


async obtenerTodos(req, res) {
    try {

        const contextos =
            await this.contextoService.obtenerTodos();

        return res.status(200).json(contextos);

    } catch (error) {

        console.error("Error al obtener contextos:", error);

        return res.status(500).json({
            mensaje: "Error al obtener los contextos"
        });

    }
}


async obtenerPorId(req, res) {
    try {

        const { id } = req.params;

        const contexto =
            await this.contextoService.obtenerPorId(id);

        if (!contexto) {

            return res.status(404).json({
                mensaje: "Contexto no encontrado"
            });

        }

        return res.status(200).json(contexto);

    } catch (error) {

        console.error("Error al obtener contexto:", error);

        return res.status(500).json({
            mensaje: "Error al obtener el contexto"
        });

    }
}


async crear(req, res) {
    try {

        const nuevoContexto =
            await this.contextoService.crear(req.body);

        return res.status(201).json({
            mensaje: "Contexto creado correctamente",
            datos: nuevoContexto
        });

    } catch (error) {

        console.error("Error al crear contexto:", error);

        return res.status(400).json({
            mensaje: error.message
        });

    }
}


async actualizar(req, res) {
    try {

        const { id } = req.params;

        const contextoActualizado =
            await this.contextoService.actualizar(
                id,
                req.body
            );

        if (!contextoActualizado) {

            return res.status(404).json({
                mensaje: "Contexto no encontrado"
            });

        }

        return res.status(200).json({
            mensaje: "Contexto actualizado correctamente",
            datos: contextoActualizado
        });

    } catch (error) {

        console.error("Error al actualizar contexto:", error);

        return res.status(400).json({
            mensaje: error.message
        });

    }
}


async eliminar(req, res) {
    try {

        const { id } = req.params;

        const eliminado =
            await this.contextoService.eliminar(id);

        if (!eliminado) {

            return res.status(404).json({
                mensaje: "Contexto no encontrado"
            });

        }

        return res.status(200).json({
            mensaje: "Contexto eliminado correctamente"
        });

    } catch (error) {

        console.error("Error al eliminar contexto:", error);

        return res.status(500).json({
            mensaje: "Error al eliminar el contexto"
        });

    }
}


}

module.exports = ContextoController;
