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
import { ProjectModel } from "../../../models/portalModels/projectsModels/createProjectsModel/createProjectsModel.js";
const ticketModel = new TicketModel();
const projectModel = new ProjectModel();
const categoryKeywords = {
    otp: 1,
    portal: 2,
    report: 3,
    download: 3,
};
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const determineCategory = (message = "") => {
    if (!message)
        return getRandomElement([5]);
    const lowerMessage = message.toLowerCase();
    return Object.keys(categoryKeywords).find((keyword) => lowerMessage.includes(keyword))
        ? categoryKeywords[Object.keys(categoryKeywords).find((keyword) => lowerMessage.includes(keyword))]
        : getRandomElement([5]);
};
const extractTicketIdFromMessage = (message, regex) => {
    const match = message.match(regex);
    return match && match[1] ? match[1] : null;
};
const createAndRespondToTicket = (telegramUpdate, messageText) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const projectID = yield projectModel.getProjectsByTelegramChatID(telegramUpdate.message.chat.id);
    const ticket = {
        message: telegramUpdate.message.text || telegramUpdate.message.caption || "",
        reportedBy: `${telegramUpdate.message.from.first_name || ""} ${telegramUpdate.message.from.last_name || ""}`.trim(),
        platform: "Telegram",
        assignedTeamId: 1,
        categoryId: determineCategory(telegramUpdate.message.text || telegramUpdate.message.caption),
        projectId: String(projectID === null || projectID === void 0 ? void 0 : projectID.project_id),
        telegramUserId: telegramUpdate.message.from.id,
        telegramMessageId: telegramUpdate.message.message_id,
        telegramChatId: telegramUpdate.message.chat.id,
        telegramChatTitle: telegramUpdate.message.chat.title || "",
        status: "open",
        priority: getRandomElement(["high", "low", "medium"]),
        telegramAttachmentId: telegramUpdate.message.photo
            ? telegramUpdate.message.photo.slice(-1)[0].file_id
            : (_a = telegramUpdate.message.document) === null || _a === void 0 ? void 0 : _a.file_id,
    };
    try {
        const ticketId = yield ticketModel.createTicket(ticket);
        if (ticketId) {
            const replyText = `Dear ${ticket.reportedBy},\n\nYour ticket has been raised.\n\nYour Ticket ID is: ${ticketId.ticket_id}.\n\nFor updates, send:\n\n#Update: ${ticketId.ticket_id}\n\nThank you.`;
            yield sendReplyToTelegram(ticket.telegramChatId, replyText, ticket.telegramMessageId);
        }
        else {
            console.error("Ticket creation failed, no ID returned.");
        }
    }
    catch (error) {
        console.error("Error creating ticket:", error);
    }
});
export const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const telegramUpdate = req.body;
    console.log(telegramUpdate);
    if (!telegramUpdate.message)
        return res.sendStatus(200);
    const messageText = telegramUpdate.message.text;
    const chatId = telegramUpdate.message.chat.id;
    const messageId = telegramUpdate.message.message_id;
    // Filter out events related to users joining or leaving
    if (telegramUpdate.message.new_chat_members ||
        telegramUpdate.message.left_chat_member ||
        telegramUpdate.message.chat_member) {
        return res.sendStatus(200);
    }
    // Ensure valid message content before processing
    if (!messageText &&
        !telegramUpdate.message.caption &&
        !telegramUpdate.message.photo &&
        !telegramUpdate.message.document) {
        return res.sendStatus(200);
    }
    if (/^#ChatID$/.test(messageText)) {
        yield sendReplyToTelegram(chatId, `Your chat ID is: ${chatId}`, messageId);
    }
    else if (/^#Update:\s*(\d+)/.test(messageText)) {
        const ticketId = extractTicketIdFromMessage(messageText, /#Update:\s*(\d+)/);
        if (ticketId) {
            const ticket = yield ticketModel.getTicket(ticketId);
            if (ticket) {
                const replyText = `Dear ${ticket.reported_by},\n\nYour ticket details:\n\nTicket ID: ${ticket.ticket_id}\nStatus: ${ticket.ticket_status.toUpperCase()}\nPriority: ${ticket.priority.toUpperCase()}\nTeam: ${ticket.team_name}\n\nThank you.`;
                yield sendReplyToTelegram(chatId, replyText, messageId);
            }
            else {
                console.log(`No ticket found with ID: ${ticketId}`);
            }
        }
    }
    else {
        yield createAndRespondToTicket(telegramUpdate, messageText);
    }
    res.sendStatus(200);
});
