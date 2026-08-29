class Intento {

    constructor({
        id_intento = null,
        id_usuario,
        fecha_inicio = null,
        fecha_finalizacion = null,
        estado = 'en_progreso',
        puntaje = 0
    }) {

        this.id_intento = id_intento;
        this.id_usuario = id_usuario;
        this.fecha_inicio = fecha_inicio;
        this.fecha_finalizacion = fecha_finalizacion;
        this.estado = estado;
        this.puntaje = puntaje;
    }
}

module.exports = Intento;