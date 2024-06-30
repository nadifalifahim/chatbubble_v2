import { Router } from "express";
import { sendMessage } from "../../controllers/telegramControllers/sendMessage/sendMessage.js";
import { setWebhook } from "../../controllers/telegramControllers/setWebhook/setWebhook.js";
import { handleWebhook } from "../../controllers/telegramControllers/handleWebhook/handleWebhook.js";
import { sendReply } from "../../controllers/telegramControllers/sendReply/sendReply.js";
import downloadAttachment from "../../controllers/telegramControllers/downloadAttachment/downloadAttachment.js";
const router = Router();
router.post("/set-webhook", setWebhook);
router.post("/webhook", handleWebhook);
router.post("/message", sendMessage);
router.post("/reply", sendReply);
router.post("/download-attachment", downloadAttachment);
export default router;
