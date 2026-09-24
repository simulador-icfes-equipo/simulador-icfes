class PerfilService {

    constructor(perfilRepository) {
        this.perfilRepository = perfilRepository;
    }

    async obtenerPorUsuario(id_usuario) {
        if (!id_usuario || isNaN(id_usuario)) {
            throw new Error("El ID del usuario no es válido");
        }

        return await this.perfilRepository.obtenerPorUsuario(id_usuario);
    }

    async crear(id_usuario, datos) {
        if (!id_usuario || isNaN(id_usuario)) {
            throw new Error("El ID del usuario no es válido");
        }

        const existente =
            await this.perfilRepository.obtenerPorUsuario(id_usuario);

        if (existente) {
            throw new Error("El usuario ya tiene un perfil");
        }

        return await this.perfilRepository.crear(
            id_usuario,
            datos.imagen || null,
            datos.avatar || null
        );
    }

    async actualizar(id_usuario, datos) {
        if (!id_usuario || isNaN(id_usuario)) {
            throw new Error("El ID del usuario no es válido");
        }

        return await this.perfilRepository.actualizar(
            id_usuario,
            datos.imagen || null,
            datos.avatar || null
        );
    }

    async eliminar(id_usuario) {
        if (!id_usuario || isNaN(id_usuario)) {
            throw new Error("El ID del usuario no es válido");
        }

        return await this.perfilRepository.eliminar(id_usuario);
    }
}

module.exports = PerfilService;