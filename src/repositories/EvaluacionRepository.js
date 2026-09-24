class EvaluacionRepository {

    constructor(db) {
        this.db = db;
    }

    async crear(evaluacion) {
        const sql = `
            INSERT INTO evaluacion (id_usuario, id_area, total_preguntas)
            VALUES (?, ?, ?)
        `;

        const resultado = await this.db.ejecutar(sql, [
            evaluacion.id_usuario,
            evaluacion.id_area,
            evaluacion.total_preguntas
        ]);

        return await this.obtenerPorId(resultado.insertId);
    }

    async obtenerPorId(id_evaluacion) {
        const sql = `
            SELECT *
            FROM evaluacion
            WHERE id_evaluacion = ?
        `;

        const resultados = await this.db.ejecutar(sql, [id_evaluacion]);

        return resultados.length > 0 ? resultados[0] : null;
    }

    async obtenerHistorialPorUsuario(id_usuario) {
        const sql = `
            SELECT e.*, a.nombre_area
            FROM evaluacion e
            INNER JOIN areas a ON e.id_area = a.id_area
            WHERE e.id_usuario = ?
            ORDER BY e.fecha DESC
        `;

        return await this.db.ejecutar(sql, [id_usuario]);
    }

    async actualizarPuntaje(id_evaluacion, puntaje_obtenido) {
        const sql = `
            UPDATE evaluacion
            SET puntaje_obtenido = ?
            WHERE id_evaluacion = ?
        `;

        const resultado = await this.db.ejecutar(sql, [
            puntaje_obtenido,
            id_evaluacion
        ]);

        if (resultado.affectedRows === 0) {
            return null;
        }

        return await this.obtenerPorId(id_evaluacion);
    }

    // ---- detalle_evaluacion ----

    async registrarRespuesta(detalle) {
        const sql = `
            INSERT INTO detalle_evaluacion (
                id_pregunta, id_evaluacion, tiempo_usado, respuesta_marcada, es_correcta
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const resultado = await this.db.ejecutar(sql, [
            detalle.id_pregunta,
            detalle.id_evaluacion,
            detalle.tiempo_usado,
            detalle.respuesta_marcada,
            detalle.es_correcta
        ]);

        return {
            id_detalle: resultado.insertId,
            ...detalle
        };
    }

    async obtenerDetallePorEvaluacion(id_evaluacion) {
        const sql = `
            SELECT
                d.id_detalle,
                d.id_pregunta,
                d.tiempo_usado,
                d.respuesta_marcada,
                d.es_correcta,
                p.enunciado,
                p.respuesta_correcta
            FROM detalle_evaluacion d
            INNER JOIN preguntas p ON d.id_pregunta = p.id_pregunta
            WHERE d.id_evaluacion = ?
        `;

        return await this.db.ejecutar(sql, [id_evaluacion]);
    }

    async contarRespuestasRegistradas(id_evaluacion) {
        const sql = `
            SELECT COUNT(*) AS total
            FROM detalle_evaluacion
            WHERE id_evaluacion = ?
        `;

        const resultados = await this.db.ejecutar(sql, [id_evaluacion]);

        return resultados[0].total;
    }

    async contarRespuestasCorrectas(id_evaluacion) {
        const sql = `
            SELECT COUNT(*) AS total_correctas
            FROM detalle_evaluacion
            WHERE id_evaluacion = ? AND es_correcta = 1
        `;

        const resultados = await this.db.ejecutar(sql, [id_evaluacion]);

        return resultados[0].total_correctas;
    }

    async yaRespondioPregunta(id_evaluacion, id_pregunta) {
        const sql = `
            SELECT id_detalle
            FROM detalle_evaluacion
            WHERE id_evaluacion = ? AND id_pregunta = ?
        `;

        const resultados = await this.db.ejecutar(sql, [id_evaluacion, id_pregunta]);

        return resultados.length > 0;
    }

    // ---- apoyo: validar respuesta correcta contra preguntas ----

    async obtenerRespuestaCorrecta(id_pregunta) {
        const sql = `
            SELECT respuesta_correcta
            FROM preguntas
            WHERE id_pregunta = ?
        `;

        const resultados = await this.db.ejecutar(sql, [id_pregunta]);

        return resultados.length > 0
            ? resultados[0].respuesta_correcta
            : null;
    }

}

module.exports = EvaluacionRepository;
