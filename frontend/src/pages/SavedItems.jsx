import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import displayINRCurrency from "../helpers/displayCurrency";
import unsaveItem from "../helpers/unsaveItem";
import addToCart from "../helpers/addToCart";
import Context from "../context";
import scrollTop from "../helpers/scrollTop";

const SavedItems = () => {
  const user = useSelector((state) => state.user.user);
  const context = useContext(Context);

  const savedItems = context.savedItems || [];

  const handleUnsave = async (productId) => {
    try {
      await unsaveItem(productId, user._id);

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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Your Saved Items</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {savedItems.map((product) => (
          <div
            key={product._id}
            className="w-full bg-white rounded-sm shadow-md"
          >
            {/* IMAGE */}
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
                  alt={product?.productName}
                />
              </Link>
            </div>

            {/* DETAILS */}
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
        ))}
      </div>
    </div>
  );
};

export default SavedItems;