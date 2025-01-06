import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
  try {
   // console.log("token: ", req.headers.authorization.split(" ")[1]);
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
   // console.log("Token from cookies:", req.cookies.token);
   // console.log("Token from headers:", req.headers.authorization);


    if (!token) {
      return res.status(401).json({ error: "Unauthorized User" });
    }

    const isBlackListed = await redisClient.get(token);
    if (isBlackListed) {
      res.cookie("token", " ");
      return res.status(401).json({ error: "Unauthorized User" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.log("error in auth.middleware.js: ", error);
    return res.status(401).json({ error: "Unauthorized User" });
  }
};
