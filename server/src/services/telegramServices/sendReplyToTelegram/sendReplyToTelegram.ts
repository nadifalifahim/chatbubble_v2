import axios from "axios";

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export const sendReplyToTelegram = async (
  text: string,
  reply_to_message_id: number
): Promise<boolean> => {
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: text,
      reply_to_message_id: reply_to_message_id,
    });

    return response.data.ok;
  } catch (error) {
    console.error("Error sending reply to Telegram:", error);
    return false;
  }
};
