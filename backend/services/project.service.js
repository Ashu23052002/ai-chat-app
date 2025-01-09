import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Name is required");
  }

  if (!userId) {
    throw new Error("User is required");
  }

  const project = await projectModel.create({ name, users: [userId] });

  return project;
};

export const getAllProjectByUserId = async ({ userId }) => {
  if (!userId) {
    throw new Error("User is required");
  }

  const projects = await projectModel.find({ users: userId });

  return projects;
};

export const addUserToProject = async ({ projectId, users, userId }) => {
  console.log("projectid2 -> ", projectId);
  // Validate projectId
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }

  // Validate users array
  if (!users || !Array.isArray(users) || users.length === 0) {
    throw new Error("Users are required");
  }

  // Validate each user ID in the array
  for (const user of users) {
    if (!mongoose.Types.ObjectId.isValid(user)) {
      throw new Error(`Invalid User ID: ${user}`);
    }
  }

  // Validate userId (the user performing the action)
  if (!userId) {
    throw new Error("User ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID");
  }

  // Check if the user performing the action belongs to the project
  const project = await projectModel.findOne({ _id: projectId, users: userId });
  if (!project) {
    throw new Error("User does not belong to this project");
  }

  // Add new users to the project
  const updatedProject = await projectModel.findByIdAndUpdate(
    { _id: projectId },
    { $addToSet: { users: { $each: users } } }, // Use $addToSet to avoid duplicates
    { new: true }
  );

  if (!updatedProject) {
    throw new Error("Project not found");
  }

  return updatedProject;
};

export const getProjectById = async ({ projectId }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }

  const project = await projectModel
    .findById({ _id: projectId })
    .populate("users");

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

export const updateFileTree = async ({ projectId, fileTree }) => {
  if (!projectId) {
      throw new Error("projectId is required")
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error("Invalid projectId")
  }

  if (!fileTree) {
      throw new Error("fileTree is required")
  }

  const project = await projectModel.findOneAndUpdate({
      _id: projectId
  }, {
      fileTree
  }, {
      new: true
  })

  return project;
}