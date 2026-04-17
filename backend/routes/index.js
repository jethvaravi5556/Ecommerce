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

import uploadProductController from "../controller/product/uploadProduct.js";
import getProductController from "../controller/product/getProduct.js";
import getProductDetailsController from "../controller/product/getProductDetails.js";
import updateProductController from "../controller/product/updateProduct.js";
import getCategoryProductController from "../controller/product/getCategoryProductOne.js";
import getCategoryWiseProductController from "../controller/product/getCategyWiseProduct.js";
import searchProductController from "../controller/product/searchProduct.js";
import allProductController from "../controller/product/allProduct.js";
import filterProductController from "../controller/product/filterProduct.js";

import bodyParser from "body-parser";
import addToCartController from "../controller/user/addToCart.js";
import countAddToCartProductController from "../controller/user/countAddToCartProduct.js";
import addToCartViewProductController from "../controller/user/addToCartViewProduct.js";
import updateAddToCartProductController from "../controller/user/updateAddToCartProduct.js";
import deleteAddTocartProductController from "../controller/user/deleteAddToCartProduct.js";
import getRecentlyProductController from "../controller/product/getRecentlyProduct.js";
import deleteProductController from "../controller/product/deleteProduct.js";
import paymentController from "../controller/order/paymentController.js";
import getOrders from "../controller/order/getOrder.js";

import sendOtpController from "../controller/user/forgotPassword.js";
import verifyOtpController from "../controller/user/varifyOtp.js";
import resetPasswordController from "../controller/user/resetPassword.js";
import {
  getsavedItems,
  saveItem,
  unsaveItem,
} from "../controller/user/saveItem.js";
import allOrderController from "../controller/order/allOrderController.js";
import confirmOrderController from "../controller/order/confrimOrderController.js";
import addReviewController from "../controller/review/addReviewController.js";
import getProductReviewController from "../controller/review/getProductReviewController.js";
import getRatingAverageController from "../controller/review/getRatingAverageController.js";
import updateReviewController from "../controller/review/updateReviewController.js";
import deleteReviewController from "../controller/review/deleteReviewController.js";
import chatbotController from "../controller/chatbot/chatbotController.js";

const router = express.Router();

router.post("/signup", userSignUpController);
router.post("/google-login", googleLoginController);
router.post("/signin", userSigninController);
router.get("/user-details", authToken, userDetailController);
router.post("/user-logout", userLogoutController);
router.get("/user-profile", authToken, userProfileController);
router.put("/update-profile", authToken, updateProfileController);

//wishlist
router.post("/save-item", authToken, saveItem);
router.post("/unsave-item", authToken, unsaveItem);
router.get("/saved-items/:userId", authToken, getsavedItems);

// Admin Panel
router.get("/all-users", authToken, allUserController);
router.post("/update-users", authToken, updateUserController);
router.delete("/delete-users/:id", authToken, deleteUserController);
router.get("/all-products", authToken, allProductController);
router.post("/update-product", authToken, updateProductController);
router.delete("/delete-product/:id", authToken, deleteProductController);
router.get("/all-orders", authToken, allOrderController);
router.patch("/update-status", authToken, confirmOrderController);

// Product
router.post("/upload-product", authToken, uploadProductController);
router.get("/get-product", getProductController);

router.get("/get-categoryproduct", getCategoryProductController);
router.post("/category-product", getCategoryWiseProductController);
router.post("/product-detail", getProductDetailsController);

router.get("/search", searchProductController);
router.post("/filterproduct", filterProductController);
router.post("/recently-products", getRecentlyProductController);

// User Add to Cart
router.post("/addtocart", authToken, addToCartController);
router.get(
  "/countaddtocartproduct",
  authToken,
  countAddToCartProductController,
);
router.get("/addtocartviewproduct", authToken, addToCartViewProductController);
router.post(
  "/updateaddtocartproduct",
  authToken,
  updateAddToCartProductController,
);
router.post(
  "/deleteaddtocartproduct",
  authToken,
  deleteAddTocartProductController,
);

// payment and order
router.post("/payment", authToken, paymentController);
// router.post("/webhook", bodyParser.raw({ type: "application/json" }), webhookController);
router.get("/order", authToken, getOrders);

// review
router.post("/add-review", authToken, addReviewController);
router.get("/product-review/:productId", getProductReviewController);
router.get("/rating-average/:productId", getRatingAverageController);
router.patch("/update-review/:reviewId", authToken, updateReviewController);
router.delete("/delete-review/:reviewId", authToken, deleteReviewController);

// chatbot
router.post("/chat", authToken, chatbotController);
// otp
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/reset-password", resetPasswordController);

export default router;
