import express from "express";
const router = express.Router();
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUser,
  updateUserProfile,
  deleteAccount,
} from "../controllers/userControllers.js";
router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested/", protectRoute, getSuggestedUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.patch("/update", protectRoute, updateUserProfile);
router.delete("/delete", protectRoute, deleteAccount);
export default router;
