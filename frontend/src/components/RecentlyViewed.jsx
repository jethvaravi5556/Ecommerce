import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SummaryApi from "../common";
import VerticalCard from "./VerticalCard";

const RecentlyViewed = () => {
  const [products, setProducts] = useState([]);
  const { pathname } = useLocation();

  const fetchRecentProducts = async () => {
    const idsFromRecentlyViewed =
      JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const idsFromRecentProducts =
      JSON.parse(localStorage.getItem("recentProducts")) || [];

    const ids = (
      idsFromRecentlyViewed.length
        ? idsFromRecentlyViewed
        : idsFromRecentProducts
    ).slice(0, 8);

    if (ids.length === 0) {
      setProducts([]);
      return;
    }

    const apiUrl = SummaryApi.getRecentlyProducts.url;

    const response = await fetch(apiUrl, {
      method: SummaryApi.getRecentlyProducts.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });

    const data = await response.json();

    if (data.success) {
      setProducts(data.data);
    }
  };

  useEffect(() => {
    fetchRecentProducts();
  }, [pathname]);

  if (products.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-3">Recently Viewed</h2>
      <VerticalCard data={products} />
    </div>
  );
};

export default RecentlyViewed;
