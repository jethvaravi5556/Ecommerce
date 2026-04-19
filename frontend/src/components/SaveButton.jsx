import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import saveItem from "../helpers/saveItem";
import unsaveItem from "../helpers/unsaveItem";
import Context from "../context";

const SaveButton = ({ productId, className = "" }) => {
  const user = useSelector((state) => state.user.user);
  const context = useContext(Context);
  const navigate = useNavigate();

  const isSaved =
    context.savedItems?.some((item) => item._id === productId) || false;

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?._id) {
      alert("Login to save item");
      navigate("/login");
      return;
    }

    try {
      if (isSaved) {
        await unsaveItem(productId, user._id);

        const updatedItems = context.savedItems.filter(
          (item) => item._id !== productId,
        );
        context.setSavedItems(updatedItems);
        await context.fetchSavedItemCount(user._id);
      } else {
        await saveItem(productId, user._id);
        await context.fetchSavedItemCount(user._id);
      }
    } catch (err) {
      console.error("Error toggling saved item:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleSave}
      className={`absolute top-2 right-2 text-xl ${className}`}
    >
      {isSaved ? (
        <AiFillHeart className="text-red-500" />
      ) : (
        <AiOutlineHeart className="text-gray-500" />
      )}
    </button>
  );
};

export default SaveButton;
