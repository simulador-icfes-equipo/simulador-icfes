const express = require("express");

const ExplicacionRepository = require("../repositories/ExplicacionRepository");
const ExplicacionService = require("../services/ExplicacionService");
const ExplicacionController = require("../controllers/ExplicacionController");

module.exports = (db) => {

    const router = express.Router();

    const explicacionRepository = new ExplicacionRepository(db);
    const explicacionService = new ExplicacionService(explicacionRepository);
    const explicacionController = new ExplicacionController(explicacionService);

    router.post("/", explicacionController.crear);
    router.get("/:id", explicacionController.obtenerPorId);
    router.put("/:id", explicacionController.actualizar);

    return router;

};