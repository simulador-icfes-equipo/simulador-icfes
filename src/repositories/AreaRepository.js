class AreaRepository {

    constructor(db) {
        this.db = db;
    }

    async obtenerTodas() {
        const sql = `
            SELECT id_area, nombre_area, descripcion
            FROM areas
            ORDER BY id_area
        `;

        return await this.db.ejecutar(sql);
    }

    async obtenerPorId(id_area) {
        const sql = `
            SELECT id_area, nombre_area, descripcion
            FROM areas
            WHERE id_area = ?
        `;

        const resultados = await this.db.ejecutar(sql, [id_area]);

        return resultados.length > 0 ? resultados[0] : null;
    }

    async obtenerPorNombre(nombre_area) {
        const sql = `
            SELECT id_area, nombre_area, descripcion
            FROM areas
            WHERE nombre_area = ?
        `;

        const resultados = await this.db.ejecutar(sql, [nombre_area]);

        return resultados.length > 0 ? resultados[0] : null;
    }

    async crear(area) {
        // id_area es AUTO_INCREMENT, no se envía manualmente
        const sql = `
            INSERT INTO areas (nombre_area, descripcion)
            VALUES (?, ?)
        `;

        const resultado = await this.db.ejecutar(sql, [
            area.nombre_area,
            area.descripcion
        ]);

        return await this.obtenerPorId(resultado.insertId);
    }

    async actualizar(id_area, area) {
        const sql = `
            UPDATE areas
            SET nombre_area = ?, descripcion = ?
            WHERE id_area = ?
        `;

        const resultado = await this.db.ejecutar(sql, [
            area.nombre_area,
            area.descripcion,
            id_area
        ]);

        if (resultado.affectedRows === 0) {
            return null;
        }

        return await this.obtenerPorId(id_area);
    }

    async eliminar(id_area) {
        const sql = `
            DELETE FROM areas
            WHERE id_area = ?
        `;

        const resultado = await this.db.ejecutar(sql, [id_area]);

        return resultado.affectedRows > 0;
    }

}

module.exports = AreaRepository;
