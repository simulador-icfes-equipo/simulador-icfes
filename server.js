require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const BaseDatos = require("./src/db/BaseDatos");

const rutasPreguntas = require("./src/routes/preguntas");
const rutasContextos = require("./src/routes/contextos");

const rutasUsuarios = require("./src/routes/usuarios");
const rutasIntentos = require("./src/routes/intentos");

const app = express();

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
// RUTAS DE INTENTOS
// =========================

app.use(
"/api",
rutasIntentos(db)
);

// =========================
// INICIAR SERVIDOR
// =========================

app.listen(3000, () => {

```
console.log(
    "🚀 Servidor corriendo en http://localhost:3000"
);
```

});
