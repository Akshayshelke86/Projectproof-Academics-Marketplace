import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(`[LOGIN_DEBUG] Attempting login for: ${email}`);

  const user = await User.findOne({ email });

  if (user) {
    console.log(`[LOGIN_DEBUG] User found in DB`);
    const isMatch = await user.matchPassword(password);
    console.log(`[LOGIN_DEBUG] Password match result: ${isMatch}`);

    if (isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        walletBalance: user.walletBalance,
        totalEarnings: user.totalEarnings,
        referralCode: user.referralCode,
        token: generateToken(user._id),
      });
    } else {
      console.log(`[LOGIN_DEBUG] Password mismatch for ${email}`);
      res.status(401);
      throw new Error("LOGIN_FAILED_VERIFIED_BACKEND: Password Mismatch");
    }
  } else {
    console.log(`[LOGIN_DEBUG] User NOT found: ${email}`);
    res.status(401);
    throw new Error("LOGIN_FAILED_VERIFIED_BACKEND: User Not Found");
  }
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const totalReferrals = await User.countDocuments({ referredBy: user._id });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
      walletBalance: user.walletBalance,
      totalEarnings: user.totalEarnings,
      referralCode: user.referralCode,
      totalReferrals: totalReferrals,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const user = await User.find({});
  res.json(user);
});

// @desc Get user by Id
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -walletBalance -totalEarnings -wishlist");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User Not Found!!!");
  }
});

// @desc Get Public User Profile
// @route GET /api/users/public/:id
// @access Public
const getPublicUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("name email role createdAt");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("Profile Not Found");
  }
});

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteUser();
    res.json({ message: "User Removed Successfully!!" });
  } else {
    res.status(404);
    throw new Error("User Not Found!!!");
  }
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      referralCode: updatedUser.referralCode,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Register a new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, referralCode } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  let referredBy = null;
  let bonusAmount = 0;

  // Check if referral code is provided and valid
  if (referralCode) {
    const inviter = await User.findOne({ referralCode: referralCode.toUpperCase() });
    if (inviter) {
      referredBy = inviter._id;
      bonusAmount = 50; // Give ₹50 bonus to the new user

      // Also reward the inviter
      inviter.walletBalance += 50;
      inviter.totalEarnings += 50;
      await inviter.save();
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'student', // Use provided role or default
    referredBy,
    walletBalance: bonusAmount,
    totalEarnings: bonusAmount
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
      walletBalance: user.walletBalance,
      totalEarnings: user.totalEarnings,
      referralCode: user.referralCode,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data!!");
  }
});

// @desc Auth user with Google
// @route POST /api/users/google
// @access Public
const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Create user if doesn't exist
      user = await User.create({
        name,
        email,
        password: sub, // Dummy password since it's required in model
        role: 'student'
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
      walletBalance: user.walletBalance,
      totalEarnings: user.totalEarnings,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401);
    throw new Error("Google Authentication Failed");
  }
});

// @desc Toggle Wishlist Item
// @route POST /api/users/wishlist/:id
// @access Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const projectId = req.params.id;

  if (user) {
    const isWishlisted = user.wishlist.includes(projectId);

    if (isWishlisted) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== projectId);
    } else {
      user.wishlist.push(projectId);
    }

    await user.save();
    res.json(user.wishlist);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Get User Wishlist
// @route GET /api/users/wishlist
// @access Private
const getMyWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  deleteUser,
  getUserProfile,
  getUsers,
  registerUser,
  updateUserProfile,
  getUserById,
  updateUser,
  toggleWishlist,
  getMyWishlist,
  getPublicUserProfile,
  googleLogin
};
