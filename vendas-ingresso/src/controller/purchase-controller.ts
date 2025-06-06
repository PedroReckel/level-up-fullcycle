import { Request, Response, Router } from "express";
import { PurchaseService } from "../services/purchase-service";
import { CustomerService } from "../services/customer-service";
import { PaymentService } from "../services/payment-service";

export const purchaseRoutes = Router();

purchaseRoutes.post("/", async (req: Request, res: Response) => {
  const customerService = new CustomerService();
  const customer = await customerService.findByUserId(req.user!.id);

  if(!customer){
    res.status(400).json({message: "User needs be a customer"})
    return;
  }

  const { ticket_ids, card_token } = req.body;
  //design pattern - factory | container de serviços
  const paymentService = new PaymentService()
  const purchaseService = new PurchaseService(paymentService);
  const newPurchaseId = await purchaseService.create({
    customerId: customer.id,
    ticketIds: ticket_ids,
    cardToken: card_token,
  });
  
  const purchase = await purchaseService.findById(newPurchaseId);

  res.status(201).json(purchase);
});