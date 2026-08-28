const mysql = require("mysql2");

class ConfiguracionDB {

    #config;

    constructor() {
        this.#config = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        };
    }

    get configuracion() {
        return { ...this.#config };
    }
}


class ConectorDB {

    #pool;

    constructor(configuracion) {
        this.#pool = mysql.createPool(configuracion);
    }

    get pool() {
        return this.#pool;
    }
}


class EjecutorConsulta {

    #pool;

    constructor(pool) {
        this.#pool = pool;
    }

    ejecutar(sql, params = []) {
        return new Promise((resolve, reject) => {

            this.#pool.query(sql, params, (err, results) => {

                if (err) {
                    console.error("❌ Error en consulta:", err.message);
                    reject(err);
                } else {
                    resolve(results);
                }

            });

        });
    }
}


class BaseDatos {

    #config;
    #conector;
    #ejecutor;

    constructor() {

        this.#config = new ConfiguracionDB();

        this.#conector = new ConectorDB(
            this.#config.configuracion
        );

        this.#ejecutor = new EjecutorConsulta(
            this.#conector.pool
        );

        this.#verificarConexion();
    }


    #verificarConexion() {

        this.#conector.pool.getConnection((err, connection) => {

            if (err) {
                console.error(
                    "❌ Error conectando a MySQL:",
                    err.message
                );
                return;
            }

            console.log("✅ Conectado a MySQL");

            connection.release();

        });

    }


    ejecutar(sql, params = []) {
        return this.#ejecutor.ejecutar(sql, params);
    }


    get pool() {
        return this.#conector.pool;
    }

}


module.exports = BaseDatos;