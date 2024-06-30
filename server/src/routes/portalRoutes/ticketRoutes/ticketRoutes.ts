import { Router } from "express";
import { getTickets } from "../../../controllers/portalControllers/ticketControllers/getTickets.js";
import { updateTicketStatus } from "../../../controllers/portalControllers/ticketControllers/updateTicketStatus/updateTicketStatus.js";
const router = Router();

router.get("/", getTickets);
router.post("/update-status", updateTicketStatus);

export default router;
