import Notification from "../models/notificationModel.js";
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
      if (newPassword.length < 6) {
        return res.status(400).json({
          error: "Password must contain at least 6 characters",
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
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
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
          error: "Full name must be at least 7 caracters",
        });
      }
    }

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
