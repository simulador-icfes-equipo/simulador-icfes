class Repaso {

    constructor({
        id_repaso = null,
        id_pregunta,
        id_usuario,
        fecha_agregado = null,
        prioridad = "media"
    }) {
        this.id_repaso = id_repaso;
        this.id_pregunta = id_pregunta;
        this.id_usuario = id_usuario;
        this.fecha_agregado = fecha_agregado;
        this.prioridad = prioridad;
    }

}

module.exports = Repaso;