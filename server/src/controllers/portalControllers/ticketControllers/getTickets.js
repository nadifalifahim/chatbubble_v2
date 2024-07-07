var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TicketModel } from "../../../models/ticketModels/createTickets/createTickets.js";
const ticketModel = new TicketModel();
export const getTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to, projectID } = req.query;
    // Convert `from` and `to` to Date objects
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    const projectIDStr = projectID;
    // Debug dates
    console.log("From Date:", projectIDStr);
    try {
        // Validate the dates
        if (fromDate && isNaN(fromDate.getTime())) {
            return res.status(400).json({ error: "Invalid 'from' date format" });
        }
        if (toDate && isNaN(toDate.getTime())) {
            return res.status(400).json({ error: "Invalid 'to' date format" });
        }
        // Fetch tickets from the TicketModel
        const tickets = yield ticketModel.getTickets(fromDate, toDate, projectIDStr);
        res.status(200).json(tickets);
    }
    catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
