import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  let token;

  // WEB
  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // MOBILE
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.replace("Bearer ", "");
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - no token found" });
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - invalid token" });
  }
};

export const adminOnly = (req, res, next) => {
  console.log("user", req.user);
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.email !== ENV.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Forbidden - admin access only" });
  }

  next();
};