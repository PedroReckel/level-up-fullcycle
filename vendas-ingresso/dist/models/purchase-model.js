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
exports.PurchaseModel = exports.PurchaseStatus = void 0;
const database_1 = require("../database");
var PurchaseStatus;
(function (PurchaseStatus) {
    PurchaseStatus["pending"] = "pending";
    PurchaseStatus["paid"] = "paid";
    PurchaseStatus["error"] = "error";
    PurchaseStatus["cancelled"] = "cancelled";
})(PurchaseStatus || (exports.PurchaseStatus = PurchaseStatus = {}));
class PurchaseModel {
    constructor(data = {}) {
        this.fill(data);
    }
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const db = (_a = options === null || options === void 0 ? void 0 : options.connection) !== null && _a !== void 0 ? _a : database_1.Database.getInstance();
            const purchase_date = new Date();
            const [result] = yield db.execute("INSERT INTO purchases (customer_id, total_amount, status, purchase_date) VALUES (?, ?, ?, ?)", [data.customer_id, data.total_amount, data.status, purchase_date]);
            const purchase = new PurchaseModel(Object.assign(Object.assign({}, data), { purchase_date, id: result.insertId }));
            return purchase;
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [rows] = yield db.execute("SELECT * FROM purchases WHERE id = ?", [id]);
            return rows.length ? new PurchaseModel(rows[0]) : null;
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [rows] = yield db.execute("SELECT * FROM purchases");
            return rows.map((row) => new PurchaseModel(row));
        });
    }
    update(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const db = (_a = options === null || options === void 0 ? void 0 : options.connection) !== null && _a !== void 0 ? _a : database_1.Database.getInstance();
            const [result] = yield db.execute("UPDATE purchases SET customer_id = ?, total_amount = ?, status = ? WHERE id = ?", [this.customer_id, this.total_amount, this.status, this.id]);
            if (result.affectedRows === 0) {
                throw new Error("Purchase not found");
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [result] = yield db.execute("DELETE FROM purchases WHERE id = ?", [this.id]);
            if (result.affectedRows === 0) {
                throw new Error("Purchase not found");
            }
        });
    }
    fill(data) {
        if (data.id !== undefined)
            this.id = data.id;
        if (data.customer_id !== undefined)
            this.customer_id = data.customer_id;
        if (data.purchase_date !== undefined)
            this.purchase_date = data.purchase_date;
        if (data.total_amount !== undefined)
            this.total_amount = data.total_amount;
        if (data.status !== undefined)
            this.status = data.status;
    }
}
exports.PurchaseModel = PurchaseModel;
