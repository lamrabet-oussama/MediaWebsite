import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateTokenAndSetCookie.js";

export const signup = async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      password,
      birthDay,
      birthMonth,
      birthYear,
    } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Existing Username" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Existing Email" });
    }
    if (password < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }
    const encryptedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      fullName,
      username,
      email,
      birthDay,
      birthMonth,
      birthYear,
      password: encryptedPassword,
    });

    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      birthDay: newUser.birthDay,
      birthMonth: newUser.birthMonth,
      birthYear: newUser.birthMonth,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profileImg: newUser.profileImg,
      coverImg: newUser.coverImg,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      errorStack: error.stack,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const checkUser = await User.findOne({ username });
    if (!checkUser) {
      return res.status(400).json({
        error: "User doesn't exist",
      });
    }

    const isPassword = await bcrypt.compare(password, checkUser.password);

    if (!isPassword) {
      return res.status(400).json({
        error: "Password is not correct",
      });
    }
    generateTokenAndSetCookie(checkUser._id, res);
    res.status(200).json({
      message: "Login successful",
      user: {
        checkUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Error in login",
      message: error.message,
      stack: error.stack,
    });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error in logout",
      message: error.message,
      stack: error.stack,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req?.user._id).select("-password");
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error in getMe",
      message: error.message,
      stack: error.stack,
    });
  }
};
