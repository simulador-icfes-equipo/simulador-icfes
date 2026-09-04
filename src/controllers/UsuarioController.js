const UsuarioService = require("../services/UsuarioService");

class UsuarioController {

    constructor() {
        this.service = new UsuarioService();
    }

    obtenerTodos = async (req, res) => {
        try {
            const usuarios = await this.service.obtenerTodos();

            res.status(200).json(usuarios);

        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener los usuarios",
                error: error.message
            });
        }
    };

    obtenerPorId = async (req, res) => {
        try {
            const usuario = await this.service.obtenerPorId(
                req.params.id
            );

            if (!usuario) {
                return res.status(404).json({
                    mensaje: "Usuario no encontrado"
                });
            }

            res.status(200).json(usuario);

        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener el usuario",
                error: error.message
            });
        }
    };

    crear = async (req, res) => {
        try {
            const usuario = await this.service.crear(req.body);

            res.status(201).json({
                mensaje: "Usuario creado correctamente",
                usuario
            });

        } catch (error) {
            res.status(500).json({
                mensaje: "Error al crear el usuario",
                error: error.message
            });
        }
    };

    actualizar = async (req, res) => {
        try {
            const resultado = await this.service.actualizar(
                req.params.id,
                req.body
            );

            res.status(200).json({
                mensaje: "Usuario actualizado correctamente",
                resultado
            });

        } catch (error) {
            res.status(500).json({
                mensaje: "Error al actualizar el usuario",
                error: error.message
            });
        }
    };

    eliminar = async (req, res) => {
        try {
            const resultado = await this.service.eliminar(
                req.params.id
            );

            res.status(200).json({
                mensaje: "Usuario eliminado correctamente",
                resultado
            });

        } catch (error) {
            res.status(500).json({
                mensaje: "Error al eliminar el usuario",
                error: error.message
            });
        }
    };

}

module.exports = UsuarioController;