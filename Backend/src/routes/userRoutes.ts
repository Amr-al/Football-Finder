import { Router } from "express";
import {
  changePassword,
  changeUserStatus,
  confirmOTP,
  createUser,
  getUser,
  login,
  refreshToken,
  updateProfile,
} from "../controllers/userController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

router.post("/create", createUser);
router.post("/login", login);
router.get("/user", isAuthenticated, getUser);
router.patch("/update", isAuthenticated, updateProfile);
router.patch('/changepass', isAuthenticated, changePassword);
router.get("/refresh", refreshToken);
router.post("/confirm", confirmOTP);
router.post('/bin', isAuthenticated, changeUserStatus)

export default router;
