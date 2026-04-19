import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import displayINRCurrency from "../helpers/displayCurrency";
import unsaveItem from "../helpers/unsaveItem";
import addToCart from "../helpers/addToCart";
import SummaryApi from "../common";
import Context from "../context";
import scrollTop from "../helpers/scrollTop";

const SavedItems = () => {
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(8).fill(null);
  const context = useContext(Context);

  const savedItems = context.savedItems || [];
  useEffect(() => {
    if (savedItems) {
      setLoading(false);
    }
  }, [savedItems]);
  const handleUnsave = async (productId) => {
    try {
      await unsaveItem(productId, user._id);

      // Update context data immediately
      const updatedItems = savedItems.filter((item) => item._id !== productId);
      context.setSavedItems(updatedItems);

      context.fetchSavedItemCount(user._id);
    } catch (err) {
      console.error("Failed to unsave item:", err);
    }
  };

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    context.fetchUserAddToCart();
  };

  if (!user?._id) return <div>Please login to see your saved items.</div>;

  return (
    <div className="container mx-auto p-4 min-h-[80vh]">
      <h2 className="text-2xl font-semibold mb-6">Your Saved Items</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {loading ? (
          loadingList.map((_, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-sm shadow-md overflow-hidden"
            >
              {/* image skeleton */}
              <div className="bg-slate-200 h-48 animate-pulse"></div>

              {/* content skeleton */}
              <div className="p-4 grid gap-2">
                <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2"></div>

                <div className="flex gap-2 mt-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-16"></div>
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-12"></div>
                </div>

                <div className="h-8 bg-slate-200 rounded-full animate-pulse mt-3"></div>
              </div>
            </div>
          ))
        ) : savedItems.length > 0 ? (
          savedItems.map((product) => (
            <div
              key={product._id}
              className="w-full bg-white rounded-sm shadow-md"
            >
              {/* IMAGE SECTION */}
              <div className="relative bg-slate-200 h-48 p-4 flex justify-center items-center">
                <button
                  onClick={() => handleUnsave(product._id)}
                  className="absolute top-2 right-2 text-red-500 text-xl hover:text-red-700 z-10"
                >
                  <MdDelete />
                </button>

                <Link
                  to={"/product/" + product?._id}
                  onClick={scrollTop}
                  className="h-full flex items-center justify-center"
                >
                  <img
                    src={product?.productImage[0]}
                    className="h-full object-scale-down hover:scale-110 transition-all mix-blend-multiply"
                  />
                </Link>
              </div>

              {/* PRODUCT DETAILS */}
              <div className="p-4 grid gap-3">
                <Link to={"/product/" + product?._id} onClick={scrollTop}>
                  <h2 className="font-medium text-base md:text-lg line-clamp-1 text-black">
                    {product?.productName}
                  </h2>

                  <p className="capitalize text-slate-500">
                    {product?.category}
                  </p>

                  <div className="flex gap-2">
                    <p className="text-red-500 font-medium">
                      {displayINRCurrency(product?.sellingPrice)}
                    </p>

                    <p className="text-slate-500 line-through">
                      {displayINRCurrency(product?.price)}
                    </p>
                  </div>
                </Link>

                <button
                  className="text-sm bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-full"
                  onClick={(e) => handleAddToCart(e, product?._id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="bg-white px-10 py-8 rounded-xl shadow text-center">
              <p className="text-2xl font-semibold text-gray-700">
                No Saved Items
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedItems;
