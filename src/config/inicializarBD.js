const mysql = require("mysql2/promise");
const { sequelize, Rol } = require("../models");

// 1) Crea la base de datos si no existe
async function crearBaseDeDatos() {
    const conexion = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    await conexion.query(
        `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
    );
    await conexion.end();
}

// Migra nombres antiguos sin borrar datos cuando se actualiza desde la versión anterior.
async function migrarNombresAnteriores() {
    const [tablasViejas] = await sequelize.query("SHOW TABLES LIKE 'contextos'");
    const [tablasNuevas] = await sequelize.query("SHOW TABLES LIKE 'informacion_compartida'");

    if (tablasViejas.length > 0 && tablasNuevas.length === 0) {
        await sequelize.query("RENAME TABLE contextos TO informacion_compartida");
    }

    const [tablaPreguntas] = await sequelize.query("SHOW TABLES LIKE 'preguntas'");
    if (tablaPreguntas.length > 0) {
        const [columnaVieja] = await sequelize.query("SHOW COLUMNS FROM preguntas LIKE 'id_contexto'");
        const [columnaNueva] = await sequelize.query("SHOW COLUMNS FROM preguntas LIKE 'id_informacion_compartida'");
        if (columnaVieja.length > 0 && columnaNueva.length === 0) {
            await sequelize.query(
                "ALTER TABLE preguntas CHANGE COLUMN id_contexto id_informacion_compartida INT NULL"
            );
        }
    }
}

// 2) Datos iniciales
async function cargarDatosIniciales() {
    await Rol.findOrCreate({ where: { id_rol: 1 }, defaults: { nombre_rol: "admin" } });
    await Rol.findOrCreate({ where: { id_rol: 2 }, defaults: { nombre_rol: "estudiante" } });
    await Rol.findOrCreate({ where: { id_rol: 3 }, defaults: { nombre_rol: "gestor" } });
}

// 3) Trigger, vista, función y procedimiento
async function crearObjetosSQL() {

    await sequelize.query(`DROP TRIGGER IF EXISTS trg_repaso_automatico`);
    await sequelize.query(`
        CREATE TRIGGER trg_repaso_automatico
        AFTER INSERT ON detalle_evaluacion
        FOR EACH ROW
        BEGIN
            DECLARE v_id_usuario INT;
            IF NEW.es_correcta = 0 THEN
                SELECT id_usuario INTO v_id_usuario
                FROM evaluacion
                WHERE id_evaluacion = NEW.id_evaluacion;

                INSERT INTO repaso (id_pregunta, id_usuario, prioridad, fecha_agregado)
                VALUES (NEW.id_pregunta, v_id_usuario, 'media', NOW());
            END IF;
        END
    `);

    // Auditoría automática de INSERT, UPDATE y DELETE sobre preguntas.
    // @id_usuario_auditoria puede establecerse desde una conexión que ejecute la operación.
    await sequelize.query(`DROP TRIGGER IF EXISTS trg_auditoria_pregunta_insert`);
    await sequelize.query(`DROP TRIGGER IF EXISTS trg_auditoria_pregunta_update`);
    await sequelize.query(`DROP TRIGGER IF EXISTS trg_auditoria_pregunta_delete`);

    await sequelize.query(`
        CREATE TRIGGER trg_auditoria_pregunta_insert
        AFTER INSERT ON preguntas
        FOR EACH ROW
        BEGIN
            INSERT INTO auditoria (
                id_usuario_actor, usuario_bd, accion, tabla_afectada, id_registro,
                datos_anteriores, datos_nuevos, fecha_hora
            ) VALUES (
                @id_usuario_auditoria, CURRENT_USER(), 'INSERT', 'preguntas', NEW.id_pregunta,
                NULL,
                JSON_OBJECT(
                    'id_area', NEW.id_area,
                    'id_informacion_compartida', NEW.id_informacion_compartida,
                    'enunciado', NEW.enunciado,
                    'opcion_a', NEW.opcion_a,
                    'opcion_b', NEW.opcion_b,
                    'opcion_c', NEW.opcion_c,
                    'opcion_d', NEW.opcion_d,
                    'respuesta_correcta', NEW.respuesta_correcta,
                    'nivel_dificultad', NEW.nivel_dificultad
                ),
                NOW()
            );
        END
    `);

    await sequelize.query(`
        CREATE TRIGGER trg_auditoria_pregunta_update
        AFTER UPDATE ON preguntas
        FOR EACH ROW
        BEGIN
            INSERT INTO auditoria (
                id_usuario_actor, usuario_bd, accion, tabla_afectada, id_registro,
                datos_anteriores, datos_nuevos, fecha_hora
            ) VALUES (
                @id_usuario_auditoria, CURRENT_USER(), 'UPDATE', 'preguntas', NEW.id_pregunta,
                JSON_OBJECT(
                    'id_area', OLD.id_area,
                    'id_informacion_compartida', OLD.id_informacion_compartida,
                    'enunciado', OLD.enunciado,
                    'opcion_a', OLD.opcion_a,
                    'opcion_b', OLD.opcion_b,
                    'opcion_c', OLD.opcion_c,
                    'opcion_d', OLD.opcion_d,
                    'respuesta_correcta', OLD.respuesta_correcta,
                    'nivel_dificultad', OLD.nivel_dificultad
                ),
                JSON_OBJECT(
                    'id_area', NEW.id_area,
                    'id_informacion_compartida', NEW.id_informacion_compartida,
                    'enunciado', NEW.enunciado,
                    'opcion_a', NEW.opcion_a,
                    'opcion_b', NEW.opcion_b,
                    'opcion_c', NEW.opcion_c,
                    'opcion_d', NEW.opcion_d,
                    'respuesta_correcta', NEW.respuesta_correcta,
                    'nivel_dificultad', NEW.nivel_dificultad
                ),
                NOW()
            );
        END
    `);

    await sequelize.query(`
        CREATE TRIGGER trg_auditoria_pregunta_delete
        AFTER DELETE ON preguntas
        FOR EACH ROW
        BEGIN
            INSERT INTO auditoria (
                id_usuario_actor, usuario_bd, accion, tabla_afectada, id_registro,
                datos_anteriores, datos_nuevos, fecha_hora
            ) VALUES (
                @id_usuario_auditoria, CURRENT_USER(), 'DELETE', 'preguntas', OLD.id_pregunta,
                JSON_OBJECT(
                    'id_area', OLD.id_area,
                    'id_informacion_compartida', OLD.id_informacion_compartida,
                    'enunciado', OLD.enunciado,
                    'opcion_a', OLD.opcion_a,
                    'opcion_b', OLD.opcion_b,
                    'opcion_c', OLD.opcion_c,
                    'opcion_d', OLD.opcion_d,
                    'respuesta_correcta', OLD.respuesta_correcta,
                    'nivel_dificultad', OLD.nivel_dificultad
                ),
                NULL,
                NOW()
            );
        END
    `);

    await sequelize.query(`
        CREATE OR REPLACE VIEW vista_preguntas_completas AS
        SELECT p.id_pregunta, p.enunciado, p.opcion_a, p.opcion_b, p.opcion_c, p.opcion_d,
               p.respuesta_correcta, p.nivel_dificultad, p.url_imagen,
               a.id_area, a.nombre_area,
               c.id_informacion_compartida, c.titulo AS titulo_informacion_compartida, c.contenido AS contenido_informacion_compartida,
               e.id_explicacion, e.texto_explicacion, e.imagen_url AS imagen_explicacion
        FROM preguntas p
        INNER JOIN areas a ON p.id_area = a.id_area
        LEFT JOIN informacion_compartida c ON p.id_informacion_compartida = c.id_informacion_compartida
        LEFT JOIN explicaciones e ON p.id_explicacion = e.id_explicacion
    `);

    await sequelize.query(`DROP FUNCTION IF EXISTS fn_total_preguntas_area`);
    await sequelize.query(`
        CREATE FUNCTION fn_total_preguntas_area(p_id_area INT)
        RETURNS INT
        DETERMINISTIC
        READS SQL DATA
        BEGIN
            DECLARE v_total INT;
            SELECT COUNT(*) INTO v_total FROM preguntas WHERE id_area = p_id_area;
            RETURN v_total;
        END
    `);

    await sequelize.query(`DROP PROCEDURE IF EXISTS sp_crear_pregunta_con_explicacion`);
    await sequelize.query(`
        CREATE PROCEDURE sp_crear_pregunta_con_explicacion(
            IN p_id_area INT, IN p_id_informacion_compartida INT, IN p_enunciado TEXT,
            IN p_opcion_a VARCHAR(255), IN p_opcion_b VARCHAR(255),
            IN p_opcion_c VARCHAR(255), IN p_opcion_d VARCHAR(255),
            IN p_respuesta_correcta CHAR(1), IN p_nivel_dificultad VARCHAR(10),
            IN p_texto_explicacion TEXT
        )
        BEGIN
            DECLARE v_id_explicacion INT;

            INSERT INTO explicaciones (texto_explicacion) VALUES (p_texto_explicacion);
            SET v_id_explicacion = LAST_INSERT_ID();

            INSERT INTO preguntas (id_area, id_informacion_compartida, enunciado, opcion_a, opcion_b,
                opcion_c, opcion_d, respuesta_correcta, nivel_dificultad, id_explicacion)
            VALUES (p_id_area, p_id_informacion_compartida, p_enunciado, p_opcion_a, p_opcion_b,
                p_opcion_c, p_opcion_d, p_respuesta_correcta, p_nivel_dificultad, v_id_explicacion);

            SELECT p.*, e.texto_explicacion
            FROM preguntas p
            INNER JOIN explicaciones e ON p.id_explicacion = e.id_explicacion
            WHERE p.id_pregunta = LAST_INSERT_ID();
        END
    `);
}

module.exports = { crearBaseDeDatos, migrarNombresAnteriores, cargarDatosIniciales, crearObjetosSQL };