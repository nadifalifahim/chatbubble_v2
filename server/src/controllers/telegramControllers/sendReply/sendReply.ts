import { Request, Response } from "express";
import { sendReplyToTelegram } from "../../../services/telegramServices/sendReplyToTelegram/sendReplyToTelegram.js";

export const sendReply = async (req: Request, res: Response) => {
  const { message, reply_to_message_id } = req.body;

  if (!message || !reply_to_message_id) {
    return res.status(400).send("Message and reply_to_message_id are required");
  }

  try {
    const success = await sendReplyToTelegram(message, reply_to_message_id);

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
