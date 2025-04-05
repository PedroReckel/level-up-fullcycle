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
exports.UserModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../database");
class UserModel {
    constructor(data = {}) {
        this.fill(data);
    }
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const db = (_a = options === null || options === void 0 ? void 0 : options.connection) !== null && _a !== void 0 ? _a : database_1.Database.getInstance();
            const created_at = new Date();
            const hashedPassword = UserModel.hashPassword(data.password);
            const [result] = yield db.execute("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)", [data.name, data.email, hashedPassword, created_at]);
            const user = new UserModel(Object.assign(Object.assign({}, data), { password: hashedPassword, created_at, id: result.insertId }));
            return user;
        });
    }
    static hashPassword(password) {
        return bcrypt_1.default.hashSync(password, 10);
    }
    static comparePassword(password, hash) {
        return bcrypt_1.default.compareSync(password, hash);
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [rows] = yield db.execute("SELECT * FROM users WHERE id = ?", [id]);
            return rows.length ? new UserModel(rows[0]) : null;
        });
    }
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [rows] = yield db.execute("SELECT * FROM users WHERE email = ?", [email]);
            return rows.length ? new UserModel(rows[0]) : null;
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [rows] = yield db.execute("SELECT * FROM users");
            return rows.map((row) => new UserModel(row));
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [result] = yield db.execute("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", [this.name, this.email, this.password, this.id]);
            if (result.affectedRows === 0) {
                throw new Error("User not found");
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [result] = yield db.execute("DELETE FROM users WHERE id = ?", [this.id]);
            if (result.affectedRows === 0) {
                throw new Error("User not found");
            }
        });
    }
    fill(data) {
        if (data.id !== undefined)
            this.id = data.id;
        if (data.name !== undefined)
            this.name = data.name;
        if (data.email !== undefined)
            this.email = data.email;
        if (data.password !== undefined)
            this.password = data.password;
        if (data.created_at !== undefined)
            this.created_at = data.created_at;
    }
}
exports.UserModel = UserModel;
