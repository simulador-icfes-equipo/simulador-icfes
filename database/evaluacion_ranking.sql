-- =====================================================
-- MODULO DE EVALUACION Y RANKING
-- Sistema Simulador ICFES
-- =====================================================

USE simulador_icfes;


-- =====================================================
-- 1. RESTRICCION UNIQUE
-- Un usuario solo puede tener un registro de ranking
-- por cada area.
-- =====================================================

ALTER TABLE ranking
ADD CONSTRAINT uq_ranking_usuario_area
UNIQUE (id_usuario, id_area);


-- =====================================================
-- 2. TRIGGER PARA ACTUALIZAR EL RANKING
-- Se ejecuta automaticamente cuando cambia
-- el puntaje de una evaluacion.
-- =====================================================

DELIMITER $$

CREATE TRIGGER trg_actualizar_ranking
AFTER UPDATE ON evaluacion
FOR EACH ROW
BEGIN

    IF NEW.puntaje_obtenido <> OLD.puntaje_obtenido THEN

        INSERT INTO ranking (
            id_usuario,
            id_area,
            mejor_puntaje,
            total_intentos,
            ultima_actuacion
        )
        VALUES (
            NEW.id_usuario,
            NEW.id_area,
            NEW.puntaje_obtenido,
            1,
            NOW()
        )

        ON DUPLICATE KEY UPDATE
            mejor_puntaje = GREATEST(
                mejor_puntaje,
                NEW.puntaje_obtenido
            ),
            total_intentos = total_intentos + 1,
            ultima_actuacion = NOW();

    END IF;

END$$

DELIMITER ;


-- =====================================================
-- 3. VISTA GENERAL DEL RANKING
-- Une ranking, usuarios y areas.
-- =====================================================

CREATE OR REPLACE VIEW vista_ranking_general AS

SELECT
    r.id_ranking,
    r.id_usuario,
    u.nombre AS nombre_usuario,
    r.id_area,
    a.nombre_area,
    r.mejor_puntaje,
    r.total_intentos,
    r.ultima_actuacion

FROM ranking r

INNER JOIN usuarios u
    ON r.id_usuario = u.id_usuario

INNER JOIN areas a
    ON r.id_area = a.id_area;