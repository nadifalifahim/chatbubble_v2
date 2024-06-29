import axios from "axios";

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export async function getAttachmentDownloadLink(
  fileId: string
): Promise<string | null> {
  try {
    const response = await axios.get(`${TELEGRAM_API_URL}/getFile`, {
      params: {
        file_id: fileId,
      },
    });

    if (response.data.ok) {
      const filePath = response.data.result.file_path;
      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`;
      return fileUrl;
    } else {
      console.error("Failed to get file path from Telegram:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error getting file URL from Telegram:", error);
    return null;
  }
}
