import { EventModel } from "../models/event-model";
import { TicketModel, TicketStatus } from "../models/ticket-model";

export class TicketService {

    async createMany(data: {
        eventId: number,
        numTickets: number,
        price: number;
    }) {
        const event = EventModel.findById(data.eventId);

        if (!event) {
            throw new Error('Event not Found');
        }

        const TicketsData = Array(data.numTickets)
            .fill({})
            .map((_, index) => ({
                location: `Location ${index}`,
                event_id: data.eventId,
                price: data.price,
                status: TicketStatus.available,
            }));

        await TicketModel.createMany(TicketsData)
    }
}