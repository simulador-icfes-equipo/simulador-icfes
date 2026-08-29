class ContextoService {


constructor(contextoRepository) {
    this.contextoRepository = contextoRepository;
}


async obtenerTodos() {

    return await this.contextoRepository.obtenerTodos();

}


async obtenerPorId(id) {

    if (!id || isNaN(id)) {
        throw new Error("El ID del contexto no es válido");
    }

    return await this.contextoRepository.obtenerPorId(id);

}


async crear(datos) {

    const {
        titulo,
        contenido,
        url_imagen
    } = datos;


    if (!contenido || contenido.trim() === "") {
        throw new Error(
            "El contenido del contexto es obligatorio"
        );
    }


    const nuevoContexto = {
        titulo: titulo ? titulo.trim() : null,
        contenido: contenido.trim(),
        url_imagen: url_imagen || null
    };


    return await this.contextoRepository.crear(
        nuevoContexto
    );

}


async actualizar(id, datos) {

    if (!id || isNaN(id)) {
        throw new Error("El ID del contexto no es válido");
    }


    const contextoExistente =
        await this.contextoRepository.obtenerPorId(id);


    if (!contextoExistente) {
        return null;
    }


    const {
        titulo,
        contenido,
        url_imagen
    } = datos;


    if (contenido !== undefined) {

        if (
            !contenido ||
            contenido.trim() === ""
        ) {
            throw new Error(
                "El contenido del contexto no puede estar vacío"
            );
        }

    }


    const contextoActualizado = {

        titulo:
            titulo !== undefined
                ? titulo.trim()
                : contextoExistente.titulo,

        contenido:
            contenido !== undefined
                ? contenido.trim()
                : contextoExistente.contenido,

        url_imagen:
            url_imagen !== undefined
                ? url_imagen
                : contextoExistente.url_imagen

    };


    return await this.contextoRepository.actualizar(
        id,
        contextoActualizado
    );

}


async eliminar(id) {

    if (!id || isNaN(id)) {
        throw new Error("El ID del contexto no es válido");
    }


    const contextoExistente =
        await this.contextoRepository.obtenerPorId(id);


    if (!contextoExistente) {
        return false;
    }


    return await this.contextoRepository.eliminar(id);

}


}

module.exports = ContextoService;
