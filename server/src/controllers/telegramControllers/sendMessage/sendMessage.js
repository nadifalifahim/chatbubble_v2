var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sendMessageToTelegram } from "../../../services/telegramServices/sendMessageToTelegram/sendMessage.js";
export const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, message } = req.body;
    if (!message) {
        return res.status(400).send("Message is required");
    }
    try {
        const success = yield sendMessageToTelegram(message, chatId);
        if (success) {
            return res.status(200).send("Message sent successfully");
        }
        else {
            return res.status(500).send("Failed to send message");
        }
    }
    catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).send("Error sending message");
    }
});
