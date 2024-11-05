import express from "express";
const router = express.Router();
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getNotification,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notificationControllers.js";
router.get("/", protectRoute, getNotification);
router.delete("/:id", protectRoute, deleteNotification);
router.delete("/", protectRoute, deleteAllNotifications);

export default router;
