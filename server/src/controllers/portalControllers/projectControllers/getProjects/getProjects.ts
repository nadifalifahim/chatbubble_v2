import { Request, Response } from "express";

import { ProjectModel } from "../../../../models/portalModels/projectsModels/createProjectsModel/createProjectsModel.js";

const projectModel = new ProjectModel();

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await projectModel.getProjects();
    if (projects) {
      res.status(201).json(projects);
    } else {
      res.status(500).json({ error: "Failed to create project" });
    }
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Error creating project" });
  }
};
