const express = require("express");

const UsuarioRepository = require("../repositories/UsuarioRepository");
const UsuarioService = require("../services/UsuarioService");
const UsuarioController = require("../controllers/UsuarioController");

module.exports = (db) => {

    const router = express.Router();

    const usuarioRepository = new UsuarioRepository(db);
    const usuarioService = new UsuarioService(usuarioRepository);
    const usuarioController = new UsuarioController(usuarioService);

    router.get("/usuarios", usuarioController.obtenerTodos);
    router.post("/login", usuarioController.login);
    router.get("/usuarios/:id", usuarioController.obtenerPorId);
    router.post("/usuarios", usuarioController.crear);
    router.put("/usuarios/:id", usuarioController.actualizar);
    router.delete("/usuarios/:id", usuarioController.eliminar);

    return router;

};
