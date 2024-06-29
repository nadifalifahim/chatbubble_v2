import { Request, Response } from "express";
import {
  ProjectModel,
  Project,
} from "../../../../models/portalModels/projectsModels/createProjectsModel/createProjectsModel.js";

const projectModel = new ProjectModel();

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { project_name, project_description } = req.body;

  if (!project_name) {
    res.status(400).json({ error: "Project name is required" });
    return;
  }

  const newProject: Project = {
    project_name,
    project_description,
  };

  try {
    const createdProject = await projectModel.createProject(newProject);
    if (createdProject) {
      res.status(201).json(createdProject);
    } else {
      res.status(500).json({ error: "Failed to create project" });
    }
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Error creating project" });
  }
};
