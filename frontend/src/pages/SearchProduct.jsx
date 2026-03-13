import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import VerticalCard from "../components/VerticalCard";

const SearchProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchKeyword = new URLSearchParams(location.search).get("q");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const apiUrl = SummaryApi.SearchProduct.url.trim().replace(/\u200B/g, "");
      const response = await fetch(`${apiUrl}?q=${searchKeyword}`, {
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
      }
    } catch (error) {
      console.error("Search error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchKeyword) {
      navigate("/"); // redirect to home page
      return;
    }

    fetchProduct();
  }, [searchKeyword]);

  return (
    <div className="container mx-auto p-4">
      {loading && <p className="text-lg text-center">loading...</p>}

      {!loading && <p>Search Result: {data.length}</p>}

      {!loading && data.length === 0 && (
        <p className="bg-white text-lg text-center p-4">No Data Found...</p>
      )}

      {!loading && data.length !== 0 && (
        <VerticalCard loading={loading} data={data} />
      )}
    </div>
  );
};

export default SearchProduct;
