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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketModel = exports.TicketStatus = void 0;
const database_1 = require("../database");
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["available"] = "available";
    TicketStatus["sold"] = "sold";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
class TicketModel {
    constructor(data = {}) {
        this.fill(data);
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const created_at = new Date();
            const [result] = yield db.execute("INSERT INTO tickets (location, event_id, price, status, created_at) VALUES (?, ?, ?, ?, ?)", [data.location, data.event_id, data.price, data.status, created_at]);
            const ticket = new TicketModel(Object.assign(Object.assign({}, data), { created_at, id: result.insertId }));
            return ticket;
        });
    }
    static createMany(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const created_at = new Date();
            const values = Array(data.length).fill("(?, ?, ?, ?, ?)").join(", ");
            const params = data.reduce((acc, ticket) => [
                ...acc,
                ticket.location,
                ticket.event_id,
                ticket.price,
                ticket.status,
                created_at,
            ], []);
            const [result] = yield db.execute(`INSERT INTO tickets (location, event_id, price, status, created_at) VALUES ${values}`, params);
            const tickets = data.map((ticket, index) => new TicketModel(Object.assign(Object.assign({}, ticket), { created_at, id: result.insertId + index })));
            return tickets;
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [rows] = yield db.execute("SELECT * FROM tickets WHERE id = ?", [id]);
            return rows.length ? new TicketModel(rows[0]) : null;
        });
    }
    static findAll(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const db = (_a = options === null || options === void 0 ? void 0 : options.connection) !== null && _a !== void 0 ? _a : database_1.Database.getInstance();
            let query = "SELECT * FROM tickets";
            const params = [];
            if (filter && filter.where) {
                const where = [];
                if (filter.where.event_id) {
                    where.push("event_id = ?");
                    params.push(filter.where.event_id);
                }
                if (filter.where.ids) {
                    //using ? and params
                    where.push(`id IN (${filter.where.ids.map(() => "?").join(", ")})`);
                    params.push(...filter.where.ids);
                }
                query += ` WHERE ${where.join(" AND ")}`;
            }
            const [rows] = yield db.execute(query, params);
            return rows.map((row) => new TicketModel(row));
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [result] = yield db.execute("UPDATE tickets SET location = ?, event_id = ?, price = ?, status = ? WHERE id = ?", [this.location, this.event_id, this.price, this.status, this.id]);
            if (result.affectedRows === 0) {
                throw new Error("Ticket not found");
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [result] = yield db.execute("DELETE FROM tickets WHERE id = ?", [this.id]);
            if (result.affectedRows === 0) {
                throw new Error("Ticket not found");
            }
        });
    }
    fill(data) {
        if (data.id !== undefined)
            this.id = data.id;
        if (data.location !== undefined)
            this.location = data.location;
        if (data.event_id !== undefined)
            this.event_id = data.event_id;
        if (data.price !== undefined)
            this.price = data.price;
        if (data.status !== undefined)
            this.status = data.status;
        if (data.created_at !== undefined)
            this.created_at = data.created_at;
    }
}
exports.TicketModel = TicketModel;
