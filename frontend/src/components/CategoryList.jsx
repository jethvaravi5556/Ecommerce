import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const CategoryList = () => {
  const [loading, setLoading] = useState(false);
  const [categoryProduct, setCategoryProduct] = useState([]);
  const categoryLoading = new Array(13).fill(null);

  const fetchCategoryProduct = async () => {
    setLoading(true);

    let apiUrl = SummaryApi.categoryProduct.url.trim();
    apiUrl = apiUrl.replace(/\u200B/g, ""); // Remove hidden characters

    const fetchData = await fetch(apiUrl, {
      method: SummaryApi.categoryProduct.method,
      credentials: "include",
    });

    const dataResponse = await fetchData.json();

    if (dataResponse.success) {
      setLoading(false);
      setCategoryProduct(dataResponse.data);
    } else {
      toast.error(dataResponse.message);
    }
  };

  useEffect(() => {
    fetchCategoryProduct();
  }, []);
  return (
    <div className="container mx-auto p-4 px-4">
      <div className="flex items-center gap-4 justify-between overflow-x-auto scrollbar-none">
        {loading
          ? categoryLoading.map((e1, index) => {
              return (
                <div
                  className="h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 animate-pulse"
                  key={"categoryLoading" + index}
                ></div>
              );
            })
          : categoryProduct.map((product, index) => {
              return (
                <Link
                  to={"/product-category?category=" + product?.category}
                  className="cursor-pointer"
                  key={product?.category}
                >
                  <div className="h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center">
                    <img
                      src={product?.productImage[0]}
                      alt={product?.category}
                      className="h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all"
                    />
                  </div>
                  <p className="text-center text-sm md:text-base capitalize">
                    {product?.category}
                  </p>
                </Link>
              );
            })}
      </div>
      <div></div>
    </div>
  );
};

export default CategoryList;
