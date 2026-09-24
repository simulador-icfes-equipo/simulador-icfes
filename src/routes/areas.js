const express = require("express");

const AreaRepository = require("../repositories/AreaRepository");
const AreaService = require("../services/AreaService");
const AreaController = require("../controllers/AreaController");

module.exports = (db) => {

    const router = express.Router();

    const areaRepository = new AreaRepository(db);
    const areaService = new AreaService(areaRepository);
    const areaController = new AreaController(areaService);

    router.get("/", areaController.obtenerTodas);
    router.get("/estadisticas", areaController.obtenerEstadisticas);
    router.get("/:id", areaController.obtenerPorId);
    router.post("/", areaController.crear);
    router.put("/:id", areaController.actualizar);
    router.delete("/:id", areaController.eliminar);

    return router;

};
