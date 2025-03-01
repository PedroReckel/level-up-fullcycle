import { Router } from "express";
import { TicketService } from "../services/ticket-service";

export const ticketRoutes = Router();

ticketRoutes.post('/', async (req, res) => {
    const { num_tickets, price } = req.body;
    //@ts-expect-error - eventId is in app.ts
    const { eventId } = req.params;
    const ticketService = new TicketService();
    await ticketService.createMany({
        eventId,
        numTickets: num_tickets,
        price,
    });
    res.status(204).send();
})