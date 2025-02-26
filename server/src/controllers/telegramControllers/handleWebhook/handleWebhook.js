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
import { sendMessageToTelegram } from "../../../services/telegramServices/sendMessageToTelegram/sendMessage.js";
import { ProjectModel } from "../../../models/portalModels/projectsModels/createProjectsModel/createProjectsModel.js";
const ticketModel = new TicketModel();
const projectModel = new ProjectModel();
export const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const telegramUpdate = req.body;
    console.log(telegramUpdate);
    const categoryKeywords = {
        otp: 1, // Example: OTP issues
        portal: 2, // Example: Password reset
        report: 3, // Example: Payment issues
        download: 3,
    };
    const getRandomData = (data) => {
        return data[Math.floor(Math.random() * data.length)];
    };
    // Function to determine category based on message content
    const determineCategory = (message = "") => {
        if (!message) {
            return getRandomData([5]); // Default category if message is missing
        }
        const lowerMessage = message.toLowerCase();
        for (const keyword in categoryKeywords) {
            if (lowerMessage.includes(keyword)) {
                return categoryKeywords[keyword]; // ✅ Return matched category
            }
        }
        return getRandomData([5]); // ✅ Default to random if no match
    };
    if (telegramUpdate.message && /#ChatID/.test(telegramUpdate.message.text)) {
        // Construct the reply message with ticket details
        const messageText = `Your chat id is: ${telegramUpdate.message.chat.id}`;
        // Send the reply to the user
        yield sendReplyToTelegram(telegramUpdate.message.chat.id, messageText, telegramUpdate.message.message_id);
    }
    else if (telegramUpdate.message &&
        /#Update:\s*(\d+)/.test(telegramUpdate.message.text)) {
        const match = telegramUpdate.message.text.match(/#Update:\s*(\d+)/);
        if (match && match[1]) {
            const ticketId = match[1]; // Extracted ticket ID
            const ticket = yield ticketModel.getTicket(ticketId);
            console.log(ticket);
            if (ticket) {
                // Construct the reply message with ticket details
                const messageText = `Dear ${ticket.reported_by},\n\nPlease find your ticket details below:\n\nTicket ID: ${ticket.ticket_id}\nStatus: ${ticket.ticket_status.toLocaleUpperCase()}\nPriority: ${ticket.priority.toLocaleUpperCase()}\nTeam: ${ticket.team_name}\n\nThank you for reaching out to us.`;
                // Send the reply to the user
                yield sendReplyToTelegram(telegramUpdate.message.chat.id, messageText, telegramUpdate.message.message_id);
            }
            else {
                console.log(`No ticket found with ID: ${ticketId}`);
            }
        }
    }
    else if (!telegramUpdate.reply_to_message &&
        telegramUpdate.message &&
        (telegramUpdate.message.photo || telegramUpdate.message.document)) {
        const projectID = yield projectModel.getProjectsByTelegramChatID(telegramUpdate.message.chat.id);
        const ticket = {
            message: telegramUpdate.message.caption || "",
            reportedBy: `${telegramUpdate.message.from.first_name || ""}${telegramUpdate.message.from.last_name
                ? ` ${telegramUpdate.message.from.last_name}`
                : ""}`,
            platform: "Telegram",
            assignedTeamId: 1,
            categoryId: determineCategory(telegramUpdate.message.text || telegramUpdate.message.caption),
            projectId: `${projectID === null || projectID === void 0 ? void 0 : projectID.project_id}`,
            telegramUserId: telegramUpdate.message.from.id,
            telegramMessageId: telegramUpdate.message.message_id,
            telegramChatId: telegramUpdate.message.chat.id,
            telegramChatTitle: telegramUpdate.message.chat.title,
            status: "open",
            priority: getRandomData(["high", "low", "medium"]),
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
    else if (!telegramUpdate.reply_to_message && telegramUpdate.message) {
        const getRandomData = (data) => {
            return data[Math.floor(Math.random() * data.length)];
        };
        const projectID = yield projectModel.getProjectsByTelegramChatID(telegramUpdate.message.chat.id);
        if (projectID) {
            console.log(projectID.project_id);
        }
        // Function to determine category based on message content
        const determineCategory = (message = "") => {
            const lowerMessage = message.toLowerCase();
            for (const keyword in categoryKeywords) {
                if (lowerMessage.includes(keyword)) {
                    return categoryKeywords[keyword]; // ✅ Return matched category
                }
            }
            return getRandomData([5]); // ✅ Default to random if no match
        };
        const ticket = {
            message: telegramUpdate.message.text,
            reportedBy: `${telegramUpdate.message.from.first_name || ""}${telegramUpdate.message.from.last_name
                ? ` ${telegramUpdate.message.from.last_name}`
                : ""}`,
            platform: "Telegram",
            assignedTeamId: 1,
            categoryId: determineCategory(telegramUpdate.message.text),
            projectId: `${projectID === null || projectID === void 0 ? void 0 : projectID.project_id}`,
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
            const messageText1 = `Dear ${ticket.reportedBy},\n\nYour ticket has been raised.\n\nYour Ticket ID is: ${ticketId === null || ticketId === void 0 ? void 0 : ticketId.ticket_id}.\n\nFor getting updates on your ticket send a message in the following format:`;
            const messageText2 = `#Update: ${ticketId === null || ticketId === void 0 ? void 0 : ticketId.ticket_id}\n\n`;
            // Check if ticketID is returned successfully
            if (ticketId) {
                console.log("Ticket ID is", ticketId.ticket_id);
                yield sendReplyToTelegram(ticket.telegramChatId, messageText1, ticket.telegramMessageId);
                yield sendMessageToTelegram(messageText2, ticket.telegramChatId);
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
