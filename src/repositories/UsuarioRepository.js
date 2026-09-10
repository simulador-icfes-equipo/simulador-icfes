class UsuarioRepository {

    constructor(db) {
        this.db = db;
    }

    async obtenerTodos() {
        const sql = `
            SELECT 
                id_usuario,
                nombre,
                correo,
                fecha_registro,
                id_rol
            FROM usuarios
        `;

        return await this.db.ejecutar(sql);
    }

    async obtenerPorId(id_usuario) {
        const sql = `
            SELECT 
                id_usuario,
                nombre,
                correo,
                fecha_registro,
                id_rol
            FROM usuarios
            WHERE id_usuario = ?
        `;

        const resultados = await this.db.ejecutar(sql, [id_usuario]);

        return resultados.length > 0 ? resultados[0] : null;
    }

    async obtenerPorCorreo(correo) {
        const sql = `
            SELECT *
            FROM usuarios
            WHERE correo = ?
        `;

        const resultados = await this.db.ejecutar(sql, [correo]);

        return resultados.length > 0 ? resultados[0] : null;
    }

    async crear(usuario) {
        const sql = `
            INSERT INTO usuarios
            (nombre, correo, password, fecha_registro, id_rol)
            VALUES (?, ?, ?, NOW(), ?)
        `;

        const resultado = await this.db.ejecutar(sql, [
            usuario.nombre,
            usuario.correo,
            usuario.password,
            usuario.id_rol
        ]);

        return {
            id_usuario: resultado.insertId,
            ...usuario
        };
    }

    async actualizar(id_usuario, usuario) {
        const sql = `
            UPDATE usuarios
            SET nombre = ?,
                correo = ?,
                id_rol = ?
            WHERE id_usuario = ?
        `;

        const resultado = await this.db.ejecutar(sql, [
            usuario.nombre,
            usuario.correo,
            usuario.id_rol,
            id_usuario
        ]);

        if (resultado.affectedRows === 0) {
            return null;
        }

        return await this.obtenerPorId(id_usuario);
    }

    async eliminar(id_usuario) {
        const sql = `
            DELETE FROM usuarios
            WHERE id_usuario = ?
        `;

        const resultado = await this.db.ejecutar(sql, [id_usuario]);

        return resultado.affectedRows > 0;
    }

}

module.exports = UsuarioRepository;
