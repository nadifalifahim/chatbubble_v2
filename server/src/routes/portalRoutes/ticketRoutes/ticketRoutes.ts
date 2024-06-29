import { Router } from "express";
import { getTickets } from "../../../controllers/portalControllers/ticketControllers/getTickets.js";
const router = Router();

router.get("/", getTickets);

export default router;
