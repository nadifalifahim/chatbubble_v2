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
import { sendReplyToTelegram } from "../../../services/telegramServices/sendReplyToTelegram/sendReplyToTelegram.js";
const ticketModel = new TicketModel();
export const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const telegramUpdate = req.body;
    console.log(telegramUpdate);
    if (!telegramUpdate.reply_to_message &&
        telegramUpdate.message &&
        (telegramUpdate.message.photo || telegramUpdate.message.document)) {
        const ticket = {
            message: telegramUpdate.message.caption,
            reportedBy: telegramUpdate.message.from.last_name !== ""
                ? `${telegramUpdate.message.from.first_name} ${telegramUpdate.message.from.last_name}`
                : telegramUpdate.message.from.first_name,
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
            // Attempt to create the ticket
            const ticketId = yield ticketModel.createTicket(ticket);
            const messageText = `Dear ${ticket.reportedBy},\n\nYour ticket has been raised.\n\nYour Ticket ID is: ${ticketId === null || ticketId === void 0 ? void 0 : ticketId.ticket_id}.\n\nFor getting updates on your ticket send a message in the following format:\n\n#Update: ${ticketId === null || ticketId === void 0 ? void 0 : ticketId.ticket_id}\n\nThank you.`;
            // Check if ticketID is returned successfully
            if (ticketId) {
                console.log("Ticket ID is", ticketId.ticket_id);
                yield sendReplyToTelegram(ticket.telegramChatId, messageText, ticket.telegramMessageId);
            }
            else {
                console.log("Ticket creation failed, no ID returned.");
            }
        }
        catch (error) {
            // Handle any errors that occur during the creation of the ticket
            console.error("Error creating ticket:", error);
        }
    }
    else if (!telegramUpdate.message.reply_to_message &&
        telegramUpdate.message) {
        const getRandomData = (data) => {
            return data[Math.floor(Math.random() * data.length)];
        };
        const ticket = {
            message: telegramUpdate.message.text,
            reportedBy: telegramUpdate.message.from.last_name !== ""
                ? `${telegramUpdate.message.from.first_name} ${telegramUpdate.message.from.last_name}`
                : telegramUpdate.message.from.first_name,
            platform: "Telegram",
            assignedTeamId: 1,
            categoryId: getRandomData([1, 3, 4]),
            projectId: "PROJ1",
            telegramUserId: telegramUpdate.message.from.id,
            telegramMessageId: telegramUpdate.message.message_id,
            telegramChatId: telegramUpdate.message.chat.id,
            telegramChatTitle: telegramUpdate.message.chat.title,
            status: "open",
            priority: getRandomData(["high", "low", "medium"]),
        };
        try {
            // Attempt to create the ticket
            const ticketId = yield ticketModel.createTicket(ticket);
            const messageText = `Dear ${ticket.reportedBy},\n\nYour ticket has been raised.\n\nYour Ticket ID is: ${ticketId === null || ticketId === void 0 ? void 0 : ticketId.ticket_id}.\n\nFor getting updates on your ticket send a message in the following format:\n\n#Update: ${ticketId === null || ticketId === void 0 ? void 0 : ticketId.ticket_id}\n\nThank you.`;
            // Check if ticketID is returned successfully
            if (ticketId) {
                console.log("Ticket ID is", ticketId.ticket_id);
                yield sendReplyToTelegram(ticket.telegramChatId, messageText, ticket.telegramMessageId);
            }
            else {
                console.log("Ticket creation failed, no ID returned.");
            }
        }
        catch (error) {
            // Handle any errors that occur during the creation of the ticket
            console.error("Error creating ticket:", error);
        }
    }
    // Respond with a 200 status to acknowledge receipt of the telegramUpdate
    res.sendStatus(200);
});
