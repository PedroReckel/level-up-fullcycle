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
exports.partnerRoutes = void 0;
const express_1 = require("express");
const partner_service_1 = require("../services/partner-service");
const event_service_1 = require("../services/event-service");
exports.partnerRoutes = (0, express_1.Router)();
exports.partnerRoutes.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, company_name } = req.body;
    const partnerService = new partner_service_1.PartnerService();
    const result = yield partnerService.register({
        name,
        email,
        password,
        company_name,
    });
    res.status(201).json(result);
}));
exports.partnerRoutes.post("/events", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, date, location } = req.body;
    const userId = req.user.id; // O ! ele informa ao compilador que req.user nunca será null ou undefined.
    const partnerService = new partner_service_1.PartnerService();
    const partner = yield partnerService.findByUserId(userId);
    if (!partner) {
        res.status(403).json({ message: "Not authorized" });
        return;
    }
    const eventService = new event_service_1.EventService();
    const result = yield eventService.create({
        name,
        description,
        date: new Date(date),
        location,
        partnerId: partner.id,
    });
    res.status(201).json(result);
}));
exports.partnerRoutes.get("/events", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id; // O ! ele informa ao compilador que req.user nunca será null ou undefined.
    const partnerService = new partner_service_1.PartnerService();
    const partner = yield partnerService.findByUserId(userId);
    if (!partner) {
        res.status(403).json({ message: "Not authorized" });
        return;
    }
    const eventService = new event_service_1.EventService();
    const result = yield eventService.findAll(partner.id);
    res.json(result);
}));
exports.partnerRoutes.get("/events/:eventId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    const userId = req.user.id; // O ! ele informa ao compilador que req.user nunca será null ou undefined.
    const partnerService = new partner_service_1.PartnerService();
    const partner = yield partnerService.findByUserId(userId);
    if (!partner) {
        res.status(403).json({ message: "Not authorized" });
        return;
    }
    const eventService = new event_service_1.EventService();
    const event = yield eventService.findByid(+eventId); // Pedir para o chatgpt me explicar essa parte
    if (!event || event.partner_id !== partner.id) {
        res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
}));
