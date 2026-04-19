import React, { useEffect, useState } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import SummaryApi from "./common";
import Context from "./context";
import Chatbot from "./components/Chatbot";
import { setUserDetails } from "./store/userSlice";
import { useDispatch } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ImageSearchProvider } from "./context/ImageSearchContext";

function App() {
  const dispatch = useDispatch();

  const [cartProductCount, setCartProductCount] = useState(0);
  const [savedItemCount, setSavedItemCount] = useState(0);
  const [savedItems, setSavedItems] = useState([]); // NEW: Store saved items data

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
        return dataApi.data;
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

  // NEW FUNCTION
  const fetchSavedItemCount = async (userId) => {
    try {
      let apiUrl = SummaryApi.gsaveItem.url.trim();
      apiUrl = apiUrl.replace(/\u200B/g, "");

      const res = await fetch(`${apiUrl}/${userId}`, {
        method: SummaryApi.gsaveItem.method,
        credentials: "include",
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setSavedItemCount(data.length);
        setSavedItems(data); // Store the actual items data
        return data;
      }
    } catch (error) {
      console.error("Fetch saved items error:", error);
    }
    return [];
  };

  useEffect(() => {
    const initializeApp = async () => {
      const user = await fetchUserDetails();
      await fetchUserAddToCart();

      if (user?._id) {
        await fetchSavedItemCount(user._id);
      }
    };

    initializeApp();
  }, []);
  useEffect(() => {
    const updateCart = () => {
      fetchUserAddToCart();
    };

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ImageSearchProvider>
        <Context.Provider
          value={{
            fetchUserDetails,
            cartProductCount,
            fetchUserAddToCart,
            savedItemCount,
            fetchSavedItemCount,
            savedItems,
            setSavedItems,
          }}
        >
          <div className="flex flex-col min-h-screen">
            <ToastContainer />
            <Header />
            <main className="flex-grow pt-16">
              <Outlet />
            </main>
            <Chatbot />
          </div>
        </Context.Provider>
      </ImageSearchProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
