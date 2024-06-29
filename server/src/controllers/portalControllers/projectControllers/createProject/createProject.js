var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ProjectModel, } from "../../../../models/portalModels/projectsModels/createProjectsModel/createProjectsModel.js";
const projectModel = new ProjectModel();
export const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { project_name, project_description } = req.body;
    if (!project_name) {
        res.status(400).json({ error: "Project name is required" });
        return;
    }
    const newProject = {
        project_name,
        project_description,
    };
    try {
        const createdProject = yield projectModel.createProject(newProject);
        if (createdProject) {
            res.status(201).json(createdProject);
        }
        else {
            res.status(500).json({ error: "Failed to create project" });
        }
    }
    catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: "Error creating project" });
    }
});
