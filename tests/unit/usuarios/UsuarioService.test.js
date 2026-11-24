// PRUEBA UNITARIA 1 - Capa: Servicios / lógica de negocio
// Aislamiento: el repositorio y bcryptjs se reemplazan por mocks (no hay BD real).
jest.mock("bcryptjs", () => ({ hash: jest.fn(), compare: jest.fn() }));

const bcrypt = require("bcryptjs");
const UsuarioService = require("../../../src/services/UsuarioService");

describe("UsuarioService (unitaria - lógica de negocio)", () => {
    let repo;
    let service;

    beforeEach(() => {
        jest.clearAllMocks();
        repo = {
            obtenerPorCorreo: jest.fn(),
            obtenerPorId: jest.fn(),
            crear: jest.fn()
        };
        service = new UsuarioService(repo);
    });

    describe("crear", () => {
        it("rechaza un correo con formato inválido sin consultar el repositorio", async () => {
            await expect(
                service.crear({ nombre: "Ana", correo: "no-es-correo", password: "secreto123" })
            ).rejects.toThrow("El correo no tiene un formato válido");

            expect(repo.obtenerPorCorreo).not.toHaveBeenCalled();
        });

        it("rechaza una contraseña de menos de 6 caracteres", async () => {
            await expect(
                service.crear({ nombre: "Ana", correo: "ana@mail.com", password: "123" })
            ).rejects.toThrow("La contraseña debe tener al menos 6 caracteres");
        });

        it("rechaza un correo que ya está registrado y no crea el usuario", async () => {
            repo.obtenerPorCorreo.mockResolvedValue({ id_usuario: 1 });

            await expect(
                service.crear({ nombre: "Ana", correo: "ana@mail.com", password: "secreto123" })
            ).rejects.toThrow("Ya existe un usuario registrado con ese correo");

            expect(repo.crear).not.toHaveBeenCalled();
        });

        it("encripta la contraseña, normaliza los datos y asigna el rol estudiante (2) por defecto", async () => {
            repo.obtenerPorCorreo.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue("hash_falso");
            repo.crear.mockResolvedValue({ id_usuario: 5 });

            const resultado = await service.crear({
                nombre: "  Ana  ",
                correo: "ANA@Mail.COM",
                password: "secreto123"
            });

            expect(bcrypt.hash).toHaveBeenCalledWith("secreto123", 10);
            expect(repo.crear).toHaveBeenCalledWith({
                nombre: "Ana",
                correo: "ana@mail.com",
                password: "hash_falso",
                id_rol: 2
            });
            expect(resultado).toEqual({ id_usuario: 5 });
        });
    });

    describe("login", () => {
        it("lanza 'Credenciales inválidas' si el usuario no existe", async () => {
            repo.obtenerPorCorreo.mockResolvedValue(null);

            await expect(service.login("nadie@mail.com", "secreto123"))
                .rejects.toThrow("Credenciales inválidas");
        });

        it("lanza 'Credenciales inválidas' si la contraseña no coincide", async () => {
            repo.obtenerPorCorreo.mockResolvedValue({ password: "hash", toJSON: () => ({}) });
            bcrypt.compare.mockResolvedValue(false);

            await expect(service.login("ana@mail.com", "incorrecta"))
                .rejects.toThrow("Credenciales inválidas");
        });

        it("devuelve el usuario sin password y con su rol cuando las credenciales son correctas", async () => {
            repo.obtenerPorCorreo.mockResolvedValue({
                password: "hash",
                Rol: { nombre_rol: "estudiante" },
                toJSON: () => ({
                    id_usuario: 1,
                    correo: "ana@mail.com",
                    password: "hash",
                    id_rol: 2,
                    Rol: { nombre_rol: "estudiante" }
                })
            });
            bcrypt.compare.mockResolvedValue(true);

            const usuario = await service.login("ana@mail.com", "secreto123");

            expect(usuario).toEqual({
                id_usuario: 1,
                correo: "ana@mail.com",
                id_rol: 2,
                rol: "estudiante"
            });
            expect(usuario.password).toBeUndefined();
        });
    });
});
