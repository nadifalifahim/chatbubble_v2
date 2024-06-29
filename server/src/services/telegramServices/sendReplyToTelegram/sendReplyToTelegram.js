var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
export const sendReplyToTelegram = (text, reply_to_message_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: text,
            reply_to_message_id: reply_to_message_id,
        });
        return response.data.ok;
    }
    catch (error) {
        console.error("Error sending reply to Telegram:", error);
        return false;
    }
});
