// import addToCartViewProductController from "../../../backend/controller/user/addToCartViewProduct";
// import countAddToCartProductController from "../../../backend/controller/user/countAddToCartProduct";
import AllUsers from "../pages/AllUsers";
// import SearchProduct from "../pages/SearchProduct";

const backendDomain = "http://localhost:8000";

const SummaryApi = {
  signUp: {
    url: `${backendDomain}/api/signup`,
    method: "post",
  },
  signIn: {
    url: `${backendDomain}/api/signin`,
    method: "post",
  },
  current_user: {
    url: `${backendDomain}/api/user-details`,
    method: "get",
  },
  logout_user: {
    url: `${backendDomain}/api/user-logout`,
    method: "post",
  },
  AllUsers: {
    url: `${backendDomain}/api/all-users`,
    method: "get",
  },
  // allProduct:{
  //   url: `${backendDomain}/api/all-products`,
  //   method: "get"
  // },
  updateUser: {
    url: `${backendDomain}/api/update-users`,
    method: "post",
  },
  uploadProduct: {
    url: `${backendDomain}/api/upload-product`,
    method: "post",
  },
  allProduct: {
    url: `${backendDomain}/api/get-product`,
    method: "get",
  },
  updateProduct: {
    url: `${backendDomain}/api/update-product`,
    method: "post",
  },
  allOrders: {
    url: `${backendDomain}/api/all-orders`,
    method: "GET",
  },
  confirmOrders: {
    url: `${backendDomain}/api/update-status`,
    method: "PATCH",
  },
  categoryProduct: {
    url: `${backendDomain}/api/get-categoryproduct`,
    method: "get",
  },
  categoryWiseProduct: {
    url: `${backendDomain}/api/category-product`,
    method: "post",
  },
  productDetails: {
    url: `${backendDomain}/api/product-detail`,
    method: "post",
  },
  addToCartProduct: {
    url: `${backendDomain}/api/addtocart`,
    method: "post",
  },
  countAddToCartProduct: {
    url: `${backendDomain}/api/countAddToCartProduct`,
    method: "get",
  },
  addToCartViewProduct: {
    url: `${backendDomain}/api/addtocartviewproduct`,
    method: "get",
  },
  updateAddToCartProduct: {
    url: `${backendDomain}/api/updateaddtocartproduct`,
    method: "post",
  },
  deleteAddToCartProduct: {
    url: `${backendDomain}/api/deleteaddtocartproduct`,
    method: "post",
  },
  SearchProduct: {
    url: `${backendDomain}/api/search`,
    method: "get",
  },
  filterProduct: {
    url: `${backendDomain}/api/filterproduct`,
    method: "post",
  },
  payment: {
    url: `${backendDomain}/api/payment`,
    method: "post",
  },
  order: {
    url: `${backendDomain}/api/order`,
    method: "get",
  },
  sendOtp: {
    url: `${backendDomain}/api/send-otp`,
    method: "post",
  },
  verifyOtp: {
    url: `${backendDomain}/api/verify-otp`,
    method: "post",
  },
  resetPassword: {
    url: `${backendDomain}/api/reset-password`,
    method: "post",
  },
  chat: {
    url: `${backendDomain}/api/chat`,
    method: "post",
  },
  psaveItem: {
    url: `${backendDomain}/api/save-item`,
    method: "post",
  },
  gsaveItem: {
    url: `${backendDomain}/api/saved-items`,
    method: "get",
  },
  unsaveItem: {
    url: `${backendDomain}/api/unsave-item`,
    method: "post",
  },
  sampleSound: {
    url: `${backendDomain}/api/sample-sound`,
    method: "get",
  },
};

export default SummaryApi;
