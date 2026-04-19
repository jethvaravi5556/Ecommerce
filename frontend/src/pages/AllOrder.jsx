import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import moment from "moment";
import displayINRCurrency from "../helpers/displayCurrency";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");

  const fetchOrders = async () => {
    try {
      const apiUrl = SummaryApi.allOrders.url.trim().replace(/\u200B/g, "");
      const response = await fetch(apiUrl, {
        method: SummaryApi.allOrders.method,
        credentials: "include",
      });

      const responseData = await response.json();

      if (responseData.success) {
        setOrders(responseData.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (err) {
      toast.error("Error fetching orders");
      console.error(err);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const apiUrl = SummaryApi.confirmOrders.url.trim().replace(/\u200B/g, "");
      const response = await fetch(apiUrl, {
        method: SummaryApi.confirmOrders.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, status }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Order status updated");
        fetchOrders();
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Server error updating order");
      console.error(err);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, orderStatus: newStatus } : o,
      ),
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    filterStatus ? order.orderStatus === filterStatus : true,
  );

  return (
    <div>
      {/* Header Same Like AllUsers */}
      <div className="bg-white py-3 px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 rounded">
        <h2 className="font-bold text-lg">All Orders</h2>

        <select
          className="border p-2 rounded w-full sm:w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Orders</option>
          <option value="Processing">Processing</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="bg-white p-4 mt-4 rounded">
        {!filteredOrders.length ? (
          <p className="text-center">No Orders Available</p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="border p-4 mb-6 rounded shadow bg-gray-50"
            >
              <p className="text-gray-600 mb-2 font-medium">
                {moment(order.createdAt).format("LL")}
              </p>

              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Product Details */}
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

                {/* Payment & Shipping */}
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

              {/* Status Section */}
              <div className="flex flex-col sm:flex-row justify-between mt-3 items-start sm:items-center gap-2">
                <div className="font-semibold">
                  Total Amount : {displayINRCurrency(order.totalAmount)}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <select
                    className="border px-2 py-1 rounded"
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    <option value="Processing">Processing</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Delivered">Delivered</option>
                  </select>

                  <button
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() =>
                      updateOrderStatus(order._id, order.orderStatus)
                    }
                  >
                    Update
                  </button>
                </div>
              </div>

              {order.confirmedBy && (
                <p className="text-green-700 mt-2 text-sm">
                  ✅ Confirmed by Admin
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllOrders;
