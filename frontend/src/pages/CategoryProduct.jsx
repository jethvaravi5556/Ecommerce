import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/productCategory";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import VerticalCard from "../components/VerticalCard";

const CategoryProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loadingList = new Array(12).fill(null);
  const urlSearch = new URLSearchParams(location.search);

  const urlCategoryList = urlSearch.getAll("category");
  const urlSort = urlSearch.get("sort") || "";
  const urlMin = urlSearch.get("min") || "";
  const urlMax = urlSearch.get("max") || "";
  const urlPage = Number(urlSearch.get("page")) || 1;

  const urlCategoryObject = {};
  urlCategoryList.forEach((cat) => (urlCategoryObject[cat] = true));

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectCategory, setSelectCategory] = useState(urlCategoryObject);
  const [sortOrder, setSortOrder] = useState(urlSort);
  const [minPrice, setMinPrice] = useState(urlMin);
  const [maxPrice, setMaxPrice] = useState(urlMax);
  const [showFilters, setShowFilters] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [page, setPage] = useState(urlPage);
  const [totalPage, setTotalPage] = useState(1);

  const fetchData = async (categoryArray, sortValue, min, max, pageNo) => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.filterProduct.url, {
        method: SummaryApi.filterProduct.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: categoryArray,
          sort: sortValue,
          minPrice: min,
          maxPrice: max,
          page: pageNo,
          limit: 12,
        }),
      });

      const resJson = await response.json();
      if (resJson.success) {
        setData(resJson.data);
        setTotalPage(resJson?.totalPage || 1);
      } else toast.error(resJson.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = (updatedCategory, sortVal, min, max, pageNo = 1) => {
    const params = new URLSearchParams();

    Object.keys(updatedCategory).forEach((key) => {
      if (updatedCategory[key]) params.append("category", key);
    });

    if (sortVal) params.set("sort", sortVal);
    if (min) params.set("min", min);
    if (max) params.set("max", max);

    params.set("page", pageNo);

    navigate({ search: params.toString() });
  };

  const changePage = (p) => {
    setPage(p);
    updateURL(selectCategory, sortOrder, minPrice, maxPrice, p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    const updated = { ...selectCategory, [value]: checked };
    setSelectCategory(updated);
    updateURL(updated, sortOrder, minPrice, maxPrice, 1);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortOrder(val);
    updateURL(selectCategory, val, minPrice, maxPrice, 1);
  };

  const handlePriceApply = () => {
    const min = Number(minPrice);
    const max = Number(maxPrice);

    if (minPrice && maxPrice && min > max) {
      setPriceError("Minimum price should be less than maximum price");
      return;
    }

    setPriceError("");
    updateURL(selectCategory, sortOrder, minPrice, maxPrice, 1);
  };

  const handleClearFilters = () => {
    setSelectCategory({});
    setSortOrder("");
    setMinPrice("");
    setMaxPrice("");
    navigate("");
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const categoryArray = params.getAll("category");
    const sortValue = params.get("sort") || "";
    const min = params.get("min") || "";
    const max = params.get("max") || "";
    const pageNo = Number(params.get("page")) || 1;

    setPage(pageNo);

    fetchData(categoryArray, sortValue, min, max, pageNo);
  }, [location.search]);

  // pagination renderer
  const renderPagination = () => {
    if (totalPage <= 1) return null;

    const pages = [];

    for (let i = 1; i <= totalPage; i++) {
      if (i === 1 || i === totalPage || Math.abs(i - page) <= 1) {
        pages.push(i);
      } else if (i === page - 2 || i === page + 2) {
        pages.push("...");
      }
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        <button
          disabled={page === 1}
          onClick={() => changePage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Previous
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={i} className="px-2">
              ...
            </span>
          ) : (
            <button
              key={i}
              onClick={() => changePage(p)}
              className={`px-3 py-1 border rounded ${
                page === p ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          disabled={page === totalPage}
          onClick={() => changePage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex lg:hidden justify-between mb-3">
        <h2 className="font-semibold">Products</h2>
        <button onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar */}
        <div
          className={`bg-white p-3 w-full lg:w-[260px] lg:min-w-[260px]
  ${showFilters ? "block" : "hidden"} lg:block
  lg:self-start
  lg:sticky lg:top-20
  lg:max-h-[calc(100vh-115px)]
  lg:overflow-y-auto`}
        >
          <div className="flex justify-between mb-2">
            {" "}
            <h3 className="font-medium">Filters</h3>{" "}
            <button
              onClick={handleClearFilters}
              className="text-red-500 text-xs"
            >
              {" "}
              Clear{" "}
            </button>{" "}
          </div>{" "}
          {/* Sort */}{" "}
          <h4 className="text-sm font-medium border-b pb-1">Sort</h4>{" "}
          <div className="text-sm py-2 flex flex-col gap-2">
            {" "}
            <label>
              {" "}
              <input
                type="radio"
                value="low_to_high"
                checked={sortOrder === "low_to_high"}
                onChange={handleSortChange}
              />{" "}
              Low to High{" "}
            </label>{" "}
            <label>
              {" "}
              <input
                type="radio"
                value="high_to_low"
                checked={sortOrder === "high_to_low"}
                onChange={handleSortChange}
              />{" "}
              High to Low{" "}
            </label>{" "}
          </div>{" "}
          {/* Category */}{" "}
          <h4 className="text-sm font-medium border-b pb-1 mt-3">Category</h4>{" "}
          <div className="text-sm py-2 flex flex-col gap-2">
            {" "}
            {productCategory.map((cat) => (
              <label key={cat.value}>
                {" "}
                <input
                  type="checkbox"
                  value={cat.value}
                  checked={selectCategory[cat.value] || false}
                  onChange={handleSelectCategory}
                />{" "}
                {cat.label}{" "}
              </label>
            ))}{" "}
          </div>{" "}
          {/* PRICE RANGE ⭐ */}{" "}
          <h4 className="text-sm font-medium border-b pb-1 mt-3">Price</h4>{" "}
          <div className="flex gap-2 mt-2">
            {" "}
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border p-1 w-full text-sm"
            />{" "}
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border p-1 w-full text-sm"
            />{" "}
          </div>{" "}
          {priceError && (
            <p className="text-red-500 text-xs mt-1">{priceError}</p>
          )}
          <button
            onClick={handlePriceApply}
            className="bg-red-600 hover:bg-red-700 text-white w-full mt-2 py-1 text-sm"
          >
            {" "}
            Apply{" "}
          </button>{" "}
        </div>

        {/* Products */}
        {/* Products */}
        <div className="flex-1">
          {loading ? (
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
          ) : data.length > 0 ? (
            <>
              <VerticalCard data={data} loading={loading} />
              {renderPagination()}
            </>
          ) : (
            <p>No Products</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
