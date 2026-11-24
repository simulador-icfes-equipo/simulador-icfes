// PRUEBA UNITARIA 2 - Capa: Controladores
// Aislamiento: el servicio es un mock y req/res son objetos simulados (no hay Express ni BD).
const jwt = require("jsonwebtoken");
const UsuarioController = require("../../../src/controllers/UsuarioController");

function crearRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("UsuarioController (unitaria - controladores)", () => {
    let servicio;
    let controlador;

    beforeEach(() => {
        servicio = {
            obtenerPorId: jest.fn(),
            crear: jest.fn(),
            login: jest.fn()
        };
        controlador = new UsuarioController(servicio);
        // El controlador hace console.error en los caminos de error; lo silenciamos.
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("obtenerPorId", () => {
        it("responde 200 con el usuario cuando existe", async () => {
            const usuario = { id_usuario: 1, nombre: "Ana" };
            servicio.obtenerPorId.mockResolvedValue(usuario);
            const res = crearRes();

            await controlador.obtenerPorId({ params: { id: "1" } }, res);

            expect(servicio.obtenerPorId).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(usuario);
        });

        it("responde 404 cuando el servicio no encuentra el usuario", async () => {
            servicio.obtenerPorId.mockResolvedValue(null);
            const res = crearRes();

            await controlador.obtenerPorId({ params: { id: "99" } }, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ mensaje: "Usuario no encontrado" });
        });

        it("responde 400 con el mensaje del error cuando el servicio falla", async () => {
            servicio.obtenerPorId.mockRejectedValue(new Error("El ID del usuario no es válido"));
            const res = crearRes();

            await controlador.obtenerPorId({ params: { id: "abc" } }, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ mensaje: "El ID del usuario no es válido" });
        });
    });

    describe("crear", () => {
        it("responde 201 y NO expone el password en la respuesta", async () => {
            servicio.crear.mockResolvedValue({ id_usuario: 7, correo: "ana@mail.com", password: "hash" });
            const res = crearRes();

            await controlador.crear({ body: { nombre: "Ana" } }, res);

            expect(res.status).toHaveBeenCalledWith(201);
            const respuesta = res.json.mock.calls[0][0];
            expect(respuesta.mensaje).toBe("Usuario creado correctamente");
            expect(respuesta.usuario.password).toBeUndefined();
            expect(respuesta.usuario.correo).toBe("ana@mail.com");
        });

        it("responde 400 cuando el servicio rechaza los datos", async () => {
            servicio.crear.mockRejectedValue(new Error("El nombre es obligatorio"));
            const res = crearRes();

            await controlador.crear({ body: {} }, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ mensaje: "El nombre es obligatorio" });
        });
    });

    describe("login", () => {
        it("responde 200 con un JWT firmado que contiene id, correo y rol", async () => {
            servicio.login.mockResolvedValue({ id_usuario: 1, correo: "ana@mail.com", rol: "estudiante" });
            const res = crearRes();

            await controlador.login({ body: { correo: "ana@mail.com", password: "secreto123" } }, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const { token, mensaje } = res.json.mock.calls[0][0];
            expect(mensaje).toBe("Login exitoso");

            const payload = jwt.verify(token, process.env.JWT_SECRET);
            expect(payload).toMatchObject({ id_usuario: 1, correo: "ana@mail.com", rol: "estudiante" });
        });

        it("responde 401 cuando las credenciales son inválidas", async () => {
            servicio.login.mockRejectedValue(new Error("Credenciales inválidas"));
            const res = crearRes();

            await controlador.login({ body: { correo: "ana@mail.com", password: "mala" } }, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ mensaje: "Credenciales inválidas" });
        });
    });
});
