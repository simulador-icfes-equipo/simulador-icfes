const { autenticar, permitirRoles } = require('../../src/middlewares/auth');
const jwt = require('jsonwebtoken');

describe('Capa de Middleware: auth (Pruebas Unitarias)', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    describe('Middleware autenticar', () => {
        test('debe retornar HTTP 401 si no se envía encabezado de autorización', () => {
            autenticar(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                mensaje: 'Debes iniciar sesión para acceder a este recurso.'
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('debe extraer el token, verificarlo y asignar req.usuario llamando a next()', () => {
            const tokenSimulado = 'jwt_token_valido';
            req.headers.authorization = `Bearer ${tokenSimulado}`;
            process.env.JWT_SECRET = 'clave_secreta_test';

            const payloadUsuario = { id_usuario: 10, rol: 'estudiante' };
            const verifySpy = jest.spyOn(jwt, 'verify').mockReturnValue(payloadUsuario);

            autenticar(req, res, next);

            expect(verifySpy).toHaveBeenCalledWith(tokenSimulado, 'clave_secreta_test');
            expect(req.usuario).toEqual(payloadUsuario);
            expect(next).toHaveBeenCalledTimes(1);

            verifySpy.mockRestore();
        });

        test('debe retornar HTTP 401 si el token es inválido o expiró', () => {
            req.headers.authorization = 'Bearer token_invalido';
            const verifySpy = jest.spyOn(jwt, 'verify').mockImplementation(() => {
                throw new Error('jwt expired');
            });

            autenticar(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                mensaje: 'Token inválido o vencido. Inicia sesión nuevamente.'
            });
            expect(next).not.toHaveBeenCalled();

            verifySpy.mockRestore();
        });
    });

    describe('Middleware permitirRoles', () => {
        test('debe retornar HTTP 403 si el usuario autenticado no posee el rol permitido', () => {
            req.usuario = { id_usuario: 5, rol: 'estudiante' };
            const middleware = permitirRoles('admin', 'gestor');

            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                mensaje: 'No tienes permisos para realizar esta acción.'
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('debe llamar a next() si el rol del usuario está entre los permitidos', () => {
            req.usuario = { id_usuario: 1, rol: 'admin' };
            const middleware = permitirRoles('admin', 'gestor');

            middleware(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(res.status).not.toHaveBeenCalled();
        });
    });
});
