var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sendReplyToTelegram } from "../../../services/telegramServices/sendReplyToTelegram/sendReplyToTelegram.js";
export const sendReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, reply_to_message_id } = req.body;
    if (!message || !reply_to_message_id) {
        return res.status(400).send("Message and reply_to_message_id are required");
    }
    try {
        const success = yield sendReplyToTelegram(message, reply_to_message_id);
        if (success) {
            return res.status(200).send("Reply sent successfully");
        }
        else {
            return res.status(500).send("Failed to send reply");
        }
    }
    catch (error) {
        console.error("Error sending reply:", error);
        return res.status(500).send("Error sending reply");
    }
});
