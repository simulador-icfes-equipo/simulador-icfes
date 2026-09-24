class PerfilController {

    constructor(perfilService) {
        this.perfilService = perfilService;
    }

    obtenerPorUsuario = async (req, res) => {
        try {
            const perfil = await this.perfilService.obtenerPorUsuario(
                req.params.id
            );

            if (!perfil) {
                return res.status(404).json({
                    mensaje: "Perfil no encontrado"
                });
            }

            res.status(200).json(perfil);

        } catch (error) {
            res.status(400).json({
                mensaje: error.message
            });
        }
    };

    crear = async (req, res) => {
        try {
            const perfil = await this.perfilService.crear(
                req.params.id,
                req.body
            );

            res.status(201).json({
                mensaje: "Perfil creado correctamente",
                perfil
            });

        } catch (error) {
            res.status(400).json({
                mensaje: error.message
            });
        }
    };

    actualizar = async (req, res) => {
        try {
            const perfil = await this.perfilService.actualizar(
                req.params.id,
                req.body
            );

            if (!perfil) {
                return res.status(404).json({
                    mensaje: "Perfil no encontrado"
                });
            }

            res.status(200).json({
                mensaje: "Perfil actualizado correctamente",
                perfil
            });

        } catch (error) {
            res.status(400).json({
                mensaje: error.message
            });
        }
    };

    eliminar = async (req, res) => {
        try {
            const eliminado = await this.perfilService.eliminar(
                req.params.id
            );

            if (!eliminado) {
                return res.status(404).json({
                    mensaje: "Perfil no encontrado"
                });
            }

            res.status(200).json({
                mensaje: "Perfil eliminado correctamente"
            });

        } catch (error) {
            res.status(400).json({
                mensaje: error.message
            });
        }
    };
}

module.exports = PerfilController;