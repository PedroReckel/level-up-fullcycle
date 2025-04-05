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
exports.ticketRoutes = void 0;
const express_1 = require("express");
const ticket_service_1 = require("../services/ticket-service");
const partner_service_1 = require("../services/partner-service");
exports.ticketRoutes = (0, express_1.Router)();
exports.ticketRoutes.post('/:eventId/tickets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id; // O ! ele informa ao compilador que req.user nunca será null ou undefined.
    const partnerService = new partner_service_1.PartnerService();
    const partner = yield partnerService.findByUserId(userId);
    if (!partner) {
        res.status(403).json({ message: "Not authorized" });
        return;
    }
    const { num_tickets, price } = req.body;
    const { eventId } = req.params;
    const ticketService = new ticket_service_1.TicketService();
    yield ticketService.createMany({
        eventId: +eventId,
        numTickets: num_tickets,
        price,
    });
    res.status(204).send();
}));
exports.ticketRoutes.get('./:eventId/tickets', (req, res) => { });
exports.ticketRoutes.get('./:eventId/tickets/:ticketId', (req, res) => { });
