const express = require("express");
const UsuarioController = require("../controllers/UsuarioController");

const router = express.Router();
const controller = new UsuarioController();

router.get("/", controller.obtenerTodos);

router.get("/:id", controller.obtenerPorId);

router.post("/", controller.crear);

router.put("/:id", controller.actualizar);

router.delete("/:id", controller.eliminar);

module.exports = router;