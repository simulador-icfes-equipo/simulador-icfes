const BaseDatos = require("../db/BaseDatos");

class UsuarioRepository {

    constructor() {
        this.db = new BaseDatos();
    }

    async obtenerTodos() {
        const sql = `
            SELECT 
                id_usuario,
                nombre,
                correo,
                password,
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
                password,
                fecha_registro,
                id_rol
            FROM usuarios
            WHERE id_usuario = ?
        `;

        const resultados = await this.db.ejecutar(sql, [id_usuario]);

        return resultados[0];
    }

    async crear(usuario) {
        const sql = `
            INSERT INTO usuarios
            (id_usuario, nombre, correo, password, fecha_registro, id_rol)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        return await this.db.ejecutar(sql, [
            usuario.id_usuario,
            usuario.nombre,
            usuario.correo,
            usuario.password,
            usuario.fecha_registro,
            usuario.id_rol
        ]);
    }

    async actualizar(id_usuario, usuario) {
        const sql = `
            UPDATE usuarios
            SET nombre = ?,
                correo = ?,
                password = ?,
                id_rol = ?
            WHERE id_usuario = ?
        `;

        return await this.db.ejecutar(sql, [
            usuario.nombre,
            usuario.correo,
            usuario.password,
            usuario.id_rol,
            id_usuario
        ]);
    }

    async eliminar(id_usuario) {
        const sql = `
            DELETE FROM usuarios
            WHERE id_usuario = ?
        `;

        return await this.db.ejecutar(sql, [id_usuario]);
    }

}

module.exports = UsuarioRepository;