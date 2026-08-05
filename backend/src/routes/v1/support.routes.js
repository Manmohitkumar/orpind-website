import { Router } from "express";
import { authenticate, validate, validateObjectId } from "../../middleware/index.js";
import { createTicket, addMessage } from "../../validators/support.validator.js";
import * as supportController from "../../controllers/support.controller.js";

const router = Router();

router.post("/tickets", authenticate, validate(createTicket), supportController.createTicket);
router.get("/tickets", authenticate, supportController.getTickets);
router.get("/tickets/:id", authenticate, validateObjectId, supportController.getTicketById);
router.post("/tickets/:id/messages", authenticate, validateObjectId, validate(addMessage), supportController.addMessage);

export default router;
