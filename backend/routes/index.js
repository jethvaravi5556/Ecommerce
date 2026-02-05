import express from "express";

import userSignUpController from "../controller/user/userSignUp.js";
import userSigninController from "../controller/user/userSignin.js";
import userDetailController from "../controller/user/userDetail.js";
import authToken from "../middleware/authToken.js";
import userLogoutController from "../controller/user/userLogout.js";
import allUserController from "../controller/user/allUser.js";
import updateUserController from "../controller/user/updateUser.js";
import { googleLoginController } from "../controller/user/googleLogin.js";

// import chatbotController from "../controller/chatbot/chatbotController.js";

const router = express.Router();

router.post("/signup", userSignUpController);
router.post("/google-login", googleLoginController);
router.post("/signin", userSigninController);
router.get("/user-details", authToken, userDetailController);
router.post("/user-logout", userLogoutController);

// Admin Panel
router.get("/all-users", authToken, allUserController);
router.post("/update-users", authToken, updateUserController);
// router.get("/all-orders", authToken, allOrderController);
// router.patch("/update-status", authToken, confirmOrderController);

// import allProductController from "../controller/product/allProduct.js";
// import uploadProductController from "../controller/product/uploadProduct.js";
// import getProductController from "../controller/product/getProduct.js";
// import updateProductController from "../controller/product/updateProduct.js";
// import getCategoryProductController from "../controller/product/getCategoryProductOne.js";
// import getCategoryWiseProductController from "../controller/product/getCategyWiseProduct.js";
// import getProductDetailsController from "../controller/product/getProductDetails.js";

// import addToCartController from "../controller/user/addToCart.js";
// import countAddToCartProductController from "../controller/user/countAddToCartProduct.js";
// import addToCartViewProductController from "../controller/user/addToCartViewProduct.js";
// import updateAddToCartProductController from "../controller/user/updateAddToCartProduct.js";
// import deleteAddTocartProductController from "../controller/user/deleteAddToCartProduct.js";
// import searchProductController from "../controller/product/searchProduct.js";
// import filterProductController from "../controller/product/filterProduct.js";
// import { googleLoginController } from "../controller/user/googleLogin.js";
// import paymentController from "../controller/order/paymentController.js";
// import webhookController from "../controller/order/webhookController.js";

import bodyParser from "body-parser";
// import getOrders from "../controller/order/getOrder.js";
// import allOrderController from "../controller/order/allOrderController.js";
import sendOtpController from "../controller/user/forgotPassword.js";
import verifyOtpController from "../controller/user/varifyOtp.js";
import resetPasswordController from "../controller/user/resetPassword.js";
// import confirmOrderController from "../controller/order/confrimOrderController.js";
// import { searchByImageController } from "../controller/search/searchByImageController.js";
// import { uploadImageController } from "../controller/search/uploadImageController.js";
// import {
//   getsavedItems,
//   saveItem,
//   unsaveItem,
// } from "../controller/user/saveItem.js";
// import chatbotController from "../controller/chatbot/chatbotController.js";
// import { getSoundSample } from "../controller/product/soundController.js";

// // Product
// router.post("/upload-product", authToken, uploadProductController);
// router.get("/get-product", getProductController);
// router.post("/update-product", authToken, updateProductController);
// router.get("/get-categoryproduct", getCategoryProductController);
// router.post("/category-product", getCategoryWiseProductController);
// router.post("/product-detail", getProductDetailsController);
// router.get("/all-products", authToken, allProductController);
// router.get("/search", searchProductController);
// router.post("/filterproduct", filterProductController);

// //sound
// router.get("/sample-sound", getSoundSample);

// //save product
// router.post("/save-item", authToken, saveItem);
// router.post("/unsave-item", authToken, unsaveItem);
// router.get("/saved-items/:userId", authToken, getsavedItems);

// // User Add to Cart
// router.post("/addtocart", authToken, addToCartController);
// router.get(
//   "/countaddtocartproduct",
//   authToken,
//   countAddToCartProductController
// );
// router.get("/addtocartviewproduct", authToken, addToCartViewProductController);
// router.post(
//   "/updateaddtocartproduct",
//   authToken,
//   updateAddToCartProductController
// );
// router.post(
//   "/deleteaddtocartproduct",
//   authToken,
//   deleteAddTocartProductController
// );

// // payment and order
// router.post("/payment", authToken, paymentController);
// // router.post("/webhook", bodyParser.raw({ type: "application/json" }), webhookController);
// router.get("/order", authToken, getOrders);

// // otp
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/reset-password", resetPasswordController);

// // chatbot
// router.post("/chat", authToken, chatbotController);

// //search-image
// router.post("/image", uploadImageController, searchByImageController);

export default router; // ✅ ES Module export
