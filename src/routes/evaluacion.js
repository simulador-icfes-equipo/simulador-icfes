const express = require("express");

const EvaluacionRepository = require("../repositories/EvaluacionRepository");
const EvaluacionService = require("../services/EvaluacionService");
const EvaluacionController = require("../controllers/EvaluacionController");

module.exports = (db) => {

    const router = express.Router();

    const evaluacionRepository = new EvaluacionRepository(db);
    const evaluacionService = new EvaluacionService(evaluacionRepository);
    const evaluacionController = new EvaluacionController(evaluacionService);

    // ============================
    // EVALUACION
    // ============================

    // Iniciar una evaluación
    router.post(
        "/",
        evaluacionController.iniciar
    );

    // Historial de evaluaciones de un usuario
    router.get(
        "/usuario/:idUsuario",
        evaluacionController.obtenerHistorial
    );

    // ============================
    // RANKING
    // ============================

    // Top 10 de usuarios por área
    router.get(
        "/ranking/area/:idArea",
        evaluacionController.obtenerRankingPorArea
    );

    // ============================
    // EVALUACION POR ID
    // ============================

    // Obtener evaluación por ID
    router.get(
        "/:id",
        evaluacionController.obtenerPorId
    );

    // Registrar respuesta
    router.post(
        "/:id/respuestas",
        evaluacionController.registrarRespuesta
    );

    // Finalizar evaluación
    router.put(
        "/:id/finalizar",
        evaluacionController.finalizar
    );

    return router;

};