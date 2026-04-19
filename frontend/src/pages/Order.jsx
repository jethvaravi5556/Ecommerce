import React, { useEffect, useState } from "react";
import moment from "moment";
import SummaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const apiUrl = SummaryApi.order.url.trim().replace(/\u200B/g, "");
      const response = await fetch(apiUrl, {
        method: SummaryApi.order.method,
        credentials: "include",
      });
      const responseData = await response.json();
      console.log("Orders fetched:", responseData);

      if (responseData.success) {
        setOrders(responseData.data);
      } else {
        console.error("Failed to fetch orders:", responseData);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-center text-2xl font-semibold mb-4">Your Orders</h2>

      {!orders.length ? (
        <p className="text-center">No Order Available</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 mb-6 rounded shadow bg-gray-50"
            >
              {/* Date & Status */}
              <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                <p className="font-medium">
                  {moment(order.createdAt).format("LL")}
                </p>
                <p className="text-blue-600 font-semibold">
                  Status: {order.orderStatus || "Processing"}
                </p>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Left: Product List */}
                <div className="flex flex-col gap-2">
                  {order.productDetails.map((product, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <img
                        src={product.image?.[0]}
                        alt={product.name}
                        className="w-20 h-20 bg-white object-scale-down p-1 border"
                      />
                      <div>
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-red-500">
                          {displayINRCurrency(product.unitPrice)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity : {product.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: Payment & Shipping Info */}
                <div className="p-1 rounded-md w-full md:w-1/3">
                  <div className="mb-3">
                    <h4 className="font-semibold">Payment Details :</h4>
                    <p>
                      Payment method :{" "}
                      {order.paymentDetails?.payment_method_type?.[0]}
                    </p>
                    <p>
                      Payment Status : {order.paymentDetails?.payment_status}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Shipping Details :</h4>
                    <p>
                      Shipping Amount :{" "}
                      {displayINRCurrency(order.shippingAddress?.rateAmount)}
                    </p>
                    <p>To: {order.shippingAddress?.name}</p>
                    <p>Address: {order.shippingAddress?.address}</p>
                  </div>
                </div>
              </div>

              {/* Bottom: Total */}
              <div className="text-right mt-3 font-semibold">
                Total Amount : {displayINRCurrency(order.totalAmount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
