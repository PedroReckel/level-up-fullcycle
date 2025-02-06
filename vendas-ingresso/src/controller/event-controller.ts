import { Router } from "express";
import { EventService } from "../services/event-service";

export const eventRoutes = Router();

eventRoutes.get("/", async (req, res) => {
        const eventService = new EventService();
        const result = await eventService.findAll(); 
    
        res.json(result);
});

eventRoutes.get("/:eventId", async (req, res) => { // Rota não funcionando corretamente
    const { eventId } = req.params;
    const eventService = new EventService();
    const event = await eventService.findByid(+eventId); // Pedir para o chatgpt me explicar essa parte
    
    if(!event) {
        res.status(404).json({message: "Event not found"});
    }

    res.json(event);
});