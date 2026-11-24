// PRUEBA UNITARIA 3 - Capa: Repositorios
// Aislamiento: los modelos de Sequelize se reemplazan por mocks (no se conecta a MySQL).
jest.mock("../../../src/models", () => ({
    Usuario: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    },
    Rol: { nombreMock: "Rol" }
}));

const { Usuario, Rol } = require("../../../src/models");
const UsuarioRepository = require("../../../src/repositories/UsuarioRepository");

describe("UsuarioRepository (unitaria - acceso a datos)", () => {
    let repositorio;

    beforeEach(() => {
        jest.clearAllMocks();
        repositorio = new UsuarioRepository();
    });

    it("obtenerTodos pide solo columnas seguras (sin password)", async () => {
        Usuario.findAll.mockResolvedValue([{ id_usuario: 1 }]);

        const usuarios = await repositorio.obtenerTodos();

        expect(usuarios).toEqual([{ id_usuario: 1 }]);
        const opciones = Usuario.findAll.mock.calls[0][0];
        expect(opciones.attributes).toEqual(["id_usuario", "nombre", "correo", "fecha_registro", "id_rol"]);
        expect(opciones.attributes).not.toContain("password");
    });

    it("obtenerPorCorreo busca por correo e incluye el nombre del rol", async () => {
        Usuario.findOne.mockResolvedValue({ id_usuario: 1 });

        await repositorio.obtenerPorCorreo("ana@mail.com");

        expect(Usuario.findOne).toHaveBeenCalledWith({
            where: { correo: "ana@mail.com" },
            include: [{ model: Rol, attributes: ["nombre_rol"] }]
        });
    });

    it("crear envía únicamente nombre, correo, password e id_rol al modelo", async () => {
        Usuario.create.mockResolvedValue({ id_usuario: 3 });

        await repositorio.crear({
            nombre: "Ana",
            correo: "ana@mail.com",
            password: "hash",
            id_rol: 2,
            campoExtra: "debe ignorarse"
        });

        expect(Usuario.create).toHaveBeenCalledWith({
            nombre: "Ana",
            correo: "ana@mail.com",
            password: "hash",
            id_rol: 2
        });
    });

    describe("actualizar", () => {
        it("devuelve null si no se actualizó ninguna fila", async () => {
            Usuario.update.mockResolvedValue([0]);

            const resultado = await repositorio.actualizar(99, { nombre: "X", correo: "x@x.com", id_rol: 2 });

            expect(resultado).toBeNull();
            expect(Usuario.findByPk).not.toHaveBeenCalled();
        });

        it("devuelve el usuario actualizado cuando se modificó una fila", async () => {
            Usuario.update.mockResolvedValue([1]);
            Usuario.findByPk.mockResolvedValue({ id_usuario: 1, nombre: "Nuevo" });

            const resultado = await repositorio.actualizar(1, { nombre: "Nuevo", correo: "n@n.com", id_rol: 2 });

            expect(Usuario.update).toHaveBeenCalledWith(
                { nombre: "Nuevo", correo: "n@n.com", id_rol: 2 },
                { where: { id_usuario: 1 } }
            );
            expect(resultado).toEqual({ id_usuario: 1, nombre: "Nuevo" });
        });
    });

    describe("eliminar", () => {
        it("devuelve true cuando se borró una fila", async () => {
            Usuario.destroy.mockResolvedValue(1);
            expect(await repositorio.eliminar(1)).toBe(true);
            expect(Usuario.destroy).toHaveBeenCalledWith({ where: { id_usuario: 1 } });
        });

        it("devuelve false cuando no se borró ninguna fila", async () => {
            Usuario.destroy.mockResolvedValue(0);
            expect(await repositorio.eliminar(99)).toBe(false);
        });
    });
});
