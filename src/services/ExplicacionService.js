class ExplicacionService {

    constructor(explicacionRepository) {
        this.explicacionRepository = explicacionRepository;
    }

    async crear(datos) {
        const { texto_explicacion, imagen_url } = datos;

        if (!texto_explicacion || texto_explicacion.trim() === "") {
            throw new Error("El texto de la explicación es obligatorio");
        }

        return await this.explicacionRepository.crear({
            texto_explicacion: texto_explicacion.trim(),
            imagen_url: imagen_url || null
        });
    }

    async obtenerPorId(id_explicacion) {
        if (!id_explicacion || isNaN(id_explicacion)) {
            throw new Error("El ID de la explicación no es válido");
        }

        return await this.explicacionRepository.obtenerPorId(id_explicacion);
    }

    async actualizar(id_explicacion, datos) {
        const { texto_explicacion, imagen_url } = datos;

        if (!texto_explicacion || texto_explicacion.trim() === "") {
            throw new Error("El texto de la explicación es obligatorio");
        }

        return await this.explicacionRepository.actualizar(id_explicacion, {
            texto_explicacion: texto_explicacion.trim(),
            imagen_url: imagen_url || null
        });
    }

}

module.exports = ExplicacionService;