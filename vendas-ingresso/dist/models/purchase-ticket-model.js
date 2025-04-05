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
exports.PurchaseTicketModel = void 0;
const database_1 = require("../database");
class PurchaseTicketModel {
    constructor(data = {}) {
        this.fill(data);
    }
    fill(data) {
        var _a, _b, _c;
        this.id = (_a = data.id) !== null && _a !== void 0 ? _a : 0;
        this.purchase_id = (_b = data.purchase_id) !== null && _b !== void 0 ? _b : 0;
        this.ticket_id = (_c = data.ticket_id) !== null && _c !== void 0 ? _c : 0;
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [result] = yield db.execute("INSERT INTO purchase_tickets (purchase_id, ticket_id) VALUES (?, ?)", [data.purchase_id, data.ticket_id]);
            const purchaseTicket = new PurchaseTicketModel(Object.assign(Object.assign({}, data), { id: result.insertId }));
            return purchaseTicket;
        });
    }
    static createMany(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const db = (_a = options === null || options === void 0 ? void 0 : options.connection) !== null && _a !== void 0 ? _a : database_1.Database.getInstance();
            const params = data.reduce((acc, ticket) => [...acc, ticket.purchase_id, ticket.ticket_id], []);
            const values = Array(data.length).fill("(?, ?)").join(", ");
            const [result] = yield db.execute(`INSERT INTO purchase_tickets (purchase_id, ticket_id) VALUES ${values}`, params);
            return data.map((ticket, index) => new PurchaseTicketModel(Object.assign(Object.assign({}, ticket), { id: result.insertId + index })));
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [rows] = yield db.execute("SELECT * FROM purchase_tickets WHERE id = ?", [id]);
            return rows.length
                ? new PurchaseTicketModel(rows[0])
                : null;
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [rows] = yield db.execute("SELECT * FROM purchase_tickets");
            return rows.map((row) => new PurchaseTicketModel(row));
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [result] = yield db.execute("UPDATE purchase_tickets SET purchase_id = ?, ticket_id = ? WHERE id = ?", [this.purchase_id, this.ticket_id, this.id]);
            if (result.affectedRows === 0) {
                throw new Error("Purchase ticket not found");
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [result] = yield db.execute("DELETE FROM purchase_tickets WHERE id = ?", [this.id]);
            if (result.affectedRows === 0) {
                throw new Error("Purchase ticket not found");
            }
        });
    }
}
exports.PurchaseTicketModel = PurchaseTicketModel;
