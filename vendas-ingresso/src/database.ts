import * as mysql from 'mysql2/promise';

// Singleton - Ele vai fazer com que sempre que eu tiver que chamar uma instância, se ela estiver criada nos vamos usar essa instância já criada 

export class Database {

    private static instance: mysql.Pool;

    private constructor() {}

    public static getInstance(): mysql.Pool { // Metodo estático para pegar a instância do banco de dados que vai devolver a instância do pool
        if(!Database.instance) {
            Database.instance = mysql.createPool({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'tickets',
                port: 33060,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            });
        }

        return Database.instance;
    };
}

// export function createConnection() {
//      return mysql.createPool({
//          host: 'localhost',
//          user: 'root',
//          password: 'root',
//          database: 'tickets',
//          port: 33060
//      })
// }

// Pool de conexões -> Consigo trabalhar com conexões simultaneas