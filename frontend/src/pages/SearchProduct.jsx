import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import VerticalCard from "../components/VerticalCard";

const SearchProduct = () => {
  const loadingList = new Array(12).fill(null);
  const location = useLocation();
  const navigate = useNavigate();

  const searchKeyword = new URLSearchParams(location.search).get("q");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const apiUrl = SummaryApi.SearchProduct.url.trim().replace(/\u200B/g, "");

      const params = new URLSearchParams({
        q: searchKeyword,
        sort,
        minPrice,
        maxPrice,
        page,
        limit: 8,
      });

      const response = await fetch(`${apiUrl}?${params}`, {
        method: SummaryApi.SearchProduct.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      console.log("search data", responseData);

      if (responseData.success) {
        setData(responseData.data);
        setTotalPage(responseData.totalPage);
      }
    } catch (error) {
      console.error("Search error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchKeyword) {
      navigate("/");
      return;
    }

    fetchProduct();
  }, [searchKeyword, sort, page]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-3 mb-4 flex-wrap">
        <select
          className="border p-2 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort</option>
          <option value="low_to_high">Low → High</option>
          <option value="high_to_low">High → Low</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          className="border p-2 rounded"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Price"
          className="border p-2 rounded"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button
          onClick={fetchProduct}
          className="bg-red-600 text-white px-4 rounded"
        >
          Apply
        </button>
      </div>

      {/* Skeleton Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loadingList.map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <div className="bg-slate-200 h-48 animate-pulse"></div>

              <div className="p-4 grid gap-2">
                <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2"></div>

                <div className="flex gap-2 mt-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-16"></div>
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-12"></div>
                </div>

                <div className="h-8 bg-slate-200 rounded-full animate-pulse mt-3"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && <p className="mb-4">Search Result: {data.length}</p>}

      {!loading && data.length === 0 && (
        <p className="bg-white text-lg text-center p-4">No Data Found...</p>
      )}

      {!loading && data.length !== 0 && (
        <VerticalCard loading={loading} data={data} />
      )}
      {!loading && totalPage > 1 && (
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

export default SearchProduct;
