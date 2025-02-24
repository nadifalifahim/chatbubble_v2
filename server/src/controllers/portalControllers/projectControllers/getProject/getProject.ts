import { Request, Response } from "express";

import { ProjectModel } from "../../../../models/portalModels/projectsModels/createProjectsModel/createProjectsModel.js";

const projectModel = new ProjectModel();

export const getProject = async (
  req: Request<{ projectID: string }>,
  res: Response
) => {
  const { projectID } = req.params;
  try {
    const projectDetails = await projectModel.getProject(projectID);
    if (projectDetails) {
      res.status(201).json(projectDetails);
    } else {
      res.status(500).json({ error: "Failed to create project" });
    }
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Error creating project" });
  }
};
