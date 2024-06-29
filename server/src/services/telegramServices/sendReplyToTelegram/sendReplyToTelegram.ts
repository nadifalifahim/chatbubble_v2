import axios from "axios";

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export const sendReplyToTelegram = async (
  telegramChatId: number,
  message: string,
  messageId: number
): Promise<boolean> => {
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: telegramChatId,
      text: message,
      reply_to_message_id: messageId,
    });

    return response.data.ok;
  } catch (error) {
    console.error("Error sending reply to Telegram:", error);
    return false;
  }
};
