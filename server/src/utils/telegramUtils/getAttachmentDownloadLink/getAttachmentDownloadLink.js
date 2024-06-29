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
export function getAttachmentDownloadLink(fileId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios.get(`${TELEGRAM_API_URL}/getFile`, {
                params: {
                    file_id: fileId,
                },
            });
            if (response.data.ok) {
                const filePath = response.data.result.file_path;
                const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`;
                return fileUrl;
            }
            else {
                console.error("Failed to get file path from Telegram:", response.data);
                return null;
            }
        }
        catch (error) {
            console.error("Error getting file URL from Telegram:", error);
            return null;
        }
    });
}
