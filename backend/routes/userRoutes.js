import express from "express";
import { authUser, deleteUser, getUserById, getUserProfile, getUsers, registerUser, updateUser, updateUserProfile, toggleWishlist, getMyWishlist, getPublicUserProfile, googleLogin } from "../controllers/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(registerUser).get(protect, admin, getUsers)
router.post("/login", authUser)
router.post("/google", googleLogin)
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile)
router.route("/wishlist").get(protect, getMyWishlist)
router.route("/wishlist/:id").post(protect, toggleWishlist)
router.route("/public/:id").get(getPublicUserProfile)
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updateUser)

export default router;
