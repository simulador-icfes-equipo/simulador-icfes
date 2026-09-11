class Pregunta {

constructor({
    id_pregunta = null,
    id_area,
    id_contexto = null,
    enunciado,
    opcion_a,
    opcion_b,
    opcion_c,
    opcion_d,
    respuesta_correcta,
    nivel_dificultad,
    id_explicacion = null,
    url_imagen = null
}) {

    this.id_pregunta = id_pregunta;
    this.id_area = id_area;
    this.id_contexto = id_contexto;

    this.enunciado = enunciado;

    this.opcion_a = opcion_a;
    this.opcion_b = opcion_b;
    this.opcion_c = opcion_c;
    this.opcion_d = opcion_d;

    this.respuesta_correcta = respuesta_correcta;
    this.nivel_dificultad = nivel_dificultad;

    this.id_explicacion = id_explicacion;
    this.url_imagen = url_imagen;
}


}

module.exports = Pregunta;
