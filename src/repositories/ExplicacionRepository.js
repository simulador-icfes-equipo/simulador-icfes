class ExplicacionRepository {

    constructor(db) {
        this.db = db;
    }

    async crear(explicacion) {
        const sql = `
            INSERT INTO explicaciones (texto_explicacion, imagen_url)
            VALUES (?, ?)
        `;

        const resultado = await this.db.ejecutar(sql, [
            explicacion.texto_explicacion,
            explicacion.imagen_url
        ]);

        return await this.obtenerPorId(resultado.insertId);
    }

    async obtenerPorId(id_explicacion) {
        const sql = `
            SELECT * FROM explicaciones
            WHERE id_explicacion = ?
        `;

        const resultados = await this.db.ejecutar(sql, [id_explicacion]);

        return resultados.length > 0 ? resultados[0] : null;
    }

    async actualizar(id_explicacion, explicacion) {
        const sql = `
            UPDATE explicaciones
            SET texto_explicacion = ?, imagen_url = ?
            WHERE id_explicacion = ?
        `;

        const resultado = await this.db.ejecutar(sql, [
            explicacion.texto_explicacion,
            explicacion.imagen_url,
            id_explicacion
        ]);

        if (resultado.affectedRows === 0) {
            return null;
        }

        return await this.obtenerPorId(id_explicacion);
    }

}

module.exports = ExplicacionRepository;