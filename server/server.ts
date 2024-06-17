// Importing module
import express from "express";
import "dotenv/config";
import axios from "axios";

const app = express();
app.use(express.json());

const PORT: Number = parseInt(process.env.PORT as string, 10) || 4000;

// Telegram Bot Configuration
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;

// Handling GET / Request
app.get("/", (req, res) => {
  res.send("Welcome to typescript backend!");
});

app.post("/send-message", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send("Message is required");
  }

  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
    });

    if (response.data.ok) {
      return res.status(200).send("Message sent successfully");
    } else {
      return res.status(500).send("Failed to send message");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).send("Error sending message");
  }
});

// Server setup
app.listen(PORT, () => {
  console.log("Server is listening on port http://localhost:" + PORT);
});
