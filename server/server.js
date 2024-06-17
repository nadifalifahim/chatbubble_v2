// Importing module
import express from "express";
import "dotenv/config";
const app = express();
app.use(express.json());
const PORT = parseInt(process.env.PORT, 10) || 4000;
// Telegram Bot Configuration
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
// Handling GET / Request
app.get("/", (req, res) => {
    res.send("Welcome to typescript backend!");
});
// Server setup
app.listen(PORT, () => {
    console.log("Server is listening on port http://localhost:" + PORT);
});
