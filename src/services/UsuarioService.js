const UsuarioRepository = require("../repositories/UsuarioRepository");

class UsuarioService {

    constructor() {
        this.repository = new UsuarioRepository();
    }

    async obtenerTodos() {
        return await this.repository.obtenerTodos();
    }

    async obtenerPorId(id_usuario) {
        return await this.repository.obtenerPorId(id_usuario);
    }

    async crear(usuario) {
        return await this.repository.crear(usuario);
    }

    async actualizar(id_usuario, usuario) {
        return await this.repository.actualizar(id_usuario, usuario);
    }

    async eliminar(id_usuario) {
        return await this.repository.eliminar(id_usuario);
    }

}

module.exports = UsuarioService;