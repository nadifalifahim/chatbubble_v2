import { Request, Response } from "express";
import { TicketModel } from "../../../../models/ticketModels/createTickets/createTickets.js";

export const updateTicketStatus = async (req: Request, res: Response) => {
  const { ticketId, status } = req.body;
  console.log(ticketId, status);
  const ticketModel = new TicketModel();

  // Validate the request
  if (!ticketId || !status) {
    return res.status(400).json({ error: "Ticket ID and status are required" });
  }

  try {
    const success = await ticketModel.updateTicketStatus(ticketId, status);
    if (success) {
      res.status(200).json({ message: "Ticket status updated successfully" });
    } else {
      res
        .status(404)
        .json({ error: "Ticket not found or status update failed" });
    }
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ error: "Internal server error " });
  }
};
