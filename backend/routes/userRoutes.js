import express from "express";
const router = express.Router();
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUser,
  updateUserProfile,
} from "../controllers/userControllers.js";
router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested/", protectRoute, getSuggestedUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUserProfile);

export default router;
