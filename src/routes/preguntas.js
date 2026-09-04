const express = require("express");

const PreguntaRepository = require("../repositories/PreguntaRepository");
const PreguntaService = require("../services/PreguntaService");
const PreguntaController = require("../controllers/PreguntaController");

module.exports = (db) => {


const router = express.Router();

const preguntaRepository = new PreguntaRepository(db);
const preguntaService = new PreguntaService(
    preguntaRepository
);
const preguntaController = new PreguntaController(
    preguntaService
);


router.get(
    "/",
    preguntaController.obtenerTodos.bind(preguntaController)
);


router.get(
    "/area/:idArea",
    preguntaController.obtenerPorArea.bind(preguntaController)
);


router.get(
    "/:id",
    preguntaController.obtenerPorId.bind(preguntaController)
);


router.post(
    "/",
    preguntaController.crear.bind(preguntaController)
);


router.put(
    "/:id",
    preguntaController.actualizar.bind(preguntaController)
);


router.delete(
    "/:id",
    preguntaController.eliminar.bind(preguntaController)
);


return router;


};
