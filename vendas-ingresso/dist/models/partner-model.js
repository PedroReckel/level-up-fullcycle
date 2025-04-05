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
exports.PartnerModel = void 0;
const database_1 = require("../database");
const user_model_1 = require("./user-model");
class PartnerModel {
    constructor(data = {}) {
        this.fill(data);
    }
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const db = (_a = options === null || options === void 0 ? void 0 : options.connection) !== null && _a !== void 0 ? _a : database_1.Database.getInstance();
            const created_at = new Date();
            const [result] = yield db.execute("INSERT INTO partners (user_id, company_name, created_at) VALUES (?, ?, ?)", [data.user_id, data.company_name, created_at]);
            const partner = new PartnerModel(Object.assign(Object.assign({}, data), { created_at, id: result.insertId }));
            return partner;
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            let query = "SELECT * FROM partners WHERE id = ?";
            if (options === null || options === void 0 ? void 0 : options.user) {
                query =
                    "SELECT p.*, users.id as user_id, users.name as user_name, users.email as user_email FROM partners p JOIN users ON p.user_id = users.id WHERE p.id = ?";
            }
            const [rows] = yield db.execute(query, [id]);
            if (rows.length === 0)
                return null;
            const partner = new PartnerModel(rows[0]);
            if (options === null || options === void 0 ? void 0 : options.user) {
                partner.user = new user_model_1.UserModel({
                    id: rows[0].user_id,
                    name: rows[0].user_name,
                    email: rows[0].user_email,
                });
            }
            return partner;
        });
    }
    static findByUserId(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            let query = "SELECT * FROM partners WHERE user_id = ?";
            if (options === null || options === void 0 ? void 0 : options.user) {
                query =
                    "SELECT p.*, users.id as user_id, users.name as user_name, users.email as user_email FROM partners p JOIN users ON p.user_id = users.id WHERE p.user_id = ?";
            }
            const [rows] = yield db.execute(query, [userId]);
            if (rows.length === 0)
                return null;
            const partner = new PartnerModel(rows[0]);
            if (options === null || options === void 0 ? void 0 : options.user) {
                partner.user = new user_model_1.UserModel({
                    id: rows[0].user_id,
                    name: rows[0].user_name,
                    email: rows[0].user_email,
                });
            }
            return partner;
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [rows] = yield db.execute("SELECT * FROM partners");
            return rows.map((row) => new PartnerModel(row));
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [result] = yield db.execute("UPDATE partners SET user_id = ?, company_name = ? WHERE id = ?", [this.user_id, this.company_name, this.id]);
            if (result.affectedRows === 0) {
                throw new Error("Partner not found");
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [result] = yield db.execute("DELETE FROM partners WHERE id = ?", [this.id]);
            if (result.affectedRows === 0) {
                throw new Error("Partner not found");
            }
        });
    }
    fill(data) {
        if (data.id !== undefined)
            this.id = data.id;
        if (data.user_id !== undefined)
            this.user_id = data.user_id;
        if (data.company_name !== undefined)
            this.company_name = data.company_name;
        if (data.created_at !== undefined)
            this.created_at = data.created_at;
    }
}
exports.PartnerModel = PartnerModel;
