import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import UploadProduct from "../components/UploadProduct";
import AdminProductCard from "../components/AdminProductCard";

const AllProducts = () => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [openUploadProduct, setOpenUploadProduct] = useState(false);

  const fetchAllProducts = async () => {
    const response = await fetch(
      `${SummaryApi.allProduct.url}?page=${page}&limit=20`,
      {
        method: SummaryApi.allProduct.method,
        credentials: "include",
      },
    );

    const dataResponse = await response.json();

    if (dataResponse.success) {
      setAllProducts(dataResponse?.data || []);
      setTotalPage(dataResponse.totalPage);
    } else {
      toast.error(dataResponse.message);
    }
  };
  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    const response = await fetch(`${SummaryApi.deleteProduct.url}/${id}`, {
      method: SummaryApi.deleteProduct.method,
      credentials: "include",
    });

    const data = await response.json();

    if (data.success) {
      toast.success(data.message);
      fetchAllProducts(); // refresh list
    } else {
      toast.error(data.message);
    }
  };
  useEffect(() => {
    fetchAllProducts();
  }, [page]);

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
            onDelete={handleDeleteProduct}
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
      {totalPage > 1 && (
        <div className="flex justify-center mt-8 gap-2 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>

          {[...Array(totalPage)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 ? "bg-red-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPage}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
