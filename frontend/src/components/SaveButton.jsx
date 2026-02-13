import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import saveItem from "../helpers/saveItem";
import unsaveItem from "../helpers/unsaveItem";
import SummaryApi from "../common";

const SaveButton = ({ productId, className = "" }) => {
  const user = useSelector((state) => state.user.user);
  const [isSaved, setIsSaved] = useState(false);

  const fetchSavedItems = async () => {
    if (!user?._id) return;
    try {
      const apiUrl = SummaryApi.gsaveItem.url.trim().replace(/\u200B/g, "");
      const res = await fetch(`${apiUrl}/${user._id}`, {
        method: SummaryApi.gsaveItem.method,
        credentials: "include",
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const isAlreadySaved = data.some((item) => item._id === productId);
        setIsSaved(isAlreadySaved);
      }
    } catch (err) {
      console.error("Failed to fetch saved items:", err);
    }
  };

  useEffect(() => {
    fetchSavedItems();
  }, [productId, user]);

  const handleToggleSave = async (e) => {
    e.preventDefault(); // Prevent Link click
    if (!user?._id) return alert("Login to save item");
    try {
      if (isSaved) {
        await unsaveItem(productId, user._id);
      } else {
        await saveItem(productId, user._id);
      }
      setIsSaved(!isSaved);
    } catch (err) {
      console.error("Error toggling saved item:", err);
    }
  };

  return (
    <button onClick={handleToggleSave} className={`absolute top-2 right-2 text-xl ${className}`}>
      {isSaved ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart className="text-gray-500" />}
    </button>
  );
};

export default SaveButton;