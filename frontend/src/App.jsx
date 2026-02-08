import React, { useEffect, useState } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import SummaryApi from "./common";
import Context from "./context";
import { setUserDetails } from "./store/userSlice";
import { useDispatch } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import Chatbot from "./components/Chatbot";
import { ImageSearchProvider } from "./context/ImageSearchContext";

function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);
  const fetchUserDetails = async () => {
    try {
      let apiUrl = SummaryApi.current_user.url.trim();
      apiUrl = apiUrl.replace(/\u200B/g, ""); // ✅ Remove hidden characters

      const dataResponse = await fetch(apiUrl, {
        method: SummaryApi.current_user.method,
        credentials: "include", // ✅ Send cookies with request
      });

      const dataApi = await dataResponse.json();

      // console.log("User Data:", dataApi.data); // ✅ Log API response

      if (dataApi.success) {
        dispatch(setUserDetails(dataApi.data));
      } else {
        console.error("Error fetching user details:", dataApi.message);
        dispatch(setUserDetails(null)); // ✅ Ensure logout state is handled
      }
    } catch (error) {
      console.error("Fetch error:", error);
      dispatch(setUserDetails(null)); // ✅ Handle error state
    }
  };

  const fetchUserAddToCart = async () => {
    try {
      let apiUrl = SummaryApi.countAddToCartProduct.url.trim();
      apiUrl = apiUrl.replace(/\u200B/g, ""); // ✅ Remove hidden characters

      const dataResponse = await fetch(apiUrl, {
        method: SummaryApi.countAddToCartProduct.method,
        credentials: "include", // ✅ Send cookies with request
      });

      const dataApi = await dataResponse.json();

      // console.log("User Data:", dataApi.data); // ✅ Log API response

      if (dataApi.success) {
        setCartProductCount(dataApi?.data?.count);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      dispatch(setUserDetails(null)); // ✅ Handle error state
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserAddToCart();
  }, []);

  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ImageSearchProvider>
          {" "}
          {/* ✅ Wrap context here */}
          <Context.Provider
            value={{
              fetchUserDetails,
              cartProductCount,
              fetchUserAddToCart,
            }}
          >
            <div className="flex flex-col min-h-screen">
              <ToastContainer />
              <Header />
              <main className="flex-grow pt-16">
                <Outlet />
              </main>
              <Footer />
              {/* <Chatbot /> */}
            </div>
          </Context.Provider>
        </ImageSearchProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
