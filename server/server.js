// Importing module
import express from "express";
import "dotenv/config";
import cors from "cors";
// Routes Import
import telegramRoutes from "../server/src/routes/telegramRoutes/telegramRoutes.js";
import projectRoutes from "../server/src/routes/portalRoutes/projectRoutes/projectRoutes.js";
import ticketRoutes from "../server/src/routes/portalRoutes/ticketRoutes/ticketRoutes.js";
import authRoutes from "../server/src/routes/authRoutes/authRoutes.js";
// Constants
const app = express();
const PORT = parseInt(process.env.PORT, 10) || 4000;
// CORS Config
const allowedOrigins = ["http://localhost:3000"];
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Enable credentials (cookies, etc.) to be sent
};
// Middlewares
app.use(express.json());
app.use(cors(corsOptions));
// Using the routes defined in the routes directory
app.get("/", (req, res) => {
    res.send("Working");
});
// Routes
app.use("/api/portal", projectRoutes);
app.use("/api/portal/tickets", ticketRoutes);
app.use("/api/telegram", telegramRoutes);
app.use("/api/auth", authRoutes);
// Server setup
app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
});
