import React, { useContext, useEffect, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import { Link } from "react-router-dom";
import Context from "../context";
import scrollTop from "../helpers/scrollTop";
import SaveButton from "./SaveButton";
import addToCart from "../helpers/addToCart";

const CategoryWiseProductDisplay = ({
  category,
  heading,
  excludeProductId,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const loadingList = new Array(8).fill(null);

  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    if (!category) {
      console.warn("category is missing in CategoryWiseProductDisplay");
      return;
    }

    setLoading(true);

    const categoryProduct = await fetchCategoryWiseProduct(category);

    setLoading(false);

    const filteredProduct = categoryProduct?.data?.filter(
      (p) => p._id !== excludeProductId,
    );

    setData(filteredProduct || []);
    setTotalPage(categoryProduct?.totalPage || 1);
  };

  useEffect(() => {
    fetchData();
  }, [category, page]);

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 my-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">{heading}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden border"
              >
                <div className="bg-slate-200 h-36 sm:h-44 md:h-52 animate-pulse" />

                <div className="p-3 space-y-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-slate-200 rounded animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 w-14 bg-slate-200 rounded animate-pulse" />
                  </div>
                  <div className="h-9 bg-slate-200 rounded-full animate-pulse" />
                </div>
              </div>
            ))
          : data.map((product) => (
              <Link
                key={product?._id}
                to={"/product/" + product?._id}
                onClick={scrollTop}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border group"
              >
                <div className="relative bg-slate-100 h-36 sm:h-44 md:h-52 flex justify-center items-center overflow-hidden">
                  <div className="absolute top-2 right-2 z-10">
                    <SaveButton productId={product?._id} />
                  </div>

                  {product?.productImage?.[0] && (
                    <img
                      src={product.productImage[0]}
                      alt={product?.productName}
                      className="h-full w-full object-contain p-3 group-hover:scale-105 transition-all duration-300"
                    />
                  )}
                </div>

                <div className="p-3 sm:p-4 flex flex-col gap-2">
                  <h2 className="font-medium text-sm sm:text-base md:text-lg text-black line-clamp-1">
                    {product?.productName}
                  </h2>

                  <p className="capitalize text-slate-500 text-xs sm:text-sm line-clamp-1">
                    {product?.category}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <p className="text-red-500 font-semibold text-sm sm:text-base">
                      {displayINRCurrency(product?.sellingPrice)}
                    </p>

                    <p className="text-slate-400 line-through text-xs sm:text-sm">
                      {displayINRCurrency(product?.price)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, product?._id)}
                    className="mt-2 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white py-2 rounded-full transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
      </div>

      {totalPage > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 sm:px-4 py-1.5 border rounded-md text-sm disabled:opacity-40"
          >
            Previous
          </button>

          {Array.from({ length: totalPage }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 sm:px-4 py-1.5 border rounded-md text-sm transition-all ${
                page === i + 1
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPage}
            onClick={() => setPage(page + 1)}
            className="px-3 sm:px-4 py-1.5 border rounded-md text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryWiseProductDisplay;