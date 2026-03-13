import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";

import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import AdminPanel from "../pages/AdminPanel";
import AllUsers from "../pages/AllUsers";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import VerifyOtp from "../pages/VarifyOtp";
import ResetPassword from "../pages/ResetPassword";
import Home from "../pages/Home";
import SavedItems from "../pages/SavedItems";
import SearchProduct from "../pages/SearchProduct";
import AllProducts from "../pages/AllProducts";
import Profile from "../pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-Password",
        element: <ForgotPassword />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "search",
        element: <SearchProduct />,
      },
      {
        path: "/saved-items",
        element: <SavedItems />,
      },
      {
        path: "success",
        element: <Success />,
      },
      {
        path: "cancel",
        element: <Cancel />,
      },

      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },

      {
        path: "admin-panel",
        element: <AdminPanel />,
        children: [
          {
            path: "all-users",
            element: <AllUsers />,
          },
          {
            path: "all-products",
            element: <AllProducts />,
          },
        ],
      },
    ],
  },
]);

export default router;
