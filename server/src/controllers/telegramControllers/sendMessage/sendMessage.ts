import { Request, Response } from "express";
import { sendMessageToTelegram } from "../../../services/telegramServices/sendMessageToTelegram/sendMessage.js";

export const sendMessage = async (req: Request, res: Response) => {
  const { chatId, message } = req.body;

  if (!message) {
    return res.status(400).send("Message is required");
  }

  try {
    const success = await sendMessageToTelegram(message, chatId);

    if (success) {
      return res.status(200).send("Message sent successfully");
    } else {
      return res.status(500).send("Failed to send message");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).send("Error sending message");
  }
};
