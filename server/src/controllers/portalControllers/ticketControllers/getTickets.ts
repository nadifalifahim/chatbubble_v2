import { Request, Response } from "express";
import { TicketModel } from "../../../models/ticketModels/createTickets/createTickets.js";

const ticketModel = new TicketModel();

export const getTickets = async (req: Request, res: Response) => {
  const { from, to, projectID } = req.query;

  // Convert `from` and `to` to Date objects
  const fromDate = from ? new Date(from as string) : null;
  const toDate = to ? new Date(to as string) : null;
  const projectIDStr = projectID as string;

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
    const tickets = await ticketModel.getTickets(
      fromDate,
      toDate,
      projectIDStr
    );
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
