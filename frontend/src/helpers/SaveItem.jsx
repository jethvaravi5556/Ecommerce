import SummaryApi from "../common";

const saveItem = async (productId, userId) => {
  const apiUrl = SummaryApi.psaveItem.url.trim().replace(/\u200B/g, "");
  const response = await fetch(apiUrl, {
    method: SummaryApi.psaveItem.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, productId }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to save item");
  }

  return await response.json();
};

export default saveItem;
