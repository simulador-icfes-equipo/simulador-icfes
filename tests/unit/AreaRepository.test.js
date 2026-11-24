// Mock de los modelos de Sequelize antes de importar el repositorio
jest.mock('../../src/models', () => ({
    Area: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    },
    Pregunta: {
        count: jest.fn()
    },
    Evaluacion: {
        count: jest.fn(),
        findOne: jest.fn()
    },
    sequelize: {
        fn: jest.fn(),
        col: jest.fn()
    }
}));

const { Area } = require('../../src/models');
const AreaRepository = require('../../src/repositories/AreaRepository');

describe('Capa de Repositorio: AreaRepository (Pruebas Unitarias)', () => {
    let areaRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        areaRepository = new AreaRepository();
    });

    test('obtenerPorId - debe invocar Area.findByPk con el id proporcionado y retornar el área', async () => {
        const mockArea = {
            id_area: 1,
            nombre_area: 'Lectura Crítica',
            descripcion: 'Comprensión lectora y textos argumentativos'
        };

        Area.findByPk.mockResolvedValue(mockArea);

        const resultado = await areaRepository.obtenerPorId(1);

        expect(Area.findByPk).toHaveBeenCalledTimes(1);
        expect(Area.findByPk).toHaveBeenCalledWith(1);
        expect(resultado).toEqual(mockArea);
    });

    test('obtenerPorNombre - debe buscar mediante Area.findOne con la cláusula where adecuada', async () => {
        const mockArea = { id_area: 2, nombre_area: 'Sociales' };
        Area.findOne.mockResolvedValue(mockArea);

        const resultado = await areaRepository.obtenerPorNombre('Sociales');

        expect(Area.findOne).toHaveBeenCalledWith({ where: { nombre_area: 'Sociales' } });
        expect(resultado).toEqual(mockArea);
    });

    test('crear - debe llamar a Area.create con los campos correctos', async () => {
        const nuevaAreaData = {
            nombre_area: 'Filosofía',
            descripcion: 'Historia del pensamiento'
        };

        const mockCreado = { id_area: 3, ...nuevaAreaData };
        Area.create.mockResolvedValue(mockCreado);

        const resultado = await areaRepository.crear(nuevaAreaData);

        expect(Area.create).toHaveBeenCalledWith({
            nombre_area: 'Filosofía',
            descripcion: 'Historia del pensamiento'
        });
        expect(resultado).toEqual(mockCreado);
    });

    test('eliminar - debe retornar true si se eliminó al menos una fila en la base de datos', async () => {
        Area.destroy.mockResolvedValue(1);

        const resultado = await areaRepository.eliminar(5);

        expect(Area.destroy).toHaveBeenCalledWith({ where: { id_area: 5 } });
        expect(resultado).toBe(true);
    });
});
