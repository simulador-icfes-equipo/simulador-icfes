const IntentoService = require('../services/IntentoService');

const IntentoController = {

    // Obtener todos los intentos
    obtenerIntentos: async (req, res) => {
        try {

            const intentos =
                await IntentoService.obtenerIntentos();

            res.status(200).json(intentos);

        } catch (error) {

            console.error(
                'Error al obtener intentos:',
                error
            );

            res.status(500).json({
                mensaje: 'Error al obtener los intentos',
                error: error.message
            });
        }
    },


    // Obtener un intento por ID
    obtenerIntentoPorId: async (req, res) => {
        try {

            const { id } = req.params;

            const intento =
                await IntentoService.obtenerIntentoPorId(id);

            if (!intento) {
                return res.status(404).json({
                    mensaje: 'Intento no encontrado'
                });
            }

            res.status(200).json(intento);

        } catch (error) {

            console.error(
                'Error al obtener intento:',
                error
            );

            res.status(500).json({
                mensaje: 'Error al obtener el intento',
                error: error.message
            });
        }
    },


    // Crear un nuevo intento
    crearIntento: async (req, res) => {
        try {

            const intento =
                await IntentoService.crearIntento(
                    req.body
                );

            res.status(201).json({
                mensaje: 'Intento creado correctamente',
                intento: intento
            });

        } catch (error) {

            console.error(
                'Error al crear intento:',
                error
            );

            res.status(400).json({
                mensaje: 'Error al crear el intento',
                error: error.message
            });
        }
    },


    // Responder una pregunta
    responderPregunta: async (req, res) => {
        try {

            const { id } = req.params;

            const respuesta =
                await IntentoService.responderPregunta(
                    id,
                    req.body
                );

            res.status(201).json({
                mensaje: 'Respuesta guardada correctamente',
                respuesta: respuesta
            });

        } catch (error) {

            console.error(
                'Error al guardar respuesta:',
                error
            );

            res.status(400).json({
                mensaje: 'Error al guardar la respuesta',
                error: error.message
            });
        }
    },


    // Finalizar un intento
    finalizarIntento: async (req, res) => {
        try {

            const { id } = req.params;

            const resultado =
                await IntentoService.finalizarIntento(id);

            res.status(200).json({
                mensaje: 'Intento finalizado correctamente',
                resultado: resultado
            });

        } catch (error) {

            console.error(
                'Error al finalizar intento:',
                error
            );

            res.status(500).json({
                mensaje: 'Error al finalizar el intento',
                error: error.message
            });
        }
    },


    // Consultar resultado del intento
    obtenerResultado: async (req, res) => {
        try {

            const { id } = req.params;

            const resultado =
                await IntentoService.obtenerResultado(id);

            if (!resultado) {
                return res.status(404).json({
                    mensaje: 'Resultado no encontrado'
                });
            }

            res.status(200).json(resultado);

        } catch (error) {

            console.error(
                'Error al consultar resultado:',
                error
            );

            res.status(500).json({
                mensaje: 'Error al consultar el resultado',
                error: error.message
            });
        }
    }
};

module.exports = IntentoController;