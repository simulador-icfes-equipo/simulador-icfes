class Explicacion {

    constructor({
        id_explicacion = null,
        texto_explicacion,
        imagen_url = null
    }) {
        this.id_explicacion = id_explicacion;
        this.texto_explicacion = texto_explicacion;
        this.imagen_url = imagen_url;
    }

}

module.exports = Explicacion;