import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import AdminPanel from "../pages/AdminPanel";
import AllUsers from "../pages/AllUsers";
// import AllProducts from "../pages/AllProducts";
// import CategoryProduct from "../pages/CategoryProduct";
// import ProductDetails from "../pages/ProductDetails";
// import SearchProduct from "../pages/SearchProduct";
import Success from "../pages/Success";
// import Cart from "../pages/cart";
import Cancel from "../pages/Cancel";
// import Order from "../pages/Order";
// import AllOrders from "../pages/AllOrder";
import VerifyOtp from "../pages/VarifyOtp";
import ResetPassword from "../pages/ResetPassword";
// import ImageSearchResult from "../pages/ImageSearchResult";
// import SavedItems from "../pages/SavedItems";
// import SoundDemo from "../components/SoundDemo";

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
      //   {
      //     path: "product-category",
      //     element: <CategoryProduct />,
      //   },
      //   {
      //     path: "product/:id",
      //     element: <ProductDetails />,
      //   },
      //   {
      //     path: "cart",
      //     element: <Cart />,
      //   },
      //   {
      //     path: "search",
      //     element: <SearchProduct />,
      //   },
      //   {
      //     path: "/image-search",
      //     element: <ImageSearchResult />,
      //   },
      {
        path: "success",
        element: <Success />,
      },
      {
        path: "cancel",
        element: <Cancel />,
      },
      //   {
      //     path: "order",
      //     element: <Order />,
      //   },
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
      //   {
      //     path: "/saved-items",
      //     element: <SavedItems />,
      //   },
      //   {
      //     path: "/sound-demo",
      //     element: <SoundDemo />,
      //   },
      {
        path: "admin-panel",
        element: <AdminPanel />,
        children: [
          {
            path: "all-users",
            element: <AllUsers />,
          },
          //       {
          //         path: "all-products",
          //         element: <AllProducts />,
          //       },
          //       {
          //         path: "all-orders",
          //         element: <AllOrders />,
          //       },
        ],
      },
    ],
  },
]);

export default router;
