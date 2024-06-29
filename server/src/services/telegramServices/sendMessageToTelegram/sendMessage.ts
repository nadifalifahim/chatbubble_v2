import axios from "axios";

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export const sendMessageToTelegram = async (
  message: string,
  chatId: number
): Promise<boolean> => {
  try {
    console.log(message, chatId);
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      text: message,
      chat_id: chatId,
    });

    return response.data.ok;
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    return false;
  }
};
