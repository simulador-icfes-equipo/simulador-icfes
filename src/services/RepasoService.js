class RepasoService {

    constructor(repasoRepository) {
        this.repasoRepository = repasoRepository;
    }

    async agregar(datos) {
        const { id_pregunta, id_usuario, prioridad } = datos;

        if (!id_pregunta || isNaN(id_pregunta)) {
            throw new Error("Debe indicar una pregunta válida");
        }

        if (!id_usuario || isNaN(id_usuario)) {
            throw new Error("Debe indicar un usuario válido");
        }

        return await this.repasoRepository.agregar({
            id_pregunta: Number(id_pregunta),
            id_usuario: Number(id_usuario),
            prioridad: prioridad || "media"
        });
    }

    async obtenerPorUsuario(id_usuario) {
        if (!id_usuario || isNaN(id_usuario)) {
            throw new Error("El ID del usuario no es válido");
        }

        return await this.repasoRepository.obtenerPorUsuario(id_usuario);
    }

    async eliminar(id_repaso) {
        if (!id_repaso || isNaN(id_repaso)) {
            throw new Error("El ID del repaso no es válido");
        }

        return await this.repasoRepository.eliminar(id_repaso);
    }

}

module.exports = RepasoService;