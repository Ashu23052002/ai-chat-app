import { Router } from "express";
import * as projectController from "../controller/project.controller.js";
import { body } from "express-validator";
import * as authMiddleware from "../middleware/auth.middleware.js";

const router = new Router();

router.post(
  "/create",
  authMiddleware.authUser,
  body("name").isString().withMessage("Name is required"),
  projectController.createProjectController
);
// router.post(
//   "/create",
//   authMiddleware.authUser,
//   body("name")
//     .isString()
//     .withMessage("Name is required")
//     .custom(async (value) => {
//       const project = await projectController.findProjectByName(value);
//       if (project) {
//         return Promise.reject("Name already in use");
//       }
//     }),
//   projectController.createProjectController
// );

router.get("/all", authMiddleware.authUser, projectController.getAllProject);

router.put(
  "/add-user",
  authMiddleware.authUser,
  body("projectId").isString().withMessage("Project ID is required"),

  body("users")
    .isArray({ min: 1 })
    .withMessage("Users must be an array of strings")
    .bail()
    .custom((users) => users.every((user) => typeof user === "string"))
    .withMessage("Each user must be string"),
  projectController.addUserToProject
);

router.get(
  "/get-project/:projectId",
  authMiddleware.authUser,
  projectController.getProjectById
);

router.put(
  "/update-fill-tree",
  authMiddleware.authUser,
  body("projectId").isString().withMessage("Project ID is required"),
  body("fileTree").isObject().withMessage("File Tree is required"),
  projectController.updateFileTree
);

export default router;
