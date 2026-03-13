import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import displayINRCurrency from "../helpers/displayCurrency";
import unsaveItem from "../helpers/unsaveItem";
import SummaryApi from "../common";

const SavedItems = () => {
  const user = useSelector((state) => state.user.user);
  const [savedItems, setSavedItems] = useState([]);

  const fetchSavedItems = async () => {
    try {
      const apiUrl = SummaryApi.gsaveItem.url.trim().replace(/\u200B/g, "");
      const res = await fetch(`${apiUrl}/${user._id}`, {
        method: SummaryApi.gsaveItem.method,
        credentials: "include",
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setSavedItems(data);
      } else {
        setSavedItems([]);
        console.error("Saved items is not an array:", data);
      }
    } catch (err) {
      console.error("Error fetching saved items:", err);
    }
  };

  const handleUnsave = async (productId) => {
    try {
      await unsaveItem(productId, user._id);
      setSavedItems((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      console.error("Failed to unsave item:", err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchSavedItems();
    }
  }, [user]);

  if (!user?._id) return <div>Please login to see your saved items.</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Saved Items</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {savedItems.map((product) => (
          <div key={product._id} className="bg-white p-4 shadow rounded">
            <Link to={`/product/${product._id}`}>
              <img
                src={product.productImage[0]}
                className="w-full h-40 object-contain mb-2"
                alt={product.productName}
              />
              <h3 className="font-medium">{product.productName}</h3>
              <p className="text-sm text-slate-500">{product.category}</p>
              <div className="flex gap-2">
                <p className="text-red-500 font-medium">
                  {displayINRCurrency(product.sellingPrice)}
                </p>
                <p className="text-slate-500 line-through">
                  {displayINRCurrency(product.price)}
                </p>
              </div>
            </Link>
            <button
              onClick={() => handleUnsave(product._id)}
              className="mt-2 text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedItems;
