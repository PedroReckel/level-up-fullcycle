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
exports.eventRoutes = void 0;
const express_1 = require("express");
const event_service_1 = require("../services/event-service");
exports.eventRoutes = (0, express_1.Router)();
exports.eventRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventService = new event_service_1.EventService();
    const result = yield eventService.findAll();
    res.json(result);
}));
exports.eventRoutes.get("/:eventId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    const eventService = new event_service_1.EventService();
    const event = yield eventService.findByid(+eventId); // Pedir para o chatgpt me explicar essa parte
    if (!event) {
        res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
}));
