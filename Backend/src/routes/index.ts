import { Router } from "express";
import userRoutes from "./userRoutes";
import PlaygroundRoutes from "./playgroundRoutes";
import bookingRoutes from "./bookingRoutes";
import earningRoutes from "./earningRoutes";
const router = Router();

router.use("/users", userRoutes);
router.use("/playground", PlaygroundRoutes);
router.use("/booking", bookingRoutes);
router.use("/earning", earningRoutes);

export default router;
