import React, { useContext, useEffect, useRef, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import Context from "../context";
import SaveButton from "./SaveButton";

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);

  const [scroll, setScroll] = useState(0);
  const scrollElement = useRef();

  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setLoading(false);
    setData(categoryProduct?.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 300;
  };
  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 300;
  };
  return (
    <div className="container mx-auto px-4 my-4 relative">
      <h2 className="text-2xl font-semibold py-2">{heading}</h2>

      {/* ✅ arrows here */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md rounded-full p-2 hidden md:block"
        onClick={scrollLeft}
      >
        <FaAngleLeft />
      </button>

      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md rounded-full p-2 hidden md:block"
        onClick={scrollRight}
      >
        <FaAngleRight />
      </button>

      <div
        className="flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none transition-all"
        ref={scrollElement}
      >
        {loading
          ? loadingList.map((product, index) => {
              return (
                <div
                  key={index}
                  className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow-md flex "
                >
                  <div className="bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[150px] animate-pulse">
                    {/* <img src={product?.productImage[0]} className='h-full object-scale-down hover:scale-110 transition-all'/> */}
                  </div>
                  <div className="p-4 grid w-full gap-2">
                    <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black bg-slate-200 animate-pulse p-1 rounded-full"></h2>
                    <p className="capitalize text-slate-500 bg-slate-200 animate-pulse p-1 rounded-full"></p>
                    <div className="flex gap-3 w-full">
                      <p className="text-red-500 font-medium bg-slate-200 w-full animate-pulse p-1 rounded-full"></p>
                      <p className="text-slate-500 line-through bg-slate-200 w-full animate-pulse p-1 rounded-full"></p>
                    </div>
                    <button className="text-sm  text-white px-3 py-0.5 w-full bg-slate-200 animate-pulse p-1 rounded-full"></button>
                  </div>
                </div>
              );
            })
          : Array.isArray(data) &&
            data.map((product, index) => {
              return (
                <Link
                  to={"product/" + product?._id}
                  key={product?._id || index}
                  className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-md shadow-md flex"
                >
                  <div className="relative bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[150px] rounded-t-md">
                    <SaveButton
                      className="absolute top-2 right-2 z-10"
                      productId={product?._id}
                    />
                    <img
                      src={product?.productImage[0]}
                      className="h-full object-scale-down hover:scale-110 transition-all"
                    />
                  </div>

                  <div className="p-4 grid min-w-0">
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

export default HorizontalCardProduct;
