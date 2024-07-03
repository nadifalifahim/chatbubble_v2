var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ProjectModel } from "../../../../models/portalModels/projectsModels/createProjectsModel/createProjectsModel.js";
const projectModel = new ProjectModel();
export const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield projectModel.getProjects();
        if (projects) {
            res.status(201).json(projects);
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
