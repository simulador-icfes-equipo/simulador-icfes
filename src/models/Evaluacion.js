class Evaluacion {

    constructor({
        id_evaluacion = null,
        id_usuario,
        id_area,
        total_preguntas,
        puntaje_obtenido = null,
        estado = "en_curso",
        fecha_inicio = null,
        fecha_fin = null
    }) {
        this.id_evaluacion = id_evaluacion;
        this.id_usuario = id_usuario;
        this.id_area = id_area;
        this.total_preguntas = total_preguntas;
        this.puntaje_obtenido = puntaje_obtenido;
        this.estado = estado;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
    }

}

module.exports = Evaluacion;
