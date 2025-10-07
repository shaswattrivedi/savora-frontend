import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

/**
 * Verify that the request contains a valid JWT token and attach the
 * corresponding user to the request object for downstream handlers.
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User for token not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    next({ status: 401, message: "Not authorized, token failed" });
  }
};

/**
 * Ensure the authenticated user has admin privileges.
 */
export const requireAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Admin privileges required" });
};
