import React, { useContext } from "react";
import scrollTop from "../helpers/scrollTop";
import addToCart from "../helpers/addToCart";
import Context from "../context";
import { Link } from "react-router-dom";
import displayINRCurrency from "../helpers/displayCurrency";
import SaveButton from "./SaveButton";

const VerticalCard = ({ loading, data = [] }) => {
  const loadingList = new Array(13).fill(null);
  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 transition-all">
        {loading
          ? loadingList.map((product, index) => {
              return (
                <div className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow-md ">
                  <div className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[150px] flex justify-center items-center"></div>
                  <div className="p-4 grid w-full gap-2">
                    <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black bg-slate-200 animate-pulse p-1 rounded-full"></h2>
                    <p className="capitalize text-slate-500 bg-slate-200 animate-pulse p-1 rounded-full"></p>
                    <div className="flex gap-2">
                      <p className="text-red-500 font-medium bg-slate-200 animate-pulse p-1 rounded-full"></p>
                      <p className="text-slate-500 line-through bg-slate-200 animate-pulse p-1 rounded-full"></p>
                    </div>
                    <button className="text-sm text-white px-3 py-0.5 rounded-full bg-slate-200 animate-pulse p-1"></button>
                  </div>
                </div>
              );
            })
          : data.map((product, index) => {
              return (
                <Link
                  key={product._id}
                  to={"/product/" + product?._id}
                  className="w-full bg-white rounded-md shadow-md"
                  onClick={scrollTop}
                >
                  <div className="relative bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[150px] flex justify-center items-center rounded-t-md ">
                    <SaveButton
                      className="absolute top-2 right-2 z-10"
                      productId={product?._id}
                    />
                    <img
                      src={product?.productImage[0]}
                      className="h-full object-scale-down hover:scale-110 transition-all mix-blend-multiply"
                    />
                  </div>
                  <div className="p-4 grid gap-3">
                    <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
                      {product?.productName}
                    </h2>
                    <p className="capitalize text-slate-500">
                      {product?.category}
                    </p>
                    <div className="flex gap-2 min-w-0 overflow-hidden">
                      <p className="text-red-500 font-medium ">
                        {displayINRCurrency(product?.sellingPrice)}
                      </p>
                      <p className="text-slate-500 line-through truncate">
                        {displayINRCurrency(product?.price)}
                      </p>
                    </div>
                    <button
                      className="text-sm bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-full"
                      onClick={(e) => handleAddToCart(e, product?._id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default VerticalCard;
