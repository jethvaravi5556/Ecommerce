import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import UploadProduct from "../components/UploadProduct";
import AdminProductCard from "../components/AdminProductCard";

const AllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [openUploadProduct, setOpenUploadProduct] = useState(false);

  const fetchAllProducts = async () => {
    const fetchData = await fetch(SummaryApi.allProduct.url, {
      method: SummaryApi.allProduct.method,
      credentials: "include",
    });

    const dataResponse = await fetchData.json();

    if (dataResponse.success) {
      setAllProducts(dataResponse?.data || []);
    } else {
      toast.error(dataResponse.message);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const categoryList = [
    ...new Set(allProducts.map((product) => product.category)),
  ];

  const filteredProducts = allProducts.filter((product) =>
    filterCategory ? product.category === filterCategory : true,
  );

  return (
    <div>
      {/* Header */}
      <div className="bg-white py-3 px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 rounded">
        <h2 className="font-bold text-lg">All Products</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <select
            className="border p-2 rounded w-full sm:w-auto"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Products</option>

            {categoryList.map((cat, index) => (
              <option key={index}>{cat}</option>
            ))}
          </select>

          <button
            className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2 px-3 rounded-full transition-all"
            onClick={() => setOpenUploadProduct(true)}
          >
            Upload Product
          </button>
        </div>
      </div>

      {/* Products */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-5 py-6">
        {filteredProducts.map((product, index) => (
          <AdminProductCard
            data={product}
            key={index}
            fetchData={fetchAllProducts}
          />
        ))}
      </div>

      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProducts}
        />
      )}

      {!filteredProducts.length && (
        <p className="text-center mt-4">No Products Found</p>
      )}
    </div>
  );
};

export default AllProducts;
