const express = require("express");

const PerfilRepository = require("../repositories/PerfilRepository");
const PerfilService = require("../services/PerfilService");
const PerfilController = require("../controllers/PerfilController");

module.exports = (db) => {

    const router = express.Router();

    const perfilRepository = new PerfilRepository(db);
    const perfilService = new PerfilService(perfilRepository);
    const perfilController = new PerfilController(perfilService);

    router.get("/perfil/:id", perfilController.obtenerPorUsuario);

    router.post("/perfil/:id", perfilController.crear);

    router.put("/perfil/:id", perfilController.actualizar);

    router.delete("/perfil/:id", perfilController.eliminar);

    return router;
};