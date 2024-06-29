import { Request, Response } from "express";
import { sendReplyToTelegram } from "../../../services/telegramServices/sendReplyToTelegram/sendReplyToTelegram.js";

export const sendReply = async (req: Request, res: Response) => {
  const { message, messageId, telegramChatId } = req.body;

  if (!message || !messageId) {
    return res.status(400).send("Message and reply_to_message_id are required");
  }

  try {
    const success = await sendReplyToTelegram(
      message,
      messageId,
      telegramChatId
    );

    if (success) {
      return res.status(200).send("Reply sent successfully");
    } else {
      return res.status(500).send("Failed to send reply");
    }
  } catch (error) {
    console.error("Error sending reply:", error);
    return res.status(500).send("Error sending reply");
  }
};
