const express = require('express');
const request = require('supertest');

const PerfilController = require('../../src/controllers/PerfilController');
const PerfilService = require('../../src/services/PerfilService');

describe('Prueba de integración: Perfil', () => {
    let app;
    let perfiles;
    let perfilRepository;
    let perfilService;
    let perfilController;

    beforeEach(() => {
        // Base de datos simulada en memoria
        perfiles = [];

        // Repositorio simulado
        perfilRepository = {
            obtenerPorUsuario: jest.fn(async (id_usuario) => {
                return perfiles.find(
                    perfil => perfil.id_usuario === Number(id_usuario)
                ) || null;
            }),

            crear: jest.fn(async (id_usuario, imagen, avatar) => {
                const nuevoPerfil = {
                    id_perfil: perfiles.length + 1,
                    id_usuario: Number(id_usuario),
                    imagen,
                    avatar
                };

                perfiles.push(nuevoPerfil);
                return nuevoPerfil;
            }),

            actualizar: jest.fn(async (id_usuario, imagen, avatar) => {
                const perfil = perfiles.find(
                    p => p.id_usuario === Number(id_usuario)
                );

                if (!perfil) return null;

                perfil.imagen = imagen;
                perfil.avatar = avatar;

                return perfil;
            }),

            eliminar: jest.fn(async (id_usuario) => {
                const indice = perfiles.findIndex(
                    p => p.id_usuario === Number(id_usuario)
                );

                if (indice === -1) return false;

                perfiles.splice(indice, 1);
                return true;
            })
        };

        // Servicio y controlador reales
        perfilService = new PerfilService(perfilRepository);
        perfilController = new PerfilController(perfilService);

        // Aplicación Express
        app = express();
        app.use(express.json());

        const router = express.Router();

        router.get('/:id', perfilController.obtenerPorUsuario);
        router.post('/:id', perfilController.crear);
        router.put('/:id', perfilController.actualizar);
        router.delete('/:id', perfilController.eliminar);

        app.use('/api/perfiles', router);
    });

    test('Debe crear un perfil y consultarlo correctamente mediante HTTP', async () => {
        const nuevoPerfil = {
            imagen: 'perfil.jpg',
            avatar: 'avatar1'
        };

        const respuestaCrear = await request(app)
            .post('/api/perfiles/1')
            .send(nuevoPerfil)
            .expect(201);

        expect(respuestaCrear.body.mensaje)
            .toBe('Perfil creado correctamente');

        expect(respuestaCrear.body.perfil).toMatchObject({
            id_usuario: 1,
            imagen: 'perfil.jpg',
            avatar: 'avatar1'
        });

        const respuestaConsultar = await request(app)
            .get('/api/perfiles/1')
            .expect(200);

        expect(respuestaConsultar.body).toMatchObject({
            id_usuario: 1,
            imagen: 'perfil.jpg',
            avatar: 'avatar1'
        });

        expect(perfilRepository.crear).toHaveBeenCalledTimes(1);
        expect(perfilRepository.obtenerPorUsuario).toHaveBeenCalled();
    });
});