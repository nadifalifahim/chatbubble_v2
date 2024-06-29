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
export const sendMessageToTelegram = (message, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(message, chatId);
        const response = yield axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
            text: message,
            chat_id: chatId,
        });
        return response.data.ok;
    }
    catch (error) {
        console.error("Error sending message to Telegram:", error);
        return false;
    }
});
