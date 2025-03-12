import { Router } from "express";
import {
  addNewPlayground,
  addReview,
  getAllPlaygrounds,
  getPlaygroundById,
  searchPlaygrounds,
  updatePlayground,
} from "../controllers/playgroundController";
import upload from "../utils/multerConfig";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

router.post(
  "/add",
  isAuthenticated,
  upload.array("images", 5),
  addNewPlayground
);
router.get("/all", getAllPlaygrounds);
router.get("/single/:id", getPlaygroundById);
router.patch(
  "/update/:id",
  isAuthenticated,
  upload.array("images", 5),
  updatePlayground
);
router.post("/addreview/:id", isAuthenticated, addReview);
router.get("/search", searchPlaygrounds);
export default router;
