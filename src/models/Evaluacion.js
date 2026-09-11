class Evaluacion {
    constructor({ id_evaluacion, id_usuario, id_area, total_preguntas, puntaje_obtenido, fecha }) {
        this.id_evaluacion = id_evaluacion;
        this.id_usuario = id_usuario;
        this.id_area = id_area;
        this.total_preguntas = total_preguntas;
        this.puntaje_obtenido = puntaje_obtenido;
        this.fecha = fecha;
    }

    validar() {
        const errores = [];

        if (!this.id_usuario || isNaN(Number(this.id_usuario))) {
            errores.push("El id_usuario debe ser un número válido.");
        }

        if (!this.id_area || isNaN(Number(this.id_area))) {
            errores.push("El id_area debe ser un número válido.");
        }

        if (!this.total_preguntas || isNaN(Number(this.total_preguntas))) {
            errores.push("El total_preguntas debe ser un número válido.");
        }

        return errores;
    }
}

module.exports = Evaluacion;