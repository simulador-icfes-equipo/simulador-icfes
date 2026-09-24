class RepasoRepository {

    constructor(db) {
        this.db = db;
    }

    async agregar(repaso) {
        const sql = `
            INSERT INTO repaso (id_pregunta, id_usuario, prioridad)
            VALUES (?, ?, ?)
        `;

        const resultado = await this.db.ejecutar(sql, [
            repaso.id_pregunta,
            repaso.id_usuario,
            repaso.prioridad
        ]);

        return { id_repaso: resultado.insertId, ...repaso };
    }

    async obtenerPorUsuario(id_usuario) {
        const sql = `
            SELECT
                r.id_repaso,
                r.fecha_agregado,
                r.prioridad,
                p.id_pregunta,
                p.enunciado,
                p.nivel_dificultad,
                a.nombre_area
            FROM repaso r
            INNER JOIN preguntas p ON r.id_pregunta = p.id_pregunta
            INNER JOIN areas a ON p.id_area = a.id_area
            WHERE r.id_usuario = ?
            ORDER BY r.fecha_agregado DESC
        `;

        return await this.db.ejecutar(sql, [id_usuario]);
    }

    async eliminar(id_repaso) {
        const sql = `
            DELETE FROM repaso
            WHERE id_repaso = ?
        `;

        const resultado = await this.db.ejecutar(sql, [id_repaso]);

        return resultado.affectedRows > 0;
    }

}

module.exports = RepasoRepository;