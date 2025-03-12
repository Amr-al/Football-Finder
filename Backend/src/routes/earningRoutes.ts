import { Router } from "express";

import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  getMonthlyEarnings,
  getUnpaidEarnings,
  markEarningsAsPaid,
} from "../controllers/earningController";

const router = Router();
router.get("/unpaid", isAuthenticated, getUnpaidEarnings);
router.patch("/pay", isAuthenticated, markEarningsAsPaid);
router.get("/:ownerId", isAuthenticated, getMonthlyEarnings);
export default router;
