const AreaService = require("../services/AreaService");

const areaService = new AreaService();

class AreaController {

    async obtenerTodas(req, res) {
        try {
            const areas = await areaService.obtenerTodas();

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
    }

    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: "El id_area debe ser un número válido."
                });
            }

            const area = await areaService.obtenerPorId(Number(id));

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
    }

    async crear(req, res) {
        try {
            const { id_area, nombre_area, descripcion } = req.body;

            if (
                id_area === undefined ||
                id_area === null ||
                !nombre_area
            ) {
                return res.status(400).json({
                    success: false,
                    message: "id_area y nombre_area son obligatorios."
                });
            }

            const areaExistente = await areaService.obtenerPorId(
                Number(id_area)
            );

            if (areaExistente) {
                return res.status(400).json({
                    success: false,
                    message: "Ya existe un área con ese id_area."
                });
            }

            const nuevaArea = await areaService.crear({
                id_area: Number(id_area),
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

            return res.status(500).json({
                success: false,
                message: "Error interno del servidor."
            });
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { nombre_area, descripcion } = req.body;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: "El id_area debe ser un número válido."
                });
            }

            if (!nombre_area) {
                return res.status(400).json({
                    success: false,
                    message: "El nombre_area es obligatorio."
                });
            }

            const areaExistente = await areaService.obtenerPorId(
                Number(id)
            );

            if (!areaExistente) {
                return res.status(404).json({
                    success: false,
                    message: "Área no encontrada."
                });
            }

            const areaActualizada = await areaService.actualizar(
                Number(id),
                {
                    nombre_area,
                    descripcion
                }
            );

            return res.status(200).json({
                success: true,
                message: "Área actualizada correctamente.",
                data: areaActualizada
            });

        } catch (error) {
            console.error("Error al actualizar el área:", error);

            return res.status(500).json({
                success: false,
                message: "Error interno del servidor."
            });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: "El id_area debe ser un número válido."
                });
            }

            const eliminado = await areaService.eliminar(Number(id));

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
    }
}

module.exports = new AreaController();