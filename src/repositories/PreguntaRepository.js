class PreguntaRepository {


constructor(db) {
    this.db = db;
}


async obtenerTodos() {

    const sql = `
        SELECT
            p.id_pregunta,
            p.id_area,
            a.nombre_area,

            p.id_contexto,
            c.titulo AS titulo_contexto,
            c.contenido AS contenido_contexto,
            c.url_imagen AS imagen_contexto,

            p.enunciado,

            p.opcion_a,
            p.opcion_b,
            p.opcion_c,
            p.opcion_d,

            p.respuesta_correcta,
            p.nivel_dificultad,

            p.id_explicacion,
            e.texto_explicacion,
            e.imagen_url AS imagen_explicacion,

            p.url_imagen

        FROM preguntas p

        INNER JOIN areas a
            ON p.id_area = a.id_area

        LEFT JOIN contextos c
            ON p.id_contexto = c.id_contexto

        LEFT JOIN explicaciones e
            ON p.id_explicacion = e.id_explicacion

        ORDER BY p.id_pregunta DESC
    `;

    return await this.db.ejecutar(sql);
}


async obtenerPorId(id) {

    const sql = `
        SELECT
            p.id_pregunta,
            p.id_area,
            a.nombre_area,

            p.id_contexto,
            c.titulo AS titulo_contexto,
            c.contenido AS contenido_contexto,
            c.url_imagen AS imagen_contexto,

            p.enunciado,

            p.opcion_a,
            p.opcion_b,
            p.opcion_c,
            p.opcion_d,

            p.respuesta_correcta,
            p.nivel_dificultad,

            p.id_explicacion,
            e.texto_explicacion,
            e.imagen_url AS imagen_explicacion,

            p.url_imagen

        FROM preguntas p

        INNER JOIN areas a
            ON p.id_area = a.id_area

        LEFT JOIN contextos c
            ON p.id_contexto = c.id_contexto

        LEFT JOIN explicaciones e
            ON p.id_explicacion = e.id_explicacion

        WHERE p.id_pregunta = ?
    `;

    const resultados =
        await this.db.ejecutar(sql, [id]);

    return resultados.length > 0
        ? resultados[0]
        : null;
}


async obtenerPorArea(idArea) {

    const sql = `
        SELECT
            p.id_pregunta,
            p.id_area,
            a.nombre_area,

            p.id_contexto,
            c.titulo AS titulo_contexto,
            c.contenido AS contenido_contexto,
            c.url_imagen AS imagen_contexto,

            p.enunciado,

            p.opcion_a,
            p.opcion_b,
            p.opcion_c,
            p.opcion_d,

            p.respuesta_correcta,
            p.nivel_dificultad,

            p.id_explicacion,
            e.texto_explicacion,
            e.imagen_url AS imagen_explicacion,

            p.url_imagen

        FROM preguntas p

        INNER JOIN areas a
            ON p.id_area = a.id_area

        LEFT JOIN contextos c
            ON p.id_contexto = c.id_contexto

        LEFT JOIN explicaciones e
            ON p.id_explicacion = e.id_explicacion

        WHERE p.id_area = ?

        ORDER BY p.id_pregunta DESC
    `;

    return await this.db.ejecutar(sql, [idArea]);
}


async crear(pregunta) {

    const sql = `
        INSERT INTO preguntas (
            id_area,
            id_contexto,
            enunciado,
            opcion_a,
            opcion_b,
            opcion_c,
            opcion_d,
            respuesta_correcta,
            nivel_dificultad,
            id_explicacion,
            url_imagen
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const parametros = [
        pregunta.id_area,
        pregunta.id_contexto,
        pregunta.enunciado,
        pregunta.opcion_a,
        pregunta.opcion_b,
        pregunta.opcion_c,
        pregunta.opcion_d,
        pregunta.respuesta_correcta,
        pregunta.nivel_dificultad,
        pregunta.id_explicacion,
        pregunta.url_imagen
    ];

    const resultado =
        await this.db.ejecutar(sql, parametros);

    return {
        id_pregunta: resultado.insertId,
        ...pregunta
    };
}


async actualizar(id, pregunta) {

    const sql = `
        UPDATE preguntas
        SET
            id_area = ?,
            id_contexto = ?,
            enunciado = ?,
            opcion_a = ?,
            opcion_b = ?,
            opcion_c = ?,
            opcion_d = ?,
            respuesta_correcta = ?,
            nivel_dificultad = ?,
            id_explicacion = ?,
            url_imagen = ?
        WHERE id_pregunta = ?
    `;

    const parametros = [
        pregunta.id_area,
        pregunta.id_contexto,
        pregunta.enunciado,
        pregunta.opcion_a,
        pregunta.opcion_b,
        pregunta.opcion_c,
        pregunta.opcion_d,
        pregunta.respuesta_correcta,
        pregunta.nivel_dificultad,
        pregunta.id_explicacion,
        pregunta.url_imagen,
        id
    ];

    const resultado =
        await this.db.ejecutar(sql, parametros);

    if (resultado.affectedRows === 0) {
        return null;
    }

    return {
        id_pregunta: Number(id),
        ...pregunta
    };
}


async eliminar(id) {

    const sql = `
        DELETE FROM preguntas
        WHERE id_pregunta = ?
    `;

    const resultado =
        await this.db.ejecutar(sql, [id]);

    return resultado.affectedRows > 0;
}


}

module.exports = PreguntaRepository;
