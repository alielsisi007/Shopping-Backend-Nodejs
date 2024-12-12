import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Users from "../models/users.model.js";
dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Users.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is invalid or expired" });
  }
};

export default authMiddleware;
