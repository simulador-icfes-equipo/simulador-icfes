const AreaController = require('../../src/controllers/AreaController');

describe('Capa de Controlador: AreaController (Pruebas Unitarias)', () => {
    let mockAreaService;
    let areaController;
    let req;
    let res;

    beforeEach(() => {
        // Mock completo del servicio para aislar la capa del controlador
        mockAreaService = {
            crear: jest.fn(),
            obtenerPorId: jest.fn(),
            obtenerTodas: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn(),
            obtenerEstadisticas: jest.fn()
        };

        areaController = new AreaController(mockAreaService);

        // Mock de los objetos de Express req y res
        req = {
            body: {},
            params: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    test('crear - debe responder con HTTP 201 y el área creada cuando el payload es válido', async () => {
        // Datos de entrada (Payload)
        req.body = {
            nombre_area: 'Ciencias Naturales',
            descripcion: 'Área enfocada en biología, química y física'
        };

        const mockAreaCreada = {
            id_area: 1,
            nombre_area: 'Ciencias Naturales',
            descripcion: 'Área enfocada en biología, química y física'
        };

        mockAreaService.crear.mockResolvedValue(mockAreaCreada);

        await areaController.crear(req, res);

        expect(mockAreaService.crear).toHaveBeenCalledTimes(1);
        expect(mockAreaService.crear).toHaveBeenCalledWith({
            nombre_area: 'Ciencias Naturales',
            descripcion: 'Área enfocada en biología, química y física'
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Área creada correctamente.',
            data: mockAreaCreada
        });
    });

    test('crear - debe responder con HTTP 400 cuando falta nombre_area', async () => {
        req.body = {
            descripcion: 'Área sin nombre'
        };

        await areaController.crear(req, res);

        expect(mockAreaService.crear).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'nombre_area es obligatorio.'
        });
    });

    test('obtenerPorId - debe responder con HTTP 400 cuando el id no es un número', async () => {
        req.params = { id: 'abc' };

        await areaController.obtenerPorId(req, res);

        expect(mockAreaService.obtenerPorId).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'El id_area debe ser un número válido.'
        });
    });

    test('obtenerPorId - debe responder con HTTP 404 cuando el área no existe', async () => {
        req.params = { id: '99' };
        mockAreaService.obtenerPorId.mockResolvedValue(null);

        await areaController.obtenerPorId(req, res);

        expect(mockAreaService.obtenerPorId).toHaveBeenCalledWith(99);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Área no encontrada.'
        });
    });
});
