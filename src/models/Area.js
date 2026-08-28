class Area {
    constructor({ id_area, nombre_area, descripcion }) {
        this.id_area = id_area;
        this.nombre_area = nombre_area;
        this.descripcion = descripcion;
    }

    validar() {
        const errores = [];

        if (this.id_area === undefined || this.id_area === null) {
            errores.push("El id_area es obligatorio.");
        }

        if (!this.nombre_area || this.nombre_area.trim() === "") {
            errores.push("El nombre del área es obligatorio.");
        }

        if (this.nombre_area && this.nombre_area.length > 50) {
            errores.push("El nombre del área no puede superar los 50 caracteres.");
        }

        return errores;
    }
}

module.exports = Area;