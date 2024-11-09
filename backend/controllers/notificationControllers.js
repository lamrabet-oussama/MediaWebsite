import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";

export const getNotification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    const notification = await Notification.find({
      to: req.user._id,
    }).populate({
      path: "from",
      select: "username profileImg",
    });
    await Notification.updateMany({ to: user._id }, { read: true });
    console.log("notif:", notification);
    return res.status(200).json(notification);
  } catch (error) {
    return res.status(500).json({
      message: "Error in getNotification",
      error: error.message,
      errorStack: error.stack,
    });
  }
};
export const deleteNotification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({
        error: "Notification not found",
      });
    }
    await Notification.findByIdAndDelete(notification._id);
    return res.status(200).json({
      message: "Notifications deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in deleteNotification",
      error: error.message,
      errorStack: error.stack,
    });
  }
};
export const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error in deleteAllNotifications",
      error: error.message,
      errorStack: error.stack,
    });
  }
};
