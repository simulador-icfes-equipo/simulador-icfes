jest.mock("../../src/models", () => ({
    InformacionCompartida: {
        update: jest.fn(),
        findByPk: jest.fn()
    }
}));

const PreguntaController = require("../../src/controllers/PreguntaController");
const PreguntaService = require("../../src/services/PreguntaService");
const InformacionCompartidaService = require("../../src/services/InformacionCompartidaService");
const InformacionCompartidaRepository = require("../../src/repositories/InformacionCompartidaRepository");
const { InformacionCompartida } = require("../../src/models");

describe("Pruebas Unitarias - Módulos Preguntas e Información Compartida", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // =========================================================================
    // PRUEBA UNITARIA 1 - CAPA CONTROLLER (PreguntaController.crear)
    // =========================================================================
    test("1. [Controller] PreguntaController.crear debe responder HTTP 201 con la pregunta creada", async () => {
        const preguntaCreada = {
            id_pregunta: 10,
            id_area: 1,
            enunciado: "¿Cuál es la derivada de x^2?",
            opcion_a: "x",
            opcion_b: "2x",
            opcion_c: "x^2",
            opcion_d: "2",
            respuesta_correcta: "B",
            nivel_dificultad: "FACIL"
        };

        const mockPreguntaService = {
            crear: jest.fn().mockResolvedValue(preguntaCreada)
        };

        const controller = new PreguntaController(mockPreguntaService);

        const req = { body: preguntaCreada };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await controller.crear(req, res);

        expect(mockPreguntaService.crear).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            mensaje: "Pregunta creada correctamente",
            datos: preguntaCreada
        });
    });

    // =========================================================================
    // PRUEBA UNITARIA 2 - CAPA SERVICE (PreguntaService.crear - validación)
    // =========================================================================
    test("2. [Service] PreguntaService.crear debe lanzar error si respuesta_correcta no es A, B, C o D", async () => {
        const mockPreguntaRepository = {
            crear: jest.fn()
        };

        const service = new PreguntaService(mockPreguntaRepository);

        const payloadInvalido = {
            id_area: 1,
            enunciado: "¿Qué proceso cambia el agua de líquido a gas?",
            opcion_a: "Condensación",
            opcion_b: "Evaporación",
            opcion_c: "Solidificación",
            opcion_d: "Precipitación",
            respuesta_correcta: "E",
            nivel_dificultad: "FACIL"
        };

        await expect(service.crear(payloadInvalido)).rejects.toThrow(
            "La respuesta correcta debe ser A, B, C o D"
        );
        expect(mockPreguntaRepository.crear).not.toHaveBeenCalled();
    });

    // =========================================================================
    // PRUEBA UNITARIA 3 - CAPA SERVICE (InformacionCompartidaService.crear)
    // =========================================================================
    test("3. [Service] InformacionCompartidaService.crear debe limpiar espacios (trim) y guardar correctamente", async () => {
        const registroEsperado = {
            id_informacion_compartida: 5,
            titulo: "Texto de Lectura Crítica",
            contenido: "Lea el siguiente fragmento filosófico.",
            url_imagen: null
        };

        const mockRepo = {
            crear: jest.fn().mockResolvedValue(registroEsperado)
        };

        const service = new InformacionCompartidaService(mockRepo);

        const payload = {
            titulo: "   Texto de Lectura Crítica   ",
            contenido: "   Lea el siguiente fragmento filosófico.   "
        };

        const resultado = await service.crear(payload);

        expect(mockRepo.crear).toHaveBeenCalledWith({
            titulo: "Texto de Lectura Crítica",
            contenido: "Lea el siguiente fragmento filosófico.",
            url_imagen: null
        });
        expect(resultado).toEqual(registroEsperado);
    });

    // =========================================================================
    // PRUEBA UNITARIA 4 - CAPA REPOSITORY (InformacionCompartidaRepository.actualizar)
    // =========================================================================
    test("4. [Repository] InformacionCompartidaRepository.actualizar debe actualizar y retornar el registro", async () => {
        const datosActualizados = {
            titulo: "Gráfica de Población",
            contenido: "Analice la variación demográfica entre 2010 y 2025.",
            url_imagen: "https://ejemplo.com/grafica.png"
        };

        const registroActualizado = {
            id_informacion_compartida: 3,
            ...datosActualizados
        };

        InformacionCompartida.update.mockResolvedValue([1]);
        InformacionCompartida.findByPk.mockResolvedValue(registroActualizado);

        const repository = new InformacionCompartidaRepository();
        const resultado = await repository.actualizar(3, datosActualizados);

        expect(InformacionCompartida.update).toHaveBeenCalledWith(
            datosActualizados,
            { where: { id_informacion_compartida: 3 } }
        );
        expect(InformacionCompartida.findByPk).toHaveBeenCalledWith(3);
        expect(resultado).toEqual(registroActualizado);
    });

});