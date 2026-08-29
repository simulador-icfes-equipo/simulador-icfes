const BaseDatos = require("../db/BaseDatos");

const db = new BaseDatos();

class AreaService {

    async obtenerTodas() {
        const sql = `
            SELECT id_area, nombre_area, descripcion
            FROM areas
            ORDER BY id_area
        `;

        return await db.ejecutar(sql);
    }

    async obtenerPorId(id_area) {
        const sql = `
            SELECT id_area, nombre_area, descripcion
            FROM areas
            WHERE id_area = ?
        `;

        const resultados = await db.ejecutar(sql, [id_area]);

        if (resultados.length === 0) {
            return null;
        }

        return resultados[0];
    }

    async crear(area) {
        if (!area) {
            throw new Error("Los datos del área son obligatorios.");
        }

        const { id_area, nombre_area, descripcion } = area;

        if (id_area === undefined || id_area === null) {
            throw new Error("El id_area es obligatorio.");
        }

        if (!nombre_area || nombre_area.trim() === "") {
            throw new Error("El nombre del área es obligatorio.");
        }

        if (nombre_area.length > 50) {
            throw new Error(
                "El nombre del área no puede superar los 50 caracteres."
            );
        }

        const sql = `
            INSERT INTO areas (id_area, nombre_area, descripcion)
            VALUES (?, ?, ?)
        `;

        await db.ejecutar(sql, [
            id_area,
            nombre_area.trim(),
            descripcion || null
        ]);

        return await this.obtenerPorId(id_area);
    }

    async actualizar(id_area, area) {
        if (!area) {
            throw new Error("Los datos del área son obligatorios.");
        }

        const { nombre_area, descripcion } = area;

        if (!nombre_area || nombre_area.trim() === "") {
            throw new Error("El nombre del área es obligatorio.");
        }

        if (nombre_area.length > 50) {
            throw new Error(
                "El nombre del área no puede superar los 50 caracteres."
            );
        }

        const sql = `
            UPDATE areas
            SET nombre_area = ?, descripcion = ?
            WHERE id_area = ?
        `;

        const resultado = await db.ejecutar(sql, [
            nombre_area.trim(),
            descripcion || null,
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

        const resultado = await db.ejecutar(sql, [id_area]);

        return resultado.affectedRows > 0;
    }
}

module.exports = AreaService;