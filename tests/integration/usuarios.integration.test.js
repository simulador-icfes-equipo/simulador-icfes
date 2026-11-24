// PRUEBA DE INTEGRACIÓN - Módulo de usuarios
// Componentes REALES: Router de Express + middlewares JWT + UsuarioController + UsuarioService
//                     + UsuarioRepository + modelos Sequelize + base de datos MySQL de pruebas.
// No se mockea nada: se valida el flujo completo registro -> login -> consulta protegida.
const request = require("supertest");
const express = require("express");

const { sequelize, Usuario } = require("../../src/models");
const { crearBaseDeDatos, cargarDatosIniciales } = require("../../src/config/inicializarBD");
const rutasUsuarios = require("../../src/routes/usuarios");

const correoPrueba = `integracion_${Date.now()}@test.com`;
let app;

beforeAll(async () => {
    await crearBaseDeDatos();          // CREATE DATABASE IF NOT EXISTS simulador_icfes_test
    await sequelize.authenticate();
    await sequelize.sync();            // crea las tablas si no existen
    await cargarDatosIniciales();      // roles: 1 admin, 2 estudiante, 3 gestor

    app = express();
    app.use(express.json());
    app.use("/api", rutasUsuarios());
});

afterAll(async () => {
    await Usuario.destroy({ where: { correo: correoPrueba } });
    await sequelize.close();
});

describe("Integración - usuarios (Router + Controller + Service + Repository + MySQL)", () => {
    it("registra, inicia sesión y consulta datos protegidos respetando los permisos", async () => {
        // 1) Registro público: aunque se intente enviar id_rol = 1 (admin), el router fuerza el rol estudiante
        const registro = await request(app)
            .post("/api/registro")
            .send({ nombre: "Ana Prueba", correo: correoPrueba, password: "secreto123", id_rol: 1 });

        expect(registro.status).toBe(201);
        expect(registro.body.usuario.password).toBeUndefined();
        expect(registro.body.usuario.id_rol).toBe(2);

        // 2) Verificación directa en la BD: el usuario existe y la contraseña quedó encriptada
        const enBD = await Usuario.findOne({ where: { correo: correoPrueba } });
        expect(enBD).not.toBeNull();
        expect(enBD.password).not.toBe("secreto123");
        expect(enBD.password).toMatch(/^\$2[aby]\$/); // formato bcrypt

        // 3) Registrar el mismo correo otra vez debe fallar (regla de negocio + consulta real a la BD)
        const duplicado = await request(app)
            .post("/api/registro")
            .send({ nombre: "Otra Ana", correo: correoPrueba, password: "secreto123" });
        expect(duplicado.status).toBe(400);
        expect(duplicado.body.mensaje).toBe("Ya existe un usuario registrado con ese correo");

        // 4) Login con una contraseña incorrecta -> 401; con la correcta -> 200 + JWT
        const loginMalo = await request(app)
            .post("/api/login")
            .send({ correo: correoPrueba, password: "incorrecta" });
        expect(loginMalo.status).toBe(401);

        const login = await request(app)
            .post("/api/login")
            .send({ correo: correoPrueba, password: "secreto123" });
        expect(login.status).toBe(200);
        expect(login.body.token).toEqual(expect.any(String));
        expect(login.body.usuario.rol).toBe("estudiante");
        expect(login.body.usuario.password).toBeUndefined();

        const token = login.body.token;
        const idUsuario = enBD.id_usuario;

        // 5) Con el token, el estudiante puede ver SUS propios datos
        const propio = await request(app)
            .get(`/api/usuarios/${idUsuario}`)
            .set("Authorization", `Bearer ${token}`);
        expect(propio.status).toBe(200);
        expect(propio.body.correo).toBe(correoPrueba);

        // 6) ...pero no puede listar todos los usuarios (solo admin) ni usar rutas sin token
        const listado = await request(app)
            .get("/api/usuarios")
            .set("Authorization", `Bearer ${token}`);
        expect(listado.status).toBe(403);

        const sinToken = await request(app).get(`/api/usuarios/${idUsuario}`);
        expect(sinToken.status).toBe(401);
    });
});
