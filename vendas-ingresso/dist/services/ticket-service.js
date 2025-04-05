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
exports.TicketService = void 0;
const event_model_1 = require("../models/event-model");
const ticket_model_1 = require("../models/ticket-model");
class TicketService {
    createMany(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield event_model_1.EventModel.findById(data.eventId);
            if (!event) {
                throw new Error('Event not Found');
            }
            const ticketsData = Array(data.numTickets)
                .fill({})
                .map((_, index) => ({
                location: `Location ${index}`,
                event_id: event.id,
                price: data.price,
                status: ticket_model_1.TicketStatus.available,
            }));
            yield ticket_model_1.TicketModel.createMany(ticketsData);
        });
    }
}
exports.TicketService = TicketService;
