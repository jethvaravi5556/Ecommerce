import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import UploadProduct from "../components/UploadProduct";
import AdminProductCard from "../components/AdminProductCard";

const AllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState(null);

  const fetchAllProducts = async () => {
    const fetchData = await fetch(SummaryApi.allProduct.url, {
      method: SummaryApi.allProduct.method,
      credentials: "include",
    });

    const dataResponse = await fetchData.json();

    if (dataResponse.success) {
      console.log(dataResponse?.data);
      setAllProducts(dataResponse?.data || []);
    } else {
      toast.error(dataResponse.message);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div>
      <div className="bg-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">All Products</h2>
        <button
          className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-1 px-3 rounded-full transition-all"
          onClick={() => setOpenUploadProduct(true)}
        >
          Upload Product
        </button>
      </div>

      {/* all product */}

      <div className="flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-180px)] overflow-y-scroll">
        {allProducts.map((product, index) => {
          return (
            <AdminProductCard
              data={product}
              key={index + "allProduct"}
              fetchData={fetchAllProducts}
            />
          );
        })}
      </div>

      {/* upload Product Compenent */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProducts}
        />
      )}
    </div>
  );
};

export default AllProducts;
