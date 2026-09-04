require("dotenv").config()
const express = require("express")
const cors = require("cors")
const path = require("path")

const BaseDatos = require("./src/db/BaseDatos")

const rutasPreguntas = require("./src/routes/preguntas")
const rutasUsuarios = require("./src/routes/usuarios")
const rutasIntentos = require("./src/routes/intentos")
const rutasImagenes = require("./src/routes/imagenes")
const rutasAreas = require("./src/routes/areas");

const app = express()
const db = new BaseDatos()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

app.use("/api/preguntas", rutasPreguntas(db))
app.use("/api", rutasUsuarios(db))
app.use("/api", rutasIntentos(db))
app.use("/api", rutasImagenes())
app.use("/api/areas", rutasAreas);

app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en http://localhost:3000")
})