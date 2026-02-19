import express from "express";

import userSignUpController from "../controller/user/userSignUp.js";
import userSigninController from "../controller/user/userSignin.js";
import userDetailController from "../controller/user/userDetail.js";
import deleteUserController from "../controller/user/deleteUser.js";
import authToken from "../middleware/authToken.js";
import userLogoutController from "../controller/user/userLogout.js";
import allUserController from "../controller/user/allUser.js";
import updateUserController from "../controller/user/updateUser.js";
import userProfileController from "../controller/user/userProfile.js";
import updateProfileController from "../controller/user/updateProfile.js";
import { googleLoginController } from "../controller/user/googleLogin.js";

const router = express.Router();

router.post("/signup", userSignUpController);
router.post("/google-login", googleLoginController);
router.post("/signin", userSigninController);
router.get("/user-details", authToken, userDetailController);
router.post("/user-logout", userLogoutController);
router.get("/user-profile", authToken, userProfileController);

router.put("/update-profile", authToken, updateProfileController);

// Admin Panel
router.get("/all-users", authToken, allUserController);
router.post("/update-users", authToken, updateUserController);
router.delete("/delete-users/:id", authToken, deleteUserController);
import bodyParser from "body-parser";

import sendOtpController from "../controller/user/forgotPassword.js";
import verifyOtpController from "../controller/user/varifyOtp.js";
import resetPasswordController from "../controller/user/resetPassword.js";

// // otp
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/reset-password", resetPasswordController);

export default router;
