const express = require('express');

const router = express.Router();

const IntentoController =
    require('../controllers/IntentoController');



router.get(
    '/',
    IntentoController.obtenerIntentos
);


router.get(
    '/:id',
    IntentoController.obtenerIntentoPorId
);


router.post(
    '/',
    IntentoController.crearIntento
);


router.post(
    '/:id/respuestas',
    IntentoController.responderPregunta
);


router.put(
    '/:id/finalizar',
    IntentoController.finalizarIntento
);


router.get(
    '/:id/resultado',
    IntentoController.obtenerResultado
);


module.exports = router;