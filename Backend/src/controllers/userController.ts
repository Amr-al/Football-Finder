import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmail } from "../services/emailService";
import { generateMsg, generateOTP } from "../utils/helpers";
import mongoose from "mongoose";
import Playground from "../models/playgroundModel";

dotenv.config(); // Load environment variables

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, phone, role, phoneNumber } = req.body;
  if (!name) {
    return res.status(400).json({ message: "من فضلك ادخل الاسم" });
  }
  if (!email) {
    return res.status(400).json({ message: "من فضلك ادخل الايميل" });
  }
  if (!password) {
    return res.status(400).json({ message: "من فضلك ادخل كلمة المرور" });
  }
  if (!phoneNumber) {
    return res.status(400).json({ message: "من فضلك ادخل رقم الهاتف" });
  }
  const OTP = generateOTP();
  // Create new user
  const newUser = await User.create({
    name,
    email,
    password,
    phone,
    role,
    OTP,
  });

  const htmlContent = generateMsg(OTP);
  await sendEmail({
    to: email,
    subject: "استخدام رمز التحقق لتأكيد حسابك في [ Play Finder ]",
    html: htmlContent,
  });

  return res.status(201).json({
    status: "success",
    message: "يرجي مراجعة ايميلك لتأكيد الهوية",
    user: newUser,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(req.body);

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ status: "error", message: "الايميل او كلمة المرور خاطئة" });
  }

  if (!user.isActive) {
    return res
      .status(401)
      .jsonp({ status: "error", message: "يرجي مراجعة ايميلك لتأكيد الهوية" });
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ status: "error", message: "الايميل او كلمة المرور خاطئة" });
  }

  const payload: Object = {
    id: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    isActive: user.isActive,
  };
  // Create Access Token (short-lived)
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Create Refresh Token (longer-lived)
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  // Send both tokens (refresh token can be stored in HTTP-only cookie)
  res.cookie("refreshToken", refreshToken, {
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  res.status(200).json({
    status: "success",
    message: "تم تسجيل الدخول بنجاح",
    user,
    token: accessToken,
  });
});

export const confirmOTP = catchAsync(async (req: Request, res: Response) => {
  const { email, OTP } = req.body;
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ status: "error", message: "رابط غير صحيح" });
  }
  if (user.OTP == OTP) {
    user.OTP = undefined;
    user.isActive = true;
    console.log(user);
    user.save();
    return res
      .status(200)
      .json({ status: "success", message: "تم تأكيد الحساب بنجاح" });
  }
  return res.status(404).json({ status: "error", message: "رابط غير صحيح" });
});

export const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    // Verify the refresh token
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    );

    const payload: Object = {
      id: decoded._id,
      name: decoded.name,
      email: decoded.email,
      phoneNumber: decoded.phoneNumber,
      role: decoded.role,
      isActive: decoded.isActive,
    };

    // Generate new Access Token
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      message: "Token refreshed",
      accessToken,
    });
  }
);

export const getUser = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    return res.status(200).json({
      status: "success",
      user: req.user,
    });
  }
);

export const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out" });
});

export const changePassword = catchAsync(async (req: any, res: Response) => {
  const id = req.user._id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await user.comparePassword(req.body.currentPassword);
  if (!isMatch) {
    return res.status(401).json({ message: "كلمة المرور القديمة غير صحيحة" });
  }

  user.password = req.body.newPassword;
  await user.save();
  return res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });
});
export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {}
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response) => {}
);

export const updateProfile = catchAsync(async (req: any, res: Response) => {
  const id = req.user._id;
  const user = await User.findByIdAndUpdate(id, req.body, { new: true });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const payload: Object = {
    id: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    isActive: user.isActive,
  };

  // Generate new Access Token
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return res.status(200).json({
    status: "success",
    user,
    token: accessToken,
  });
});

export const changeUserStatus = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { userId, isActive } = req.body;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        status: "fail",
        message: "invaild User ID",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User is not found",
      });
    }
    user.isActive = isActive;
    await user.save();
    const suspended = !isActive;
    await Playground.updateMany(
      {
        ownerId: userId,
      },
      { suspended: suspended }
    );
    res.status(200).json({
      success: true,
      message: "User and playgrounds updated successfully.",
      data: {
        userId: user._id,
        isActive: user.isActive,
        playgroundsSuspended: suspended,
      },
    });
  }
);
