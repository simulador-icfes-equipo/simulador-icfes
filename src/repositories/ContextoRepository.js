class ContextoRepository {


constructor(db) {
    this.db = db;
}


async obtenerTodos() {

    const sql = `
        SELECT
            id_contexto,
            titulo,
            contenido,
            url_imagen
        FROM contextos
        ORDER BY id_contexto DESC
    `;

    return await this.db.ejecutar(sql);
}


async obtenerPorId(id) {

    const sql = `
        SELECT
            id_contexto,
            titulo,
            contenido,
            url_imagen
        FROM contextos
        WHERE id_contexto = ?
    `;

    const resultados = await this.db.ejecutar(sql, [id]);

    return resultados.length > 0
        ? resultados[0]
        : null;
}


async crear(contexto) {

    const sql = `
        INSERT INTO contextos (
            titulo,
            contenido,
            url_imagen
        )
        VALUES (?, ?, ?)
    `;

    const parametros = [
        contexto.titulo,
        contexto.contenido,
        contexto.url_imagen
    ];

    const resultado =
        await this.db.ejecutar(sql, parametros);

    return {
        id_contexto: resultado.insertId,
        ...contexto
    };
}


async actualizar(id, contexto) {

    const sql = `
        UPDATE contextos
        SET
            titulo = ?,
            contenido = ?,
            url_imagen = ?
        WHERE id_contexto = ?
    `;

    const parametros = [
        contexto.titulo,
        contexto.contenido,
        contexto.url_imagen,
        id
    ];

    const resultado =
        await this.db.ejecutar(sql, parametros);

    if (resultado.affectedRows === 0) {
        return null;
    }

    return {
        id_contexto: Number(id),
        ...contexto
    };
}


async eliminar(id) {

    const sql = `
        DELETE FROM contextos
        WHERE id_contexto = ?
    `;

    const resultado =
        await this.db.ejecutar(sql, [id]);

    return resultado.affectedRows > 0;
}


}

module.exports = ContextoRepository;
