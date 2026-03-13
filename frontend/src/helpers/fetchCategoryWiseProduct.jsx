import SummaryApi from "../common";

const fetchCategoryWiseProduct = async (category) => {
  if (!category || typeof category !== "string") {
    console.warn("⚠️ Invalid or missing category:", category);
    return { data: [] }; // Prevent crash and return empty data
  }

  let apiUrl = SummaryApi.categoryWiseProduct.url.trim();
  apiUrl = apiUrl.replace(/\u200B/g, ""); // Remove ZWSP if any

  try {
    const response = await fetch(apiUrl, {
      method: SummaryApi.categoryWiseProduct.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error:", response.status, errorText);
      return { data: [] };
    }

    const dataApi = await response.json();
    return dataApi;
  } catch (error) {
    console.error("❌ Fetch error:", error);
    alert("Error connecting to the server");
    return { data: [] };
  }
};


export default fetchCategoryWiseProduct