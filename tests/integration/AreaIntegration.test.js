const request = require('supertest');
const express = require('express');
const AreaController = require('../../src/controllers/AreaController');
const AreaService = require('../../src/services/AreaService');

describe('Prueba de Integración: API Áreas (Express Router -> Controller -> Service)', () => {
    let app;
    let baseDeDatosPruebas;
    let repositorioPruebas;
    let areaServiceReal;
    let areaControllerReal;

    let consoleErrorSpy;

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        // Base de datos de pruebas en memoria para aislar sin depender de red ni MySQL
        baseDeDatosPruebas = [
            { id_area: 1, nombre_area: 'Matemáticas', descripcion: 'Álgebra y cálculo' },
            { id_area: 2, nombre_area: 'Lectura Crítica', descripcion: 'Análisis de textos' }
        ];

        // Repositorio que interactúa con la base de datos de pruebas simulada
        repositorioPruebas = {
            obtenerTodas: jest.fn(async () => [...baseDeDatosPruebas]),
            obtenerPorId: jest.fn(async (id) => baseDeDatosPruebas.find(a => a.id_area === Number(id)) || null),
            obtenerPorNombre: jest.fn(async (nombre) => baseDeDatosPruebas.find(a => a.nombre_area.toLowerCase() === nombre.toLowerCase()) || null),
            crear: jest.fn(async (area) => {
                const nuevo = {
                    id_area: baseDeDatosPruebas.length + 1,
                    nombre_area: area.nombre_area,
                    descripcion: area.descripcion
                };
                baseDeDatosPruebas.push(nuevo);
                return nuevo;
            })
        };

        // Instancias REALES de Service y Controller integrados
        areaServiceReal = new AreaService(repositorioPruebas);
        areaControllerReal = new AreaController(areaServiceReal);

        // Servidor Express real para probar la interacción HTTP completa
        app = express();
        app.use(express.json());

        const router = express.Router();
        router.get('/:id', areaControllerReal.obtenerPorId);
        router.post('/', areaControllerReal.crear);
        router.get('/', areaControllerReal.obtenerTodas);

        app.use('/api/areas', router);
    });

    afterEach(() => {
        if (consoleErrorSpy) consoleErrorSpy.mockRestore();
    });

    test('Flujo de Integración: GET /api/areas/:id debe conectar Router -> Controller -> Service -> Repositorio y retornar 200 con el objeto', async () => {
        const respuesta = await request(app)
            .get('/api/areas/1')
            .expect(200);

        expect(respuesta.body).toEqual({
            success: true,
            data: {
                id_area: 1,
                nombre_area: 'Matemáticas',
                descripcion: 'Álgebra y cálculo'
            }
        });
    });

    test('Flujo de Integración: POST /api/areas valida regla de negocio en Service y persiste datos a través de Controller', async () => {
        const nuevoPayload = {
            nombre_area: 'Ciencias Naturales',
            descripcion: 'Biología y Física'
        };

        const respuesta = await request(app)
            .post('/api/areas')
            .send(nuevoPayload)
            .expect(201);

        expect(respuesta.body.success).toBe(true);
        expect(respuesta.body.message).toBe('Área creada correctamente.');
        expect(respuesta.body.data).toMatchObject({
            id_area: 3,
            nombre_area: 'Ciencias Naturales',
            descripcion: 'Biología y Física'
        });

        // Verificamos que se haya persistido en la base de datos de pruebas
        expect(baseDeDatosPruebas.length).toBe(3);
    });

    test('Flujo de Integración: POST /api/areas rechaza área duplicada ejecutando la lógica real de AreaService', async () => {
        const payloadDuplicado = {
            nombre_area: 'Matemáticas',
            descripcion: 'Intento de duplicación'
        };

        const respuesta = await request(app)
            .post('/api/areas')
            .send(payloadDuplicado)
            .expect(400);

        expect(respuesta.body.success).toBe(false);
        expect(respuesta.body.message).toBe('Ya existe un área con ese nombre.');
    });
});
