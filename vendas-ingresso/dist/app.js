"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_controller_1 = require("./controller/auth-controller");
const partner_controller_1 = require("./controller/partner-controller");
const customer_controller_1 = require("./controller/customer-controller");
const event_controller_1 = require("./controller/event-controller");
const user_service_1 = require("./services/user-service");
const database_1 = require("./database");
const ticket_controller_1 = require("./controller/ticket-controller");
const app = (0, express_1.default)();
// Toda vez que ele receba um formato json ele já deserializa e coloca em um objeto JavaScript
app.use(express_1.default.json());
const unprotectedRoutes = [
    { method: "POST", path: "/auth/login" },
    { method: "POST", path: "/customers/register" },
    { method: "POST", path: "/partners/register" },
    { method: "GET", path: "/events" },
];
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isUprotectedRoute = unprotectedRoutes.some((route) => route.method == req.method && req.path.startsWith(route.path));
    if (isUprotectedRoute) {
        return next();
    }
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Extrair o TOKEN de "Bearer TOKEN"
    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, '123456');
        const userService = new user_service_1.UserService();
        const user = yield userService.findById(payload.id);
        if (!user) {
            res.status(401).json({ message: "Failed to authenticate token" });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Failed to authenticate token" });
    }
}));
app.get('/', (req, res) => {
    res.json({ message: "Hello World!" });
});
app.use('/auth', auth_controller_1.authRoutes);
app.use('/partners', partner_controller_1.partnerRoutes);
app.use('/customers', customer_controller_1.customerRoutes);
app.use('/events', event_controller_1.eventRoutes);
app.use('/events', ticket_controller_1.ticketRoutes);
app.listen(3000, () => __awaiter(void 0, void 0, void 0, function* () {
    // Limpar a tabela depois que a aplicação é reiniciada
    const connection = database_1.Database.getInstance();
    yield connection.execute("SET FOREIGN_KEY_CHECKS = 0");
    yield connection.execute("TRUNCATE TABLE tickets");
    yield connection.execute("TRUNCATE TABLE events");
    yield connection.execute("TRUNCATE TABLE customers");
    yield connection.execute("TRUNCATE TABLE partners");
    yield connection.execute("TRUNCATE TABLE users");
    yield connection.execute("SET FOREIGN_KEY_CHECKS = 1");
    console.log('Running in http://localhost:3000');
}));
// MVC - Modal View Controller (Arquitetura em camadas)
// Application Service - O que eu quero expor como regras cruciais da aplicação
// Domain Service - Criptografar senha
// Active Record - Encapsular lógica de arma. e de negócio
