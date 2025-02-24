import { Router } from "express";
import { createProject } from "../../../controllers/portalControllers/projectControllers/createProject/createProject.js";
import { getProjects } from "../../../controllers/portalControllers/projectControllers/getProjects/getProjects.js";
import { getProject } from "../../../controllers/portalControllers/projectControllers/getProject/getProject.js";
const router = Router();
router.get("/projects", getProjects);
router.post("/projects", createProject);
router.get("/projects/:projectID", getProject);
export default router;
