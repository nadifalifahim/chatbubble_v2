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
export const setWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { webhookUrl } = req.body;
    if (!webhookUrl) {
        return res.status(400).send("Webhook URL is required");
    }
    try {
        const response = yield axios.post(`${TELEGRAM_API_URL}/setWebhook`, {
            url: webhookUrl,
        });
        if (response.data.ok) {
            return res.status(200).send("Webhook set successfully");
        }
        else {
            return res.status(500).send("Failed to set webhook");
        }
    }
    catch (error) {
        console.error("Error setting webhook:", error);
        return res.status(500).send("Error setting webhook");
    }
});
