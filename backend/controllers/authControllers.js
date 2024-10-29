import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateTokenAndSetCookie.js";
export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }
    const existingUser = await User.find({ username: username });
    if (existingUser) {
      return res.status(400).json({
        error: "Existing Username",
      });
    }
    const existingEmail = await User.find({ email: email });
    if (existingEmail) {
      return res.status(400).json({
        error: "Existing Email",
      });
    }
    const encryptedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      fullName,
      username,
      email,
      password: encryptedPassword,
    });
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      return res.status(400).json({
        error: "Invalid user data",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
export const login = async () => {};
export const logout = async () => {};
