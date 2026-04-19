const displayINRCurrency = (num) => {
  if (!num || num > 10000000) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(num);
};

export default displayINRCurrency;
