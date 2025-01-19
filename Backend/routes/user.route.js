import express from 'express';
import { register,login,logout,getProfile, editProfile,suggestedUsers,followUnfollow } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router= express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated,getProfile);
router.route("/profile/edit").post(isAuthenticated,upload.single("profilepic"),editProfile);
router.route("/suggested").get(isAuthenticated,suggestedUsers);
router.route("/followunfollow/:id").post(isAuthenticated,followUnfollow);

export default router;