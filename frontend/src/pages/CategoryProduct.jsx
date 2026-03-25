import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/productCategory";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import VerticalCard from "../components/VerticalCard";

const CategoryProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryList = urlSearch.getAll("category");
  const urlSort = urlSearch.get("sort") || "";

  const urlCategoryObject = {};
  urlCategoryList.forEach((cat) => (urlCategoryObject[cat] = true));

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectCategory, setSelectCategory] = useState(urlCategoryObject);
  const [sortOrder, setSortOrder] = useState(urlSort);
  const [showFilters, setShowFilters] = useState(false); // new state

  const fetchData = async (categoryArray, sortValue) => {
    setLoading(true);
    try {
      const apiUrl = SummaryApi.filterProduct.url.trim().replace(/\u200B/g, "");
      const response = await fetch(apiUrl, {
        method: SummaryApi.filterProduct.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: categoryArray,
          sort: sortValue,
        }),
      });

      const resJson = await response.json();
      if (resJson.success) {
        setData(resJson.data);
      } else {
        toast.error(resJson.message || "Fetch error");
      }
    } catch (err) {
      toast.error(err.message || "Network issue");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    const updated = {
      ...selectCategory,
      [value]: checked,
    };
    setSelectCategory(updated);

    const newQuery = new URLSearchParams();
    Object.keys(updated).forEach((key) => {
      if (updated[key]) {
        newQuery.append("category", key);
      }
    });
    if (sortOrder) newQuery.set("sort", sortOrder);
    navigate({ search: newQuery.toString() }, { replace: false });
  };

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortOrder(selectedSort);

    const updatedParams = new URLSearchParams();
    Object.keys(selectCategory).forEach((key) => {
      if (selectCategory[key]) {
        updatedParams.append("category", key);
      }
    });
    if (selectedSort) {
      updatedParams.set("sort", selectedSort);
    }
    navigate({ search: updatedParams.toString() }, { replace: false });
  };

  const handleClearFilters = () => {
    setSelectCategory({});
    setSortOrder("");
    navigate("", { replace: false });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryArray = searchParams.getAll("category");
    const sortValue = searchParams.get("sort") || "";
    const newCategoryObj = {};
    categoryArray.forEach((cat) => (newCategoryObj[cat] = true));
    setSelectCategory(newCategoryObj);
    setSortOrder(sortValue);
    fetchData(categoryArray, sortValue);
  }, [location.search]);

  return (
    <div className="container mx-auto p-4 px-4">
      {/* Toggle Button (Mobile Only) */}
      <div className="flex items-center justify-between lg:hidden mb-4">
        <h2 className="text-lg font-semibold">Products</h2>
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="text-sm text-blue-600"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Desktop and Mobile Wrapper */}
      <div className="lg:flex lg:gap-4">
        {/* Sidebar */}
        <div
          className={`w-full lg:w-[200px] bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll
          ${showFilters ? "block" : "hidden"} lg:block`}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base uppercase font-medium text-slate-500">
              Filters
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-xs text-red-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          <h4 className="text-sm font-medium border-b pb-1">Sort by</h4>
          <form className="text-sm flex flex-col gap-2 py-2">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="sort"
                value="low_to_high"
                checked={sortOrder === "low_to_high"}
                onChange={handleSortChange}
              />
              <label>Price - Low To High</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="sort"
                value="high_to_low"
                checked={sortOrder === "high_to_low"}
                onChange={handleSortChange}
              />
              <label>Price - High To Low</label>
            </div>
          </form>

          <h4 className="text-sm font-medium border-b pb-1 mt-4">Category</h4>
          <form className="text-sm flex flex-col gap-2 py-2">
            {productCategory.map((cat) => (
              <div key={cat.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="category"
                  value={cat.value}
                  id={cat.value}
                  checked={selectCategory[cat.value] || false}
                  onChange={handleSelectCategory}
                />
                <label htmlFor={cat.value}>{cat.label}</label>
              </div>
            ))}
          </form>
        </div>

        {/* Product List */}
        <div className="flex-1">
          {!loading && data.length > 0 ? (
            <VerticalCard data={data} loading={loading} />
          ) : loading ? (
            <p className="p-4">Loading...</p>
          ) : (
            <p className="p-4">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
