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
import { ImageSearchProvider } from "./context/ImageSearchContext";

function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);

  const fetchUserDetails = async () => {
    try {
      let apiUrl = SummaryApi.current_user.url.trim();
      apiUrl = apiUrl.replace(/\u200B/g, "");

      const dataResponse = await fetch(apiUrl, {
        method: SummaryApi.current_user.method,
        credentials: "include",
      });

      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        dispatch(setUserDetails(dataApi.data));
        return dataApi.data; //
      } else {
        dispatch(setUserDetails(null));
        return null;
      }
    } catch (error) {
      console.error("Fetch user error:", error);
      return null;
    }
  };

  const fetchUserAddToCart = async () => {
    try {
      let apiUrl = SummaryApi.countAddToCartProduct.url.trim();
      apiUrl = apiUrl.replace(/\u200B/g, "");

      const dataResponse = await fetch(apiUrl, {
        method: SummaryApi.countAddToCartProduct.method,
        credentials: "include",
      });

      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        setCartProductCount(dataApi?.data?.count);
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      await fetchUserDetails();
      await fetchUserAddToCart();
    };

    initializeApp();
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ImageSearchProvider>
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
          </div>
        </Context.Provider>
      </ImageSearchProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
