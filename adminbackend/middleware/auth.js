import jwt from "jsonwebtoken";

import { User } from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
  const { Token } = req.cookies;
  try {
    if (!Token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Login First",
      });
    }
    const decode = jwt.verify(Token, process.env.SECRET_CODE);
    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid Token Structure",
      });
    }
    req.user = await User.findById(decode._id);
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid Token",
    });
  }
};
