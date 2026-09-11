class Contexto {


constructor({
    id_contexto = null,
    titulo = null,
    contenido,
    url_imagen = null
}) {

    this.id_contexto = id_contexto;
    this.titulo = titulo;
    this.contenido = contenido;
    this.url_imagen = url_imagen;
}


}

module.exports = Contexto;
