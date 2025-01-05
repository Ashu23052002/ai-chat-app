import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userService.createUser(req.body);
    const token = await user.generateJWT();

    delete user._doc.password;
    res.status(201).json({ user, token });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

export const loginUserController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");

    console.log(user);
    if (!user) {
      res.status(401).json({ error: "Email not found" });
    }

    const isValid = await user.isValidPassword(password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = await user.generateJWT();

    delete user._doc.password;
    res.status(200).json({ user, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const profileController = async (req, res) => {
  try {
    // console.log("req.user: ", req.user);
    res.status(200).json({ user: req.user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const logoutController = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    redisClient.set(token, "logout", "EX", 60 * 60 * 24);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const allUsersController = async (req, res) => {
  try {
    // Ensure req.user is set by the authentication middleware
    if (!req.user || !req.user.email) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated" });
    }

    // Find the logged-in user
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    if (!loggedInUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch all users (excluding the logged-in user)
    const allUser = await userService.getAllUser({ userId: loggedInUser._id });

    // Return the list of users
    res.status(200).json({ users: allUser });
  } catch (error) {
    console.error("Error in allUsersController:", error);
    return res
      .status(400)
      .json({ error: error.message || "Something went wrong" });
  }
};
