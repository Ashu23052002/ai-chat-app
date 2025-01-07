import "dotenv/config";
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose, { mongo } from "mongoose";
import projectModel from "./models/project.model.js";
import userModel from "./models/user.model.js";

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();
  console.log("user connected");
  socket.join(socket.roomId);

  socket.on("project-message", async (data) => {
  //  console.log("data in server.js in socket: ", data.sender);

    const user = await userModel.findById(data.sender);

  //  console.log("user: ", user.email);

    const newData = {
      message: data.message,
      email: user.email,
    };

    socket.broadcast.to(socket.roomId).emit("project-message", newData);
  });
  // socket.on("event", (data) => {
  //   /* … */
  // });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.leave(socket.roomId);
  });
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    const projectId = socket.handshake.query.projectId;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid ProjectId"));
    }

    socket.project = await projectModel.findById(projectId);

    if (!token) {
      return next(new Error("Authentication Error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new Error("Authentication Error"));
    }

    socket.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
});
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
