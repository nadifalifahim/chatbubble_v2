import { Request, Response } from "express";
import { getAttachmentDownloadLink } from "../../../utils/telegramUtils/getAttachmentDownloadLink/getAttachmentDownloadLink.js";

const downloadAttachment = async (req: Request, res: Response) => {
  const { attachmentId } = req.body;
  try {
    // Get file path
    const telegramFileUrl = await getAttachmentDownloadLink(attachmentId);
    if (telegramFileUrl) {
      // Log the received image URL and caption
      console.log(`Received image URL: ${telegramFileUrl}`);
      
      // Send the URL back to the client
      res.status(200).json({ url: telegramFileUrl });
    } else {
      console.error("Failed to get file URL from Telegram");
      console.error("Failed to get file URL from Telegram");
      res.status(500).json({ error: "Failed to get file URL from Telegram" });
    }
  } catch (error) {
    console.error("Error getting file URL:", error);
    console.error("Error getting file URL:", error);
    res.status(500).json({ error: "Error getting file URL" });
  }
};

export default downloadAttachment;
