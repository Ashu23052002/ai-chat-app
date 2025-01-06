import * as projectService from "../services/project.service.js";
import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import projectModel from "../models/project.model.js";

export const createProjectController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name } = req.body;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const userId = loggedInUser._id;

    const newProject = await projectService.createProject({ name, userId });
    res.status(201).json(newProject);
  } catch (e) {
    console.log("Error in project.controller.js: ", e);
    return res.status(400).json({ error: e.message });
  }
};

export const getAllProject = async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const userId = loggedInUser._id;

    const projects = await projectService.getAllProjectByUserId({
      userId: loggedInUser._id,
    });
    return res.status(200).json({ projects: projects });
  } catch (e) {
    console.log("Error in project.controller.js: ", e);
    return res.status(400).json({ error: e.message });
  }
};

export const addUserToProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, users } = req.body;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }
  //  console.log("projectid2 -> ",projectId);
    const project = await projectService.addUserToProject({
      projectId,
      users,
      userId: loggedInUser._id,
    });
  //  console.log("project -> ",project);
    return res.status(200).json({ project });
  } catch (e) {
    console.log("Error in project.controller.js && addUserToProject: ", e);
    return res.status(400).json({ error: e.message });
  }
};


export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectService.getProjectById({ projectId }); 
    return res.status(200).json({ project });
  } catch (e) {
    console.log("Error in project.controller.js && getProjectById: ", e);
    return res.status(400).json({ error: e.message });
  }
}