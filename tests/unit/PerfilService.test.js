const PerfilService = require('../../src/services/PerfilService');

describe('Pruebas unitarias de PerfilService', () => {
    let perfilRepository;
    let perfilService;

    beforeEach(() => {
        perfilRepository = {
            obtenerPorUsuario: jest.fn(),
            crear: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn()
        };

        perfilService = new PerfilService(perfilRepository);
    });

    test('Debe obtener el perfil de un usuario correctamente', async () => {
        const perfil = {
            id_usuario: 1,
            imagen: 'perfil.jpg',
            avatar: 'avatar1'
        };

        perfilRepository.obtenerPorUsuario.mockResolvedValue(perfil);

        const resultado = await perfilService.obtenerPorUsuario(1);

        expect(resultado).toEqual(perfil);
        expect(perfilRepository.obtenerPorUsuario).toHaveBeenCalledWith(1);
    });

    test('Debe crear un perfil cuando el usuario no tiene uno', async () => {
        const datos = {
            imagen: 'perfil.jpg',
            avatar: 'avatar1'
        };

        perfilRepository.obtenerPorUsuario.mockResolvedValue(null);
        perfilRepository.crear.mockResolvedValue({
            id_usuario: 2,
            ...datos
        });

        const resultado = await perfilService.crear(2, datos);

        expect(perfilRepository.crear).toHaveBeenCalledWith(
            2,
            'perfil.jpg',
            'avatar1'
        );

        expect(resultado).toEqual({
            id_usuario: 2,
            imagen: 'perfil.jpg',
            avatar: 'avatar1'
        });
    });

    test('Debe rechazar la creación si el usuario ya tiene un perfil', async () => {
        perfilRepository.obtenerPorUsuario.mockResolvedValue({
            id_usuario: 3,
            avatar: 'avatar1'
        });

        await expect(
            perfilService.crear(3, { avatar: 'avatar2' })
        ).rejects.toThrow('El usuario ya tiene un perfil');

        expect(perfilRepository.crear).not.toHaveBeenCalled();
    });

    test('Debe actualizar el perfil de un usuario correctamente', async () => {
        const datos = {
            imagen: 'nueva-imagen.jpg',
            avatar: 'avatar2'
        };

        perfilRepository.actualizar.mockResolvedValue(true);

        const resultado = await perfilService.actualizar(4, datos);

        expect(perfilRepository.actualizar).toHaveBeenCalledWith(
            4,
            'nueva-imagen.jpg',
            'avatar2'
        );

        expect(resultado).toBe(true);
    });
});