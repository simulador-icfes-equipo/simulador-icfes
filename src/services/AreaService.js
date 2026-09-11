class AreaService {

    constructor(areaRepository) {
        this.areaRepository = areaRepository;
    }

    async obtenerTodas() {
        return await this.areaRepository.obtenerTodas();
    }

    async obtenerPorId(id_area) {
        return await this.areaRepository.obtenerPorId(id_area);
    }

    async crear(area) {
        if (!area) {
            throw new Error("Los datos del área son obligatorios.");
        }

        const { nombre_area, descripcion } = area;

        if (!nombre_area || nombre_area.trim() === "") {
            throw new Error("El nombre del área es obligatorio.");
        }

        if (nombre_area.length > 50) {
            throw new Error(
                "El nombre del área no puede superar los 50 caracteres."
            );
        }

        const existente = await this.areaRepository.obtenerPorNombre(nombre_area.trim());

        if (existente) {
            throw new Error("Ya existe un área con ese nombre.");
        }

        return await this.areaRepository.crear({
            nombre_area: nombre_area.trim(),
            descripcion: descripcion || null
        });
    }

    async actualizar(id_area, area) {
        if (!area) {
            throw new Error("Los datos del área son obligatorios.");
        }

        const { nombre_area, descripcion } = area;

        if (!nombre_area || nombre_area.trim() === "") {
            throw new Error("El nombre del área es obligatorio.");
        }

        if (nombre_area.length > 50) {
            throw new Error(
                "El nombre del área no puede superar los 50 caracteres."
            );
        }

        return await this.areaRepository.actualizar(id_area, {
            nombre_area: nombre_area.trim(),
            descripcion: descripcion || null
        });
    }

    async eliminar(id_area) {
        return await this.areaRepository.eliminar(id_area);
    }

}

module.exports = AreaService;
