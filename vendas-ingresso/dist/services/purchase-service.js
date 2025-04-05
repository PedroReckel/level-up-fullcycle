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
exports.PurchaseService = void 0;
const purchase_model_1 = require("../models/purchase-model");
const ticket_model_1 = require("../models/ticket-model");
const purchase_ticket_model_1 = require("../models/purchase-ticket-model");
const customer_model_1 = require("../models/customer-model");
const reservation_ticket_model_1 = require("../models/reservation-ticket-model");
const database_1 = require("../database");
class PurchaseService {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield customer_model_1.CustomerModel.findById(data.customerId, {
                user: true, //eager loading
            });
            if (!customer) {
                throw new Error("Customer not found");
            }
            const tickets = yield ticket_model_1.TicketModel.findAll({
                where: { ids: data.ticketIds },
            });
            if (tickets.length !== data.ticketIds.length) {
                throw new Error("Some tickets not found");
            }
            if (tickets.some((t) => t.status !== ticket_model_1.TicketStatus.available)) {
                throw new Error("Some tickets are not available");
            }
            const amount = tickets.reduce((total, ticket) => total + ticket.price, 0);
            const db = database_1.Database.getInstance();
            const connection = yield db.getConnection();
            let purchase;
            try {
                yield connection.beginTransaction();
                purchase = yield purchase_model_1.PurchaseModel.create({
                    customer_id: data.customerId,
                    total_amount: amount,
                    status: purchase_model_1.PurchaseStatus.pending,
                }, { connection });
                yield this.associateTicketsWithPurchase(purchase.id, data.ticketIds, connection);
                yield connection.commit();
            }
            catch (error) {
                yield connection.rollback();
                throw error;
            }
            finally {
                connection.release();
            }
            try {
                yield connection.beginTransaction();
                purchase.status = purchase_model_1.PurchaseStatus.paid;
                yield purchase.update({ connection });
                yield reservation_ticket_model_1.ReservationTicketModel.create({
                    customer_id: data.customerId,
                    ticket_id: data.ticketIds[0],
                    status: reservation_ticket_model_1.ReservationStatus.reserved,
                }, { connection });
                yield this.paymentService.processPayment({
                    name: customer.user.name,
                    email: customer.user.email,
                    address: customer.address,
                    phone: customer.phone,
                }, purchase.total_amount, data.cardToken);
                yield connection.commit();
                return purchase.id;
            }
            catch (error) {
                yield connection.rollback();
                purchase.status = purchase_model_1.PurchaseStatus.error;
                yield purchase.update({ connection });
                throw error;
            }
            finally {
                connection.release();
            }
        });
    }
    associateTicketsWithPurchase(purchaseId, ticketIds, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchaseTickets = ticketIds.map((ticketId) => ({
                purchase_id: purchaseId,
                ticket_id: ticketId,
            }));
            yield purchase_ticket_model_1.PurchaseTicketModel.createMany(purchaseTickets, { connection });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return purchase_model_1.PurchaseModel.findById(id);
        });
    }
}
exports.PurchaseService = PurchaseService;
