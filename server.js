require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const BaseDatos = require("./src/db/BaseDatos");

const rutasPreguntas = require("./src/routes/preguntas");
const rutasContextos = require("./src/routes/contextos");
const rutasUsuarios = require("./src/routes/usuarios");
const rutasAreas = require("./src/routes/areas");
const rutasEvaluacion = require("./src/routes/evaluacion");
const rutasImagenes = require("./src/routes/imagenes");
const rutasExplicaciones = require("./src/routes/explicaciones");
const rutasRepaso = require("./src/routes/repaso");
const app = express();

// Instancia única de la base de datos.
// Se inyecta a todos los módulos para que compartan el mismo pool de conexiones.
const db = new BaseDatos();

app.use(cors());

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// =========================
// RUTAS DE PREGUNTAS
// =========================

app.use(
    "/api/preguntas",
    rutasPreguntas(db)
);

// =========================
// RUTAS DE CONTEXTOS
// =========================

app.use(
    "/api/contextos",
    rutasContextos(db)
);

// =========================
// RUTAS DE USUARIOS
// =========================

app.use(
    "/api",
    rutasUsuarios(db)
);

// =========================
// RUTAS DE AREAS
// =========================

app.use(
    "/api/areas",
    rutasAreas(db)
);

// =========================
// RUTAS DE EVALUACION
// =========================

app.use(
    "/api/evaluaciones",
    rutasEvaluacion(db)
);
// =========================
// RUTAS DE IMAGENES
// =========================

app.use(
    "/api",
    rutasImagenes()
);
// =========================
// INICIAR SERVIDOR
// =========================
app.use("/api/explicaciones", rutasExplicaciones(db));
app.use("/api/repaso", rutasRepaso(db));
app.listen(3000, () => {
    console.log(
        "🚀 Servidor corriendo en http://localhost:3000"
    );
});
