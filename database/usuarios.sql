CREATE DATABASE simulador_icfes;

USE simulador_icfes;


-- =========================
-- TABLA DE ROLES
-- =========================

CREATE TABLE rol (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL
);


-- =========================
-- TABLA DE USUARIOS
-- =========================

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_rol INT NOT NULL,

    FOREIGN KEY (id_rol)
        REFERENCES rol(id_rol)
);


-- =========================
-- TABLA DE PERFILES
-- =========================

CREATE TABLE perfil (
    id_perfil INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    imagen VARCHAR(255),
    avatar VARCHAR(255),

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
);


-- =========================
-- TABLA DE ÁREAS
-- =========================

CREATE TABLE areas (
    id_area INT PRIMARY KEY AUTO_INCREMENT,
    nombre_area VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
);


-- =========================
-- TABLA DE CONTEXTOS
-- =========================

CREATE TABLE contextos (
    id_contexto INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(150),
    contenido TEXT NOT NULL,
    url_imagen VARCHAR(255)
);


-- =========================
-- TABLA DE EXPLICACIONES
-- =========================

CREATE TABLE explicaciones (
    id_explicacion INT PRIMARY KEY AUTO_INCREMENT,
    texto_explicacion TEXT NOT NULL,
    imagen_url VARCHAR(255)
);


-- =========================
-- TABLA DE PREGUNTAS
-- =========================

CREATE TABLE preguntas (
    id_pregunta INT PRIMARY KEY AUTO_INCREMENT,

    id_area INT NOT NULL,
    id_contexto INT,

    enunciado TEXT NOT NULL,

    opcion_a VARCHAR(255) NOT NULL,
    opcion_b VARCHAR(255) NOT NULL,
    opcion_c VARCHAR(255) NOT NULL,
    opcion_d VARCHAR(255) NOT NULL,

    respuesta_correcta CHAR(1) NOT NULL,

    nivel_dificultad ENUM(
        'FACIL',
        'MEDIA',
        'DIFICIL'
    ) NOT NULL,

    id_explicacion INT,

    url_imagen VARCHAR(255),

    FOREIGN KEY (id_area)
        REFERENCES areas(id_area),

    FOREIGN KEY (id_contexto)
        REFERENCES contextos(id_contexto)
        ON DELETE SET NULL,

    FOREIGN KEY (id_explicacion)
        REFERENCES explicaciones(id_explicacion)
        ON DELETE SET NULL
);


-- =========================
-- TABLA DE REPASO
-- =========================

CREATE TABLE repaso (
    id_repaso INT PRIMARY KEY AUTO_INCREMENT,

    id_pregunta INT NOT NULL,

    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    prioridad VARCHAR(50),

    id_usuario INT NOT NULL,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,

    FOREIGN KEY (id_pregunta)
        REFERENCES preguntas(id_pregunta)
        ON DELETE CASCADE
);


-- =========================
-- TABLA DE EVALUACIONES
-- =========================

CREATE TABLE evaluacion (
    id_evaluacion INT PRIMARY KEY AUTO_INCREMENT,

    id_usuario INT NOT NULL,
    id_area INT NOT NULL,

    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    puntaje_obtenido INT DEFAULT 0,

    total_preguntas INT NOT NULL,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,

    FOREIGN KEY (id_area)
        REFERENCES areas(id_area)
);


-- =========================
-- TABLA DETALLE DE EVALUACIÓN
-- =========================

CREATE TABLE detalle_evaluacion (
    id_detalle INT PRIMARY KEY AUTO_INCREMENT,

    id_pregunta INT NOT NULL,
    id_evaluacion INT NOT NULL,

    tiempo_usado TIME,

    respuesta_marcada CHAR(1),

    es_correcta BOOLEAN,

    reportes VARCHAR(255),

    historial VARCHAR(255),

    FOREIGN KEY (id_evaluacion)
        REFERENCES evaluacion(id_evaluacion)
        ON DELETE CASCADE,

    FOREIGN KEY (id_pregunta)
        REFERENCES preguntas(id_pregunta),

    UNIQUE KEY uq_evaluacion_pregunta (id_evaluacion, id_pregunta)
);


-- =========================
-- TABLA DE RANKING
-- =========================

CREATE TABLE ranking (
    id_ranking INT PRIMARY KEY AUTO_INCREMENT,

    id_usuario INT NOT NULL,
    id_area INT NOT NULL,

    mejor_puntaje INT DEFAULT 0,

    total_intentos INT DEFAULT 0,

    ultima_actuacion DATETIME,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,

    FOREIGN KEY (id_area)
        REFERENCES areas(id_area)
);