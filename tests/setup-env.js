// Se ejecuta ANTES de cargar cualquier módulo del proyecto (ver "jest.setupFiles" en package.json).
// Carga el .env local (host, usuario y clave de MySQL) pero SIEMPRE fuerza una base de datos de pruebas,
// para que las pruebas nunca toquen los datos reales.
require("dotenv").config({ quiet: true });

process.env.DB_NAME = process.env.DB_NAME_TEST || "simulador_icfes_test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "secreto_solo_para_pruebas";
process.env.JWT_EXPIRES_IN = "1h";
