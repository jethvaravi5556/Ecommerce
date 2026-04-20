import AllUsers from "../pages/AllUsers";

const backendDomain = import.meta.env.VITE_API_URL;

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
  userProfile: {
    url: `${backendDomain}/api/user-profile`,
    method: "get",
  },
  updateProfile: {
    url: `${backendDomain}/api/update-profile`,
    method: "put",
  },
  AllUsers: {
    url: `${backendDomain}/api/all-users`,
    method: "get",
  },
  updateUser: {
    url: `${backendDomain}/api/update-users`,
    method: "post",
  },
  deleteUser: {
    url: `${backendDomain}/api/delete-users`,
    method: "delete",
  },
  allProduct: {
    url: `${backendDomain}/api/all-products`,
    method: "get",
  },
  uploadProduct: {
    url: `${backendDomain}/api/upload-product`,
    method: "post",
  },
  // allProduct: {
  //   url: `${backendDomain}/api/get-product`,
  //   method: "get",
  // },
  updateProduct: {
    url: `${backendDomain}/api/update-product`,
    method: "post",
  },
  deleteProduct: {
    url: `${backendDomain}/api/delete-product`,
    method: "delete",
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
  getRecentlyProducts: {
    url: `${backendDomain}/api/recently-products`,
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
  ratingAverage: {
    url: `${backendDomain}/api/rating-average`,
    method: "get",
  },
  productReview: {
    url: `${backendDomain}/api/product-review`,
    method: "get",
  },
  addReview: {
    url: `${backendDomain}/api/add-review`,
    method: "post",
  },
  updateReview: {
    url: `${backendDomain}/api/update-review`,
    method: "patch",
  },
  deleteReview: {
    url: `${backendDomain}/api/delete-review`,
    method: "delete",
  },
  chat: {
    url: `${backendDomain}/api/chat`,
    method: "post",
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
};

export default SummaryApi;
