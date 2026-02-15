import AllUsers from "../pages/AllUsers";

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
  updateUser: {
    url: `${backendDomain}/api/update-users`,
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
