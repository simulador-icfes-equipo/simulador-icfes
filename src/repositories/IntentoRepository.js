const db = require('../db/BaseDatos');

const IntentoRepository = {

    obtenerTodos: async () => {

        const [filas] = await db.query(
            `SELECT *
             FROM intentos
             ORDER BY id_intento DESC`
        );

        return filas;
    },

    obtenerPorId: async (id) => {

        const [filas] = await db.query(
            `SELECT *
             FROM intentos
             WHERE id_intento = ?`,
            [id]
        );

        return filas[0];
    },

    crear: async (id_usuario) => {

        const [resultado] = await db.query(
            `INSERT INTO intentos
             (id_usuario, estado, puntaje)
             VALUES (?, 'en_progreso', 0)`,
            [id_usuario]
        );

        return {
            id_intento: resultado.insertId,
            id_usuario: id_usuario,
            estado: 'en_progreso',
            puntaje: 0
        };
    },

    guardarRespuesta: async (
        id_intento,
        id_pregunta,
        id_opcion,
        correcta
    ) => {

        const [resultado] = await db.query(
            `INSERT INTO respuestas_intento
             (
                id_intento,
                id_pregunta,
                id_opcion,
                correcta
             )
             VALUES (?, ?, ?, ?)`,
            [
                id_intento,
                id_pregunta,
                id_opcion,
                correcta
            ]
        );

        return {
            id_respuesta: resultado.insertId,
            id_intento: id_intento,
            id_pregunta: id_pregunta,
            id_opcion: id_opcion,
            correcta: correcta
        };
    },

    obtenerRespuestas: async (id_intento) => {

        const [filas] = await db.query(
            `SELECT *
             FROM respuestas_intento
             WHERE id_intento = ?`,
            [id_intento]
        );

        return filas;
    },

    finalizar: async (id_intento, puntaje) => {

        const [resultado] = await db.query(
            `UPDATE intentos
             SET estado = 'finalizado',
                 puntaje = ?,
                 fecha_finalizacion = NOW()
             WHERE id_intento = ?`,
            [
                puntaje,
                id_intento
            ]
        );

        return resultado.affectedRows > 0;
    },

    obtenerResultado: async (id_intento) => {

        const [filas] = await db.query(
            `SELECT
                i.id_intento,
                i.id_usuario,
                i.fecha_inicio,
                i.fecha_finalizacion,
                i.estado,
                i.puntaje,

                COUNT(r.id_respuesta)
                    AS total_respondidas,

                SUM(
                    CASE
                        WHEN r.correcta = 1
                        THEN 1
                        ELSE 0
                    END
                ) AS respuestas_correctas,

                SUM(
                    CASE
                        WHEN r.correcta = 0
                        THEN 1
                        ELSE 0
                    END
                ) AS respuestas_incorrectas

             FROM intentos i

             LEFT JOIN respuestas_intento r
             ON i.id_intento = r.id_intento

             WHERE i.id_intento = ?

             GROUP BY
                i.id_intento,
                i.id_usuario,
                i.fecha_inicio,
                i.fecha_finalizacion,
                i.estado,
                i.puntaje`,
            [id_intento]
        );

        return filas[0];
    }

};

module.exports = IntentoRepository;