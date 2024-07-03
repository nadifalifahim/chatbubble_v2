import { Router } from "express";
import { createProject } from "../../../controllers/portalControllers/projectControllers/createProject/createProject.js";
import { getProjects } from "../../../controllers/portalControllers/projectControllers/getProjects/getProjects.js";

const router = Router();
router.get("/projects", getProjects);
router.post("/projects", createProject);

export default router;
