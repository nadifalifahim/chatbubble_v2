// Importing module
import express from "express";
import "dotenv/config";
import cors from "cors";

// Routes Import
import telegramRoutes from "../server/src/routes/telegramRoutes/telegramRoutes.js";
import projectRoutes from "../server/src/routes/portalRoutes/projectRoutes/projectRoutes.js";

// Constants
const app = express();
const PORT: Number = parseInt(process.env.PORT as string, 10) || 4000;

// Middlewares
app.use(express.json());
app.use(cors());

// Using the routes defined in the routes directory
app.get("/", (req, res) => {
  res.send("Working");
});

// Routes
app.use("/api/portal/projects", projectRoutes);
app.use("/api/telegram", telegramRoutes);

// Server setup
app.listen(PORT, () => {
  console.log("Server is listening on port http://localhost:" + PORT);
});
