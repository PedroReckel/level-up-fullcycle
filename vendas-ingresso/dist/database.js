"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mysql = __importStar(require("mysql2/promise"));
// Singleton - Ele vai fazer com que sempre que eu tiver que chamar uma instância, se ela estiver criada nos vamos usar essa instância já criada 
class Database {
    constructor() { }
    static getInstance() {
        if (!Database.instance) {
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
    }
    ;
}
exports.Database = Database;
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
