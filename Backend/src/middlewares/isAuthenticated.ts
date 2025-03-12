import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";

export const isAuthenticated = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from headers
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You must be logged in to perform this action.",
      });
    }

    // Verify the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User not found or invalid token.",
      });
    }

    req.user = user; // Attach user data to the request object
    next(); // Proceed to the next middleware/controller
  }
);
