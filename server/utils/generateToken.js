import jwt from "jsonwebtoken";

/**
 * Generate a signed JWT for the supplied user id.
 */
export const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN || "7d",
  });
