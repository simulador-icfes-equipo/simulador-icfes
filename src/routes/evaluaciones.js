const express = require("express");

const EvaluacionRepository = require("../repositories/EvaluacionRepository");
const EvaluacionService = require("../services/EvaluacionService");
const EvaluacionController = require("../controllers/EvaluacionController");

module.exports = (db) => {

    const router = express.Router();

    const evaluacionRepository = new EvaluacionRepository(db);
    const evaluacionService = new EvaluacionService(evaluacionRepository);
    const evaluacionController = new EvaluacionController(evaluacionService);

    router.post("/", evaluacionController.iniciar);
    router.get("/usuario/:idUsuario", evaluacionController.obtenerHistorial);
    router.get("/:id", evaluacionController.obtenerPorId);
    router.post("/:id/respuestas", evaluacionController.registrarRespuesta);
    router.put("/:id/finalizar", evaluacionController.finalizar);

    return router;

};
