class PerfilRepository {

    constructor(db) {
        this.db = db;
    }

    async obtenerPorUsuario(id_usuario) {
        const sql = `
            SELECT
                id_perfil,
                id_usuario,
                imagen,
                avatar
            FROM perfil
            WHERE id_usuario = ?
        `;

        const resultados = await this.db.ejecutar(sql, [id_usuario]);

        return resultados.length > 0 ? resultados[0] : null;
    }

    async crear(id_usuario, imagen = null, avatar = null) {
        const sql = `
            INSERT INTO perfil
            (id_usuario, imagen, avatar)
            VALUES (?, ?, ?)
        `;

        const resultado = await this.db.ejecutar(sql, [
            id_usuario,
            imagen,
            avatar
        ]);

        return {
            id_perfil: resultado.insertId,
            id_usuario,
            imagen,
            avatar
        };
    }

    async actualizar(id_usuario, imagen, avatar) {
        const sql = `
            UPDATE perfil
            SET imagen = ?,
                avatar = ?
            WHERE id_usuario = ?
        `;

        const resultado = await this.db.ejecutar(sql, [
            imagen,
            avatar,
            id_usuario
        ]);

        if (resultado.affectedRows === 0) {
            return null;
        }

        return await this.obtenerPorUsuario(id_usuario);
    }

    async eliminar(id_usuario) {
        const sql = `
            DELETE FROM perfil
            WHERE id_usuario = ?
        `;

        const resultado = await this.db.ejecutar(sql, [id_usuario]);

        return resultado.affectedRows > 0;
    }
}

module.exports = PerfilRepository;