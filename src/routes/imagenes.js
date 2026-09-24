const express = require("express");

const { upload } = require("../config/cloudinary");
const ImagenController = require("../controllers/imagenController");

module.exports = () => {

    const router = express.Router();

    const imagenController = new ImagenController();

    // el campo del form-data debe llamarse "imagen"
    router.post(
        "/imagenes/subir",
        upload.single("imagen"),
        imagenController.subir
    );

    return router;

};