import Notification from "../models/notificationModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        error: "User is not found",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: "Error in getUser",
      message: error.message,
      stack: error.stack,
    });
  }
};

export const followUnfollowUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (!userToModify || !currentUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        error: "You can't follow/unfollow yourself",
      });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      res.status(200).json({
        message: "User unfollowed successfully",
      });
    } else {
      // Follow
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      const notification = new Notification({
        type: "follow",
        from: req.user._id,
        to: id,
      });
      await notification.save();
      res.status(200).json({
        message: "User followed successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error in followUnfollow",
      message: error.message,
      stack: error.stack,
    });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const usersfollowedByMe = await User.findById(req.user._id).select(
      "following"
    );
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: req.user._id },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    const filteredUsers = await users.filter(
      (user) => !usersfollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json({
      suggestedUsers,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error in getSuggestedUser",
      message: error.message,
      stack: error.stack,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  const { username, email, fullName, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    if (currentPassword && newPassword) {
      const check = await bcrypt.compare(currentPassword, user.password);
      if (!check) {
        return res.status(400).json({ error: "Current Password is incorrect" });
      }
      if (newPassword) {
        const pwdRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!pwdRegex.test(newPassword)) {
          return res.status(400).json({
            error:
              "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
          });
        }
      }

      if (currentPassword === newPassword) {
        return res.status(400).json({
          error: "The new password cannot be the same as the current password.",
        });
      }
      user.password = await bcrypt.hash(newPassword, 12);
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg, {
        folder: "profile",
      });
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg, {
        folder: "coverImage",
      });
      coverImg = uploadedResponse.secure_url;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email) {
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Invalid email format",
        });
      }
    }
    if (username) {
      if (username !== user.username) {
        return res.status(400).json({
          error: "You cannot update the username",
        });
      }
    }
    if (fullName) {
      if (fullName.length < 7) {
        return res.status(400).json({
          error: "Full name must be at least 7 characters",
        });
      }
    }
    if (link) {
      const linkRegex =
        /^(https:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(:\d+)?(\/[^\s]*)?$/;
      if (!linkRegex.test(link)) {
        return res.status(400).json({
          error: "Please Enter a valid URL",
        });
      }
    }

    console.log("Link et bio:", link, bio);
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    await user.save();
    user.password = null; // Retirer le mot de passe pour la réponse
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error in updateUserProfile",
      message: error.message,
      stack: error.stack,
    });
  }
};

export const deleteAccount = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userPosts = await Post.find({ user: userId });

    if (userPosts.length > 0) {
      for (const post of userPosts) {
        if (post.img) {
          const imgId = post.img.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(imgId, { resource_type: "image" });
        }
        if (post.video) {
          const videoId = post.video.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(videoId, {
            resource_type: "video",
          });
        }
      }

      await Post.deleteMany({ user: userId });
      console.log(`${userPosts.length} posts and associated media deleted`);
    }

    const postsWithUserComments = await Post.find({
      "comments.user": userId,
    });

    for (const post of postsWithUserComments) {
      post.comments = post.comments.filter(
        (comment) => !comment.user.equals(userId)
      );

      await post.save();
    }
    console.log("User's comments deleted from other posts");

    const userNotifications = await Notification.find({ user: userId });
    if (userNotifications.length > 0) {
      await Notification.deleteMany({ user: userId });
      console.log(`${userNotifications.length} notifications deleted`);
    }

    if (user.profileImg) {
      const profileImgId = user.profileImg.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(profileImgId, {
        folder: "profile",
        resource_type: "image",
      });
      console.log("Profile image deleted from Cloudinary");
    }

    if (user.coverImg) {
      const coverImgId = user.coverImg.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(coverImgId, {
        folder: "coverImage",
        resource_type: "image",
      });
      console.log("Cover image deleted from Cloudinary");
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      message: "Account and all associated data deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error in deleteAccount",
      message: error.message,
      stack: error.stack,
    });
  }
};
