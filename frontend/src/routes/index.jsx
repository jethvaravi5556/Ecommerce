import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";

import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import AdminPanel from "../pages/AdminPanel";
import AllUsers from "../pages/AllUsers";
import AllProducts from "../pages/AllProducts";
import AllOrders from "../pages/AllOrder";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import OrderPage from "../pages/Order";
import VerifyOtp from "../pages/VarifyOtp";
import ResetPassword from "../pages/ResetPassword";
import Home from "../pages/Home";
import SavedItems from "../pages/SavedItems";
import SearchProduct from "../pages/SearchProduct";
import Profile from "../pages/Profile";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import CategoryProduct from "../pages/CategoryProduct";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/Admindashboard";

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
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "search",
        element: <SearchProduct />,
      },
      {
        path: "/saved-items",
        element: (
          <ProtectedRoute>
            <SavedItems />
          </ProtectedRoute>
        ),
      },

      {
        path: "product-category",
        element: <CategoryProduct />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Cart />,
          </ProtectedRoute>
        ),
      },
      {
        path: "success",
        element: (
          <ProtectedRoute>
            <Success />
          </ProtectedRoute>
        ),
      },
      {
        path: "cancel",
        element: (
          <ProtectedRoute>
            <Cancel />
          </ProtectedRoute>
        ),
      },
      {
        path: "order",
        element: (
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        ),
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
            path: "dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "all-users",
            element: <AllUsers />,
          },
          {
            path: "all-products",
            element: <AllProducts />,
          },
          {
            path: "all-orders",
            element: <AllOrders />,
          },
        ],
      },
    ],
  },
]);

export default router;
