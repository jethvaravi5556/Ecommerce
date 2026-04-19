import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const CategoryList = () => {
  const [loading, setLoading] = useState(false);
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [isSticky, setIsSticky] = useState(false);

  const categoryLoading = new Array(10).fill(null);

  const fetchCategoryProduct = async () => {
    setLoading(true);

    let apiUrl = SummaryApi.categoryProduct.url.trim();
    apiUrl = apiUrl.replace(/\u200B/g, "");

    const res = await fetch(apiUrl, {
      method: SummaryApi.categoryProduct.method,
      credentials: "include",
    });

    const dataResponse = await res.json();

    if (dataResponse.success) {
      setCategoryProduct(dataResponse.data);
    } else {
      toast.error(dataResponse.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategoryProduct();

    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`w-full sticky top-16  z-40 bg-white/80 backdrop-blur-md
      transition-all duration-300
      ${isSticky ? "shadow border-b py-2" : "py-4"}
    `}
    >
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center gap-6 justify-between overflow-x-auto scrollbar-none
          scroll-smooth`}
        >
          {loading
            ? categoryLoading.map((_, index) => (
                <div
                  key={index}
                  className="h-10 w-24 bg-slate-200 animate-pulse rounded-full"
                ></div>
              ))
            : categoryProduct.map((product) => (
                <Link
                  key={product?.category}
                  to={"/product-category?category=" + product?.category}
                  className={`min-w-fit flex flex-col items-center transition-all duration-300
                  
                  ${
                    isSticky
                      ? "px-4 py-1.5 bg-slate-100 rounded-full hover:bg-red-500 hover:text-white shadow-sm hover:shadow-md hover:-translate-y-[1px]"
                      : ""
                  }
                  
                  `}
                >
                  <div
                    className={`rounded-full overflow-hidden bg-slate-200 flex items-center justify-center
                    transition-all duration-300
                    ${
                      isSticky
                        ? "h-0 w-0 opacity-0 mb-0 "
                        : "h-16 w-16 md:h-20 md:w-20 p-3 mb-1  opacity-100"
                    }
                  `}
                  >
                    <img
                      src={product?.productImage[0]}
                      alt={product?.category}
                      className="h-full object-scale-down mix-blend-multiply"
                    />
                  </div>

                  <p className="text-sm md:text-base capitalize whitespace-nowrap font-medium">
                    {product?.category}
                  </p>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
