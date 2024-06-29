import { Router } from "express";
import { createProject } from "../../../controllers/portalControllers/projectControllers/createProject/createProject.js";
const router = Router();
router.post("/create-project", createProject);
export default router;
