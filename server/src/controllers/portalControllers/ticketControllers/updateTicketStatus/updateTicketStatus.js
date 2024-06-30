var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TicketModel } from "../../../../models/ticketModels/createTickets/createTickets.js";
export const updateTicketStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticketId, status } = req.body;
    console.log(ticketId, status);
    const ticketModel = new TicketModel();
    // Validate the request
    if (!ticketId || !status) {
        return res.status(400).json({ error: "Ticket ID and status are required" });
    }
    try {
        const success = yield ticketModel.updateTicketStatus(ticketId, status);
        if (success) {
            res.status(200).json({ message: "Ticket status updated successfully" });
        }
        else {
            res
                .status(404)
                .json({ error: "Ticket not found or status update failed" });
        }
    }
    catch (error) {
        console.error("Error updating ticket status:", error);
        res.status(500).json({ error: "Internal server error " });
    }
});
