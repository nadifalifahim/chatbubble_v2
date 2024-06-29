var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAttachmentDownloadLink } from "../../../utils/telegramUtils/getAttachmentDownloadLink/getAttachmentDownloadLink.js";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
export const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const telegramUpdate = req.body;
    console.log(telegramUpdate);
    if (telegramUpdate.message &&
        (telegramUpdate.message.photo || telegramUpdate.message.document)) {
        const telegramChatId = telegramUpdate.message.chat.id;
        const message = telegramUpdate.message.caption;
        const platform = "Telegram";
        const telegramFileId = telegramUpdate.message.photo
            ? telegramUpdate.message.photo[telegramUpdate.message.photo.length - 1]
                .file_id
            : telegramUpdate.message.document.file_id;
        try {
            // Get file path
            const telegramFileUrl = yield getAttachmentDownloadLink(telegramFileId);
            if (telegramFileUrl) {
                // Log the received image URL and caption
                console.log(`Received image URL: ${telegramFileUrl} from chat ID: ${telegramChatId}`);
                console.log(`Caption: ${message}`);
            }
            else {
                console.error("Failed to get file URL from Telegram");
            }
        }
        catch (error) {
            console.error("Error getting file URL:", error);
        }
    }
    else if (telegramUpdate.message) {
        const telegramChatId = telegramUpdate.message.chat.id;
        const telegramMessageID = telegramUpdate.message.message_id;
        const message = telegramUpdate.message.text;
        const platform = "Telegram";
        const telegramChatGroupName = telegramUpdate.message.chat.title;
        const reportedBy = `${telegramUpdate.message.from.first_name} ${telegramUpdate.message.from.last_name}`;
        // Log the received message
        console.log(`Received message: ${message} from chat ID: ${telegramChatId}. By: ${reportedBy} Group: ${telegramChatGroupName} Message ID: ${telegramMessageID}`);
    }
    // Respond with a 200 status to acknowledge receipt of the telegramUpdate
    res.sendStatus(200);
});
