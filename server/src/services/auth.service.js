import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { generateToken } from "../utils/jwt.utils.js";
import { verifyGoogleToken } from "../config/google.config.js";

// 🔹 Register
export const register = async (name, email, password) => {
  const normalizedEmail = (email || "").trim().toLowerCase();

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    const error = new Error("Please provide a valid email address.");
    error.statusCode = 400;
    throw error;
  }

  // Validate password length
  if (!password || password.length < 6) {
    const error = new Error("Password must be at least 6 characters long.");
    error.statusCode = 400;
    throw error;
  }

  // Prevent account duplication and prevent hijacking Google accounts
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    const error = new Error("An account with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
  };
};

// 🔹 Email Login
export const emailLogin = async (email, password) => {
  const normalizedEmail = (email || "").trim().toLowerCase();

  if (!normalizedEmail || !password) {
    const error = new Error("Email and password are required.");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: normalizedEmail });

  // Generic message prevents user account enumeration
  if (!user || !user.password) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
  };
};

// 🔹 Google Login
export const googleLogin = async (credential) => {
  const googleUser = await verifyGoogleToken(credential);
  const normalizedEmail = (googleUser.email || "").trim().toLowerCase();

  // Check user by verified email from Google ID token
  let user = await User.findOne({ email: normalizedEmail });

  if (user) {
    // Safely link Google ID if not yet linked
    if (!user.googleId) {
      user.googleId = googleUser.googleId;
    }

    if (googleUser.name && !user.name) {
      user.name = googleUser.name;
    }
    if (googleUser.picture && !user.picture) {
      user.picture = googleUser.picture;
    }
    user.lastLogin = new Date();
    // Note: Existing password is never overwritten or touched
    await user.save();
  } else {
    // Create new Google-authenticated user
    user = await User.create({
      googleId: googleUser.googleId,
      email: normalizedEmail,
      name: googleUser.name,
      picture: googleUser.picture || "",
      password: null, // Google-authenticated users do not store local password
      lastLogin: new Date(),
    });
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
  };
};

// 🔹 Get User Profile
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-__v -googleId");

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    picture: user.picture,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  };
};