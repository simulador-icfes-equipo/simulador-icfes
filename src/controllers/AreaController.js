class AreaController {

    constructor(areaService) {
        this.areaService = areaService;
    }

    obtenerTodas = async (req, res) => {
        try {
            const areas = await this.areaService.obtenerTodas();

            return res.status(200).json({
                success: true,
                data: areas
            });

        } catch (error) {
            console.error("Error al obtener las áreas:", error);

            return res.status(500).json({
                success: false,
                message: "Error interno del servidor."
            });
        }
    };

    obtenerPorId = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: "El id_area debe ser un número válido."
                });
            }

            const area = await this.areaService.obtenerPorId(Number(id));

            if (!area) {
                return res.status(404).json({
                    success: false,
                    message: "Área no encontrada."
                });
            }

            return res.status(200).json({
                success: true,
                data: area
            });

        } catch (error) {
            console.error("Error al obtener el área:", error);

            return res.status(500).json({
                success: false,
                message: "Error interno del servidor."
            });
        }
    };

    crear = async (req, res) => {
        try {
            const { nombre_area, descripcion } = req.body;

            if (!nombre_area) {
                return res.status(400).json({
                    success: false,
                    message: "nombre_area es obligatorio."
                });
            }

            const nuevaArea = await this.areaService.crear({
                nombre_area,
                descripcion
            });

            return res.status(201).json({
                success: true,
                message: "Área creada correctamente.",
                data: nuevaArea
            });

        } catch (error) {
            console.error("Error al crear el área:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    actualizar = async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre_area, descripcion } = req.body;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: "El id_area debe ser un número válido."
                });
            }

            const areaExistente = await this.areaService.obtenerPorId(Number(id));

            if (!areaExistente) {
                return res.status(404).json({
                    success: false,
                    message: "Área no encontrada."
                });
            }

            const areaActualizada = await this.areaService.actualizar(Number(id), {
                nombre_area,
                descripcion
            });

            return res.status(200).json({
                success: true,
                message: "Área actualizada correctamente.",
                data: areaActualizada
            });

        } catch (error) {
            console.error("Error al actualizar el área:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    eliminar = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: "El id_area debe ser un número válido."
                });
            }

            const eliminado = await this.areaService.eliminar(Number(id));

            if (!eliminado) {
                return res.status(404).json({
                    success: false,
                    message: "Área no encontrada."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Área eliminada correctamente."
            });

        } catch (error) {
            console.error("Error al eliminar el área:", error);

            return res.status(500).json({
                success: false,
                message: "Error interno del servidor."
            });
        }
    };

}

module.exports = AreaController;
