import SummaryApi from "../common";
import { toast } from "react-toastify";

const addToCart = async (e, id) => {
  e?.stopPropagation();
  e?.preventDefault();

  // Ensure the URL is correctly formatted
  let apiUrl = SummaryApi.addToCartProduct.url.trim();
  apiUrl = apiUrl.replace(/\u200B/g, "");

  try {
    const response = await fetch(apiUrl, {
      method: SummaryApi.addToCartProduct.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: id,
      }),
    });

    // If user not logged in
    if (response.status === 401) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData.message);
    }

    if (responseData.error) {
      toast.error(responseData.message);
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    alert("Error connecting to the server");
  }
};

export default addToCart;