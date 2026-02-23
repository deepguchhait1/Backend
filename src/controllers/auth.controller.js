import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All Fields are Required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid Email Address" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic: "",
      isOnline: true,
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });

      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.error("Failed to create Stream user:", error);
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "All fileds are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or password" });
    }
    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid Email or password" });

    await User.findByIdAndUpdate(user._id, { isOnline: true });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in Login controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    
    if (req.user && req.user._id) {
      await User.findByIdAndUpdate(req.user._id, { isOnline: false });
    }

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const onboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;
    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...req.body, isOnboarded: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `Stream user updated after onboarding for ${updatedUser.fullName}`
      );
    } catch (error) {
      console.log(
        "Error updatingstream user during onboarding :",
        error.message
      );
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("Onboarding Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
