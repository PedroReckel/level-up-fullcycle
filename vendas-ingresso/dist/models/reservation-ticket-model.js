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
exports.ReservationTicketModel = exports.ReservationStatus = void 0;
const database_1 = require("../database");
var ReservationStatus;
(function (ReservationStatus) {
    ReservationStatus["reserved"] = "reserved";
    ReservationStatus["cancelled"] = "cancelled";
})(ReservationStatus || (exports.ReservationStatus = ReservationStatus = {}));
class ReservationTicketModel {
    constructor(data = {}) {
        this.fill(data);
    }
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const db = (_a = options === null || options === void 0 ? void 0 : options.connection) !== null && _a !== void 0 ? _a : database_1.Database.getInstance();
            const reservation_date = new Date();
            const [result] = yield db.execute("INSERT INTO reservation_tickets (customer_id, ticket_id, status, reservation_date) VALUES (?, ?, ?, ?)", [data.customer_id, data.ticket_id, data.status, reservation_date]);
            const reservation = new ReservationTicketModel(Object.assign(Object.assign({}, data), { reservation_date, id: result.insertId }));
            return reservation;
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [rows] = yield db.execute("SELECT * FROM reservation_tickets WHERE id = ?", [id]);
            return rows.length
                ? new ReservationTicketModel(rows[0])
                : null;
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [rows] = yield db.execute("SELECT * FROM reservation_tickets");
            return rows.map((row) => new ReservationTicketModel(row));
        });
    }
    update(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const db = (_a = options === null || options === void 0 ? void 0 : options.connection) !== null && _a !== void 0 ? _a : database_1.Database.getInstance();
            const [result] = yield db.execute("UPDATE reservation_tickets SET customer_id = ?, ticket_id = ?, status = ? WHERE id = ?", [this.customer_id, this.ticket_id, this.status, this.id]);
            if (result.affectedRows === 0) {
                throw new Error("Reservation not found");
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getInstance();
            const [result] = yield db.execute("DELETE FROM reservation_tickets WHERE id = ?", [this.id]);
            if (result.affectedRows === 0) {
                throw new Error("Reservation not found");
            }
        });
    }
    fill(data) {
        if (data.id !== undefined)
            this.id = data.id;
        if (data.customer_id !== undefined)
            this.customer_id = data.customer_id;
        if (data.ticket_id !== undefined)
            this.ticket_id = data.ticket_id;
        if (data.reservation_date !== undefined)
            this.reservation_date = data.reservation_date;
        if (data.status !== undefined)
            this.status = data.status;
    }
}
exports.ReservationTicketModel = ReservationTicketModel;
