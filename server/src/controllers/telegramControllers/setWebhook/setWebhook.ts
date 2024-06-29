import { Request, Response } from "express";
import axios from "axios";

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export const setWebhook = async (req: Request, res: Response) => {
  const { webhookUrl } = req.body;

  if (!webhookUrl) {
    return res.status(400).send("Webhook URL is required");
  }

  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/setWebhook`, {
      url: webhookUrl,
    });

    if (response.data.ok) {
      return res.status(200).send("Webhook set successfully");
    } else {
      return res.status(500).send("Failed to set webhook");
    }
  } catch (error) {
    console.error("Error setting webhook:", error);
    return res.status(500).send("Error setting webhook");
  }
};
