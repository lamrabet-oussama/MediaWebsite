import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import { v2 as cloudinary } from "cloudinary";
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img, video } = req.body;
    const userId = req.user._id.toString();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!text && !img && !video) {
      return res
        .status(400)
        .json({ error: "A post must have text, an image, or a video!" });
    }

    if (img) {
      const uploadResponse = await cloudinary.uploader.upload(img);
      img = uploadResponse.secure_url;
    }

    if (video) {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_large(
            video,
            { resource_type: "video" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
        });
        video = result.secure_url;
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Video upload failed", details: error.message });
      }
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
      video,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({
      message: "Error in createPost",
      error: error.message,
      errorStack: error.stack,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return es.status(404).json({
        error: "Post not found",
      });
    }
    if (post.user.toString() != req.user._id.toString()) {
      return res.status(401).json({
        error: "You are not authorized to delete this post",
      });
    }
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    if (post.video) {
      const videoId = post.video.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(videoId, { resource_type: "video" });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in deletePost",
      error: error.message,
      errorStack: error.stack,
    });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({
        error: "Text fiels is required",
      });
    }
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }
    const comment = {
      user: req.user._id,
      text,
    };
    post.comments.push(comment);
    await post.save();
    const notification = new Notification({
      from: req.user._id.toString(),
      to: post.user,
      type: "comment",
    });
    await notification.save();
    const postComments = post.comments;
    res.status(200).json(postComments);
  } catch (error) {
    return res.status(500).json({
      message: "Error in commentOnPost",
      error: error.message,
      errorStack: error.stack,
    });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }
    const userId = req.user._id.toString();
    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
      const updatedLikes = post.likes.filter(
        (idUserLiked) => idUserLiked.toString() !== userId.toString()
      );

      res.status(200).json(updatedLikes);
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });

      await post.save();
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();
      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error in likePost",
      error: error.message,
      errorStack: error.stack,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (posts.length === 0) {
      res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      message: "Error in getAllPosts",
      error: error.message,
      errorStack: error.stack,
    });
  }
};

export const getLikesPosts = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(likedPosts);
  } catch (error) {
    return res.status(500).json({
      message: "Error in getLikesPosts",
      error: error.message,
      errorStack: error.stack,
    });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    const following = user.following;
    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(feedPosts);
  } catch (error) {
    return res.status(500).json({
      message: "Error in getFollowingPosts",
      error: error.message,
      errorStack: error.stack,
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      message: "Error in getUserPosts",
      error: error.message,
      errorStack: error.stack,
    });
  }
};
