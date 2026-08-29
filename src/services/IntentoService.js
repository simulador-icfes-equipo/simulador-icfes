const IntentoRepository =
    require('../repositories/IntentoRepository');

const IntentoService = {

    obtenerIntentos: async () => {

        return await IntentoRepository.obtenerTodos();
    },


    obtenerIntentoPorId: async (id) => {

        return await IntentoRepository.obtenerPorId(id);
    },


    crearIntento: async (datos) => {

        const { id_usuario } = datos;

        if (!id_usuario) {
            throw new Error(
                'El id_usuario es obligatorio'
            );
        }

        return await IntentoRepository.crear(
            id_usuario
        );
    },


    responderPregunta: async (id_intento, datos) => {

        const {
            id_pregunta,
            id_opcion,
            correcta
        } = datos;

        if (!id_pregunta || !id_opcion) {

            throw new Error(
                'La pregunta y la opción son obligatorias'
            );
        }

        return await IntentoRepository.guardarRespuesta(
            id_intento,
            id_pregunta,
            id_opcion,
            correcta
        );
    },


    finalizarIntento: async (id_intento) => {

        const respuestas =
            await IntentoRepository.obtenerRespuestas(
                id_intento
            );

        const total = respuestas.length;

        const correctas = respuestas.filter(
            respuesta =>
                Number(respuesta.correcta) === 1
        ).length;

        const incorrectas =
            total - correctas;

        let puntaje = 0;

        if (total > 0) {
            puntaje =
                (correctas / total) * 500;
        }

        puntaje =
            Number(puntaje.toFixed(2));

        await IntentoRepository.finalizar(
            id_intento,
            puntaje
        );

        return {
            id_intento: id_intento,
            total_preguntas: total,
            respuestas_correctas: correctas,
            respuestas_incorrectas: incorrectas,
            puntaje: puntaje
        };
    },


    obtenerResultado: async (id_intento) => {

        return await IntentoRepository.obtenerResultado(
            id_intento
        );
    }

};

module.exports = IntentoService;