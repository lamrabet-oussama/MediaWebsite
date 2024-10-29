import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        error: "Unauthorized:Invalid Token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        error: "Unauthorized:Token is not valide",
      });
    }
    const user = await User.findOne({ _id: decoded.userId }).select(
      "-password"
    );
    if (!user) {
      return res.status(404).json({
        error: "User doesn't found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      error: "Error in protectedRoute",
      message: error.message,
      stack: error.stack,
    });
  }
};
