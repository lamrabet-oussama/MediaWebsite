import express from "express";
const router = express.Router();
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
  getAllPosts,
  getLikesPosts,
  getFollowingPosts,
  getUserPosts,
} from "../controllers/postControllers.js";
router.get("/all", protectRoute, getAllPosts);
router.get("/likes/:id", protectRoute, getLikesPosts);
router.get("/following/", protectRoute, getFollowingPosts);
router.get("/user/:id", protectRoute, getUserPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/delete/:id", protectRoute, deletePost);

export default router;
