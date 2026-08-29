const express = require("express");
const AreaController = require("../controllers/AreaController");

const router = express.Router();

router.get("/", AreaController.obtenerTodas);
router.get("/:id", AreaController.obtenerPorId);
router.post("/", AreaController.crear);
router.put("/:id", AreaController.actualizar);
router.delete("/:id", AreaController.eliminar);

module.exports = router;