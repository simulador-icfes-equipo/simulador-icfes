// PRUEBA UNITARIA 4 - Capa: Middlewares de seguridad (autenticación y autorización)
// Aislamiento: req/res/next simulados; el JWT se firma con el secreto de pruebas.
const jwt = require("jsonwebtoken");
const { autenticar, permitirRoles, propietarioOAdmin } = require("../../../src/middlewares/auth");

function crearRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("middlewares/auth (unitaria - seguridad)", () => {
    describe("autenticar", () => {
        it("responde 401 si no llega el encabezado Authorization", () => {
            const res = crearRes();
            const next = jest.fn();

            autenticar({ headers: {} }, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(next).not.toHaveBeenCalled();
        });

        it("responde 401 si el token es inválido", () => {
            const res = crearRes();
            const next = jest.fn();

            autenticar({ headers: { authorization: "Bearer token-falso" } }, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(next).not.toHaveBeenCalled();
        });

        it("con un token válido guarda el payload en req.usuario y continúa", () => {
            const token = jwt.sign(
                { id_usuario: 1, correo: "ana@mail.com", rol: "estudiante" },
                process.env.JWT_SECRET
            );
            const req = { headers: { authorization: `Bearer ${token}` } };
            const res = crearRes();
            const next = jest.fn();

            autenticar(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(req.usuario).toMatchObject({ id_usuario: 1, rol: "estudiante" });
        });
    });

    describe("permitirRoles", () => {
        it("deja pasar a un rol permitido", () => {
            const next = jest.fn();
            permitirRoles("admin")({ usuario: { rol: "admin" } }, crearRes(), next);
            expect(next).toHaveBeenCalledTimes(1);
        });

        it("responde 403 a un rol no permitido", () => {
            const res = crearRes();
            const next = jest.fn();

            permitirRoles("admin")({ usuario: { rol: "estudiante" } }, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe("propietarioOAdmin", () => {
        it("permite al dueño consultar su propio id", () => {
            const next = jest.fn();
            propietarioOAdmin("id")({ params: { id: "5" }, usuario: { rol: "estudiante", id_usuario: 5 } }, crearRes(), next);
            expect(next).toHaveBeenCalledTimes(1);
        });

        it("permite al admin consultar el id de cualquiera", () => {
            const next = jest.fn();
            propietarioOAdmin("id")({ params: { id: "5" }, usuario: { rol: "admin", id_usuario: 1 } }, crearRes(), next);
            expect(next).toHaveBeenCalledTimes(1);
        });

        it("responde 403 si un estudiante intenta ver los datos de otro", () => {
            const res = crearRes();
            const next = jest.fn();

            propietarioOAdmin("id")({ params: { id: "5" }, usuario: { rol: "estudiante", id_usuario: 9 } }, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(next).not.toHaveBeenCalled();
        });
    });
});
