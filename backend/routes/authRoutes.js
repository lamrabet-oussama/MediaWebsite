import express from "express";
const router = express.Router();
import {
  signup,
  login,
  logout,
  getMe,
} from "../controllers/authControllers.js";
import { protectRoute } from "../middleware/protectRoute.js";
router.post("/signup", signup);

router.post("/login", login);
router.get("/me", protectRoute, getMe);
router.post("/logout", logout);

export default router;
