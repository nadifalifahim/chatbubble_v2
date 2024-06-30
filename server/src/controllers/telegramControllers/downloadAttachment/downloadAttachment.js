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
const downloadAttachment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { attachmentId } = req.body;
    try {
        // Get file path
        const telegramFileUrl = yield getAttachmentDownloadLink(attachmentId);
        if (telegramFileUrl) {
            // Log the received image URL and caption
            console.log(`Received image URL: ${telegramFileUrl}`);
            // Send the URL back to the client
            res.status(200).json({ url: telegramFileUrl });
        }
        else {
            console.error("Failed to get file URL from Telegram");
            console.error("Failed to get file URL from Telegram");
            res.status(500).json({ error: "Failed to get file URL from Telegram" });
        }
    }
    catch (error) {
        console.error("Error getting file URL:", error);
        console.error("Error getting file URL:", error);
        res.status(500).json({ error: "Error getting file URL" });
    }
});
export default downloadAttachment;
