import { Router } from "express";
import {
  bookPlayground,
  getAvailableTimes,
  getOwnerBookingsAndEarnings,
  getUserBookings,
  updateBookingStatus,
} from "../controllers/bookingController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

router.post("/create/:id", isAuthenticated, bookPlayground);
router.get("/userbookings", isAuthenticated, getUserBookings);
router.patch("/update", isAuthenticated, updateBookingStatus);
router.get("/ownerbookings", isAuthenticated, getOwnerBookingsAndEarnings);
router.get('/availabletimes/:playgroundId/:date', getAvailableTimes)

export default router;
