const AreaService = require('../../src/services/AreaService');

describe('Capa de Servicio: AreaService (Pruebas Unitarias)', () => {
    let mockAreaRepository;
    let areaService;

    beforeEach(() => {
        // Mock completo del repositorio para aislar la lógica de negocio
        mockAreaRepository = {
            obtenerTodas: jest.fn(),
            obtenerPorId: jest.fn(),
            obtenerPorNombre: jest.fn(),
            crear: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn()
        };

        areaService = new AreaService(mockAreaRepository);
    });

    test('crear - debe lanzar una excepción si ya existe un área con el mismo nombre', async () => {
        const payload = {
            nombre_area: 'Matemáticas',
            descripcion: 'Preguntas cuantitativas'
        };

        // Simulamos que el repositorio ya encuentra un área existente
        mockAreaRepository.obtenerPorNombre.mockResolvedValue({
            id_area: 1,
            nombre_area: 'Matemáticas'
        });

        await expect(areaService.crear(payload)).rejects.toThrow('Ya existe un área con ese nombre.');

        expect(mockAreaRepository.obtenerPorNombre).toHaveBeenCalledWith('Matemáticas');
        expect(mockAreaRepository.crear).not.toHaveBeenCalled();
    });

    test('crear - debe recortar espacios y crear el área correctamente si no existe', async () => {
        const payload = {
            nombre_area: '  Inglés  ',
            descripcion: 'Lectura y gramática'
        };

        mockAreaRepository.obtenerPorNombre.mockResolvedValue(null);
        mockAreaRepository.crear.mockResolvedValue({
            id_area: 2,
            nombre_area: 'Inglés',
            descripcion: 'Lectura y gramática'
        });

        const resultado = await areaService.crear(payload);

        expect(mockAreaRepository.obtenerPorNombre).toHaveBeenCalledWith('Inglés');
        expect(mockAreaRepository.crear).toHaveBeenCalledWith({
            nombre_area: 'Inglés',
            descripcion: 'Lectura y gramática'
        });
        expect(resultado).toEqual({
            id_area: 2,
            nombre_area: 'Inglés',
            descripcion: 'Lectura y gramática'
        });
    });

    test('crear - debe lanzar excepción si el nombre_area supera los 50 caracteres', async () => {
        const payload = {
            nombre_area: 'A'.repeat(51),
            descripcion: 'Nombre demasiado largo'
        };

        await expect(areaService.crear(payload)).rejects.toThrow(
            'El nombre del área no puede superar los 50 caracteres.'
        );
        expect(mockAreaRepository.crear).not.toHaveBeenCalled();
    });

    test('crear - debe lanzar excepción si el objeto área o nombre_area está vacío', async () => {
        await expect(areaService.crear(null)).rejects.toThrow('Los datos del área son obligatorios.');
        await expect(areaService.crear({ nombre_area: '   ' })).rejects.toThrow('El nombre del área es obligatorio.');
    });
});
