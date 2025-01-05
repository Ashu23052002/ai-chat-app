import express from "express";
import morgan from "morgan";
import connect from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// routes
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";

connect();

const app = express();

// middleware
app.use(cors());
app.use(morgan('dev')); // Add morgan middleware for logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/users",userRoutes)
app.use("/projects",projectRoutes)

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;