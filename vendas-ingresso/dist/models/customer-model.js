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
exports.CustomerModel = void 0;
const database_1 = require("../database");
const user_model_1 = require("./user-model");
class CustomerModel {
    constructor(data = {}) {
        this.fill(data);
    }
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const db = (_a = options === null || options === void 0 ? void 0 : options.connection) !== null && _a !== void 0 ? _a : database_1.Database.getInstance();
            const created_at = new Date();
            const [result] = yield db.execute("INSERT INTO customers (user_id, address, phone, created_at) VALUES (?, ?, ?, ?)", [data.user_id, data.address, data.phone, created_at]);
            const customer = new CustomerModel(Object.assign(Object.assign({}, data), { created_at, id: result.insertId }));
            return customer;
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            let query = "SELECT * FROM customers WHERE id = ?";
            if (options === null || options === void 0 ? void 0 : options.user) {
                query =
                    "SELECT c.*, users.id as user_id, users.name as user_name, users.email as user_email FROM customers c JOIN users ON c.user_id = users.id WHERE c.id = ?";
            }
            const [rows] = yield db.execute(query, [id]);
            if (rows.length === 0)
                return null;
            const customer = new CustomerModel(rows[0]);
            if (options === null || options === void 0 ? void 0 : options.user) {
                customer.user = new user_model_1.UserModel({
                    id: rows[0].user_id,
                    name: rows[0].user_name,
                    email: rows[0].user_email,
                });
            }
            return customer;
        });
    }
    static findByUserId(user_id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            let query = "SELECT * FROM customers WHERE user_id = ?";
            if (options === null || options === void 0 ? void 0 : options.user) {
                query =
                    "SELECT c.*, users.id as user_id, users.name as user_name, users.email as user_email FROM customers c JOIN users ON c.user_id = users.id WHERE c.user_id = ?";
            }
            const [rows] = yield db.execute(query, [user_id]);
            if (rows.length === 0)
                return null;
            const customer = new CustomerModel(rows[0]);
            if (options === null || options === void 0 ? void 0 : options.user) {
                customer.user = new user_model_1.UserModel({
                    id: rows[0].user_id,
                    name: rows[0].user_name,
                    email: rows[0].user_email,
                });
            }
            return customer;
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [rows] = yield db.execute("SELECT * FROM customers");
            return rows.map((row) => new CustomerModel(row));
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [result] = yield db.execute("UPDATE customers SET user_id = ?, address = ?, phone = ? WHERE id = ?", [this.user_id, this.address, this.phone, this.id]);
            if (result.affectedRows === 0) {
                throw new Error("Customer not found");
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [result] = yield db.execute("DELETE FROM customers WHERE id = ?", [this.id]);
            if (result.affectedRows === 0) {
                throw new Error("Customer not found");
            }
        });
    }
    fill(data) {
        if (data.id !== undefined)
            this.id = data.id;
        if (data.user_id !== undefined)
            this.user_id = data.user_id;
        if (data.address !== undefined)
            this.address = data.address;
        if (data.phone !== undefined)
            this.phone = data.phone;
        if (data.created_at !== undefined)
            this.created_at = data.created_at;
    }
}
exports.CustomerModel = CustomerModel;
