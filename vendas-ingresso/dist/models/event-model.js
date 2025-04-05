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
exports.EventModel = void 0;
const database_1 = require("../database");
class EventModel {
    constructor(data = {}) {
        this.fill(data);
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const created_at = new Date();
            const [result] = yield db.execute("INSERT INTO events (name, description, date, location, created_at, partner_id) VALUES (?, ?, ?, ?, ?, ?)", [
                data.name,
                data.description,
                data.date,
                data.location,
                created_at,
                data.partner_id,
            ]);
            const event = new EventModel(Object.assign(Object.assign({}, data), { created_at, id: result.insertId }));
            return event;
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [rows] = yield db.execute("SELECT * FROM events WHERE id = ?", [id]);
            return rows.length ? new EventModel(rows[0]) : null;
        });
    }
    static findAll(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            let query = "SELECT * FROM events";
            const params = [];
            if (filter && filter.where) {
                if (filter.where.partner_id) {
                    query += " WHERE partner_id = ?";
                    params.push(filter.where.partner_id);
                }
            }
            const [rows] = yield db.execute(query, params);
            return rows.map((row) => new EventModel(row));
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [result] = yield db.execute("UPDATE events SET name = ?, description = ?, date = ?, location = ?, partner_id = ? WHERE id = ?", [
                this.name,
                this.description,
                this.date,
                this.location,
                this.partner_id,
                this.id,
            ]);
            if (result.affectedRows === 0) {
                throw new Error("Event not found");
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [result] = yield db.execute("DELETE FROM events WHERE id = ?", [this.id]);
            if (result.affectedRows === 0) {
                throw new Error("Event not found");
            }
        });
    }
    fill(data) {
        if (data.id !== undefined)
            this.id = data.id;
        if (data.name !== undefined)
            this.name = data.name;
        if (data.description !== undefined)
            this.description = data.description;
        if (data.date !== undefined)
            this.date = data.date;
        if (data.location !== undefined)
            this.location = data.location;
        if (data.created_at !== undefined)
            this.created_at = data.created_at;
        if (data.partner_id !== undefined)
            this.partner_id = data.partner_id;
    }
}
exports.EventModel = EventModel;
