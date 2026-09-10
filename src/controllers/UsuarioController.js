class UsuarioController {

    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }

    obtenerTodos = async (req, res) => {
        try {
            const usuarios = await this.usuarioService.obtenerTodos();
            res.status(200).json(usuarios);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            res.status(500).json({
                mensaje: "Error al obtener los usuarios",
                error: error.message
            });
        }
    };

    obtenerPorId = async (req, res) => {
        try {
            const usuario = await this.usuarioService.obtenerPorId(req.params.id);

            if (!usuario) {
                return res.status(404).json({
                    mensaje: "Usuario no encontrado"
                });
            }

            res.status(200).json(usuario);
        } catch (error) {
            console.error("Error al obtener el usuario:", error);
            res.status(400).json({
                mensaje: error.message
            });
        }
    };

    crear = async (req, res) => {
        try {
            const usuario = await this.usuarioService.crear(req.body);

            res.status(201).json({
                mensaje: "Usuario creado correctamente",
                usuario
            });
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            res.status(400).json({
                mensaje: error.message
            });
        }
    };

    actualizar = async (req, res) => {
        try {
            const resultado = await this.usuarioService.actualizar(
                req.params.id,
                req.body
            );

            if (!resultado) {
                return res.status(404).json({
                    mensaje: "Usuario no encontrado"
                });
            }

            res.status(200).json({
                mensaje: "Usuario actualizado correctamente",
                usuario: resultado
            });
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            res.status(400).json({
                mensaje: error.message
            });
        }
    };

    eliminar = async (req, res) => {
        try {
            const eliminado = await this.usuarioService.eliminar(req.params.id);

            if (!eliminado) {
                return res.status(404).json({
                    mensaje: "Usuario no encontrado"
                });
            }

            res.status(200).json({
                mensaje: "Usuario eliminado correctamente"
            });
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            res.status(400).json({
                mensaje: error.message
            });
        }
    };

}

module.exports = UsuarioController;
