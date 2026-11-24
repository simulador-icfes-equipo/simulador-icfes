const express = require("express");
const request = require("supertest");
const jwt = require("jsonwebtoken");

// Persistencia simulada en memoria (prefijo "mock" requerido por Jest)
const mockRegistrosEnMemoria = [];
let mockSecuenciaId = 1;

jest.mock("../../src/models", () => ({
    InformacionCompartida: {
        create: jest.fn(async (datos) => {
            const nuevo = { id_informacion_compartida: mockSecuenciaId++, ...datos };
            mockRegistrosEnMemoria.push(nuevo);
            return nuevo;
        }),
        findByPk: jest.fn(async (id) => {
            return mockRegistrosEnMemoria.find(
                (r) => r.id_informacion_compartida === Number(id)
            ) || null;
        }),
        findAll: jest.fn(async () => mockRegistrosEnMemoria)
    }
}));

const rutasInformacionCompartida = require("../../src/routes/informacion-compartida");

describe("Prueba de Integración - Flujo completo de Información Compartida", () => {
    let app;
    let tokenGestor;

    beforeAll(() => {
        process.env.JWT_SECRET = "secreto_pruebas_integracion_icfes";

        app = express();
        app.use(express.json());
        app.use("/api/informacion-compartida", rutasInformacionCompartida());

        tokenGestor = jwt.sign(
            { id_usuario: 1, correo: "gestor@icfes.edu.co", rol: "gestor" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
    });

    beforeEach(() => {
        mockRegistrosEnMemoria.length = 0;
        mockSecuenciaId = 1;
    });

    test("5. [Integración] Debe autenticar con JWT, crear información compartida (POST) y consultarla por ID (GET)", async () => {
        const payload = {
            titulo: "  Contexto de Ciencias Naturales  ",
            contenido: "  El ciclo del agua describe el movimiento continuo del agua.  ",
            url_imagen: "https://cdn.ejemplo.com/ciclo-agua.png"
        };

        // 1. POST autenticado atravesando Router -> Auth JWT -> Controller -> Service -> Repository
        const resCrear = await request(app)
            .post("/api/informacion-compartida")
            .set("Authorization", `Bearer ${tokenGestor}`)
            .send(payload);

        expect(resCrear.statusCode).toBe(201);
        expect(resCrear.body.mensaje).toBe("Información compartida creada correctamente");
        expect(resCrear.body.datos).toEqual({
            id_informacion_compartida: 1,
            titulo: "Contexto de Ciencias Naturales",
            contenido: "El ciclo del agua describe el movimiento continuo del agua.",
            url_imagen: "https://cdn.ejemplo.com/ciclo-agua.png"
        });

        // 2. GET consultando el mismo registro recién creado
        const resObtener = await request(app)
            .get("/api/informacion-compartida/1");

        expect(resObtener.statusCode).toBe(200);
        expect(resObtener.body.id_informacion_compartida).toBe(1);
        expect(resObtener.body.titulo).toBe("Contexto de Ciencias Naturales");
    });
});