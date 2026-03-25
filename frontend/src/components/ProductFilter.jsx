import React from "react";

const ProductFilter = ({ categoryList, setCategoryList, sort, setSort }) => {
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setCategoryList((prev) => [...prev, value]);
    } else {
      setCategoryList((prev) => prev.filter((cat) => cat !== value));
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold text-lg mb-3">Filters</h2>

      {/* Category Filter */}
      <div className="mb-5">
        <h3 className="font-medium mb-2">Category</h3>

        <div className="flex flex-col gap-2 text-sm">
          <label>
            <input
              type="checkbox"
              value="airpods"
              onChange={handleCategoryChange}
            />{" "}
            Airpods
          </label>

          <label>
            <input
              type="checkbox"
              value="mobiles"
              onChange={handleCategoryChange}
            />{" "}
            Mobiles
          </label>

          <label>
            <input
              type="checkbox"
              value="laptops"
              onChange={handleCategoryChange}
            />{" "}
            Laptops
          </label>

          <label>
            <input
              type="checkbox"
              value="watches"
              onChange={handleCategoryChange}
            />{" "}
            Watches
          </label>
        </div>
      </div>

      {/* Price Sort */}
      <div>
        <h3 className="font-medium mb-2">Sort By Price</h3>

        <div className="flex flex-col gap-2 text-sm">
          <label>
            <input
              type="radio"
              name="sort"
              onChange={() => setSort("low_to_high")}
            />{" "}
            Low to High
          </label>

          <label>
            <input
              type="radio"
              name="sort"
              onChange={() => setSort("high_to_low")}
            />{" "}
            High to Low
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
