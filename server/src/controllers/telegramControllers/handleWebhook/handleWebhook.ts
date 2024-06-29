import { Request, Response } from "express";
import { getAttachmentDownloadLink } from "../../../utils/telegramUtils/getAttachmentDownloadLink/getAttachmentDownloadLink.js";
import { TicketModel } from "../../../models/ticketModels/createTickets/createTickets.js";
import { sendReplyToTelegram } from "../../../services/telegramServices/sendReplyToTelegram/sendReplyToTelegram.js";

const ticketModel = new TicketModel();

export const handleWebhook = async (req: Request, res: Response) => {
  const telegramUpdate = req.body;
  console.log(telegramUpdate);

  if (
    !telegramUpdate.reply_to_message &&
    telegramUpdate.message &&
    (telegramUpdate.message.photo || telegramUpdate.message.document)
  ) {
    const ticket = {
      message: telegramUpdate.message.caption,
      reportedBy: `${telegramUpdate.message.from.first_name} ${telegramUpdate.message.from.last_name}`,
      platform: "Telegram",
      assignedTeamId: 1,
      categoryId: 1,
      projectId: "PROJ1",
      telegramUserId: telegramUpdate.message.from.id,
      telegramMessageId: telegramUpdate.message.message_id,
      telegramChatId: telegramUpdate.message.chat.id,
      telegramChatTitle: telegramUpdate.message.chat.title,
      status: "open",
      priority: "high",
      telegramAttachmentId: telegramUpdate.message.photo
        ? telegramUpdate.message.photo[telegramUpdate.message.photo.length - 1]
            .file_id
        : telegramUpdate.message.document.file_id,
    };

    try {
      // Get file path
      const telegramFileUrl = await getAttachmentDownloadLink(
        ticket.telegramAttachmentId
      );
      if (telegramFileUrl) {
        // Log the received image URL and caption
        console.log(
          `Received image URL: ${telegramFileUrl} from chat ID: ${ticket.telegramChatId}`
        );
        console.log(`Caption: ${ticket.message}`);
      } else {
        console.error("Failed to get file URL from Telegram");
      }
    } catch (error) {
      console.error("Error getting file URL:", error);
    }
  } else if (
    !telegramUpdate.message.reply_to_message &&
    telegramUpdate.message
  ) {
    const ticket = {
      message: telegramUpdate.message.text,
      reportedBy: `${telegramUpdate.message.from.first_name} ${telegramUpdate.message.from.last_name}`,
      platform: "Telegram",
      assignedTeamId: 1,
      categoryId: 1,
      projectId: "PROJ1",
      telegramUserId: telegramUpdate.message.from.id,
      telegramMessageId: telegramUpdate.message.message_id,
      telegramChatId: telegramUpdate.message.chat.id,
      telegramChatTitle: telegramUpdate.message.chat.title,
      status: "open",
      priority: "high",
    };

    try {
      // Attempt to create the ticket
      const ticketId = await ticketModel.createTicket(ticket);

      const messageText = `Dear ${ticket.reportedBy}, Your ticket has been raised.\n\nYour Ticket ID is: ${ticketId?.ticket_id}.\n\nFor getting updates on your ticket send a message in the following format:\n\n #Update: ${ticketId?.ticket_id}\n\nThank you.`;

      // Check if ticketID is returned successfully
      if (ticketId) {
        console.log("Ticket ID is", ticketId.ticket_id);
        await sendReplyToTelegram(
          ticket.telegramChatId,
          messageText,
          ticket.telegramMessageId
        );
      } else {
        console.log("Ticket creation failed, no ID returned.");
      }
    } catch (error) {
      // Handle any errors that occur during the creation of the ticket
      console.error("Error creating ticket:", error);
    }
  }

  // Respond with a 200 status to acknowledge receipt of the telegramUpdate
  res.sendStatus(200);
};
