import SummaryApi from "../common";

const unsaveItem = async (productId, userId) => {
  const apiUrl = SummaryApi.unsaveItem.url.trim().replace(/\u200B/g, "");
  const response = await fetch(apiUrl, {
    method: SummaryApi.unsaveItem.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, productId }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to unsave item");
  }

  return await response.json();
};

export default unsaveItem;