import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Context from "../context";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";
import { current } from "@reduxjs/toolkit";
// import Stripe from "stripe";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const loadingCart = new Array(context.cartProductCount).fill(null);

  const fetchData = async () => {
    // setLoading(true);
    const apiUrl = SummaryApi.addToCartViewProduct.url
      .trim()
      .replace(/\u200B/g, "");
    const response = await fetch(apiUrl, {
      method: SummaryApi.addToCartViewProduct.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // setLoading(false);
    const responseData = await response.json();

    if (responseData.success) {
      setData(responseData.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const increaseQty = async (id, qty) => {
    // setLoading(true);
    const apiUrl = SummaryApi.updateAddToCartProduct.url
      .trim()
      .replace(/\u200B/g, "");
    const response = await fetch(apiUrl, {
      method: SummaryApi.updateAddToCartProduct.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
        quantity: qty + 1,
      }),
    });

    // setLoading(false);
    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
    }
  };

  const decreaseQty = async (id, qty) => {
    if (qty <= 1) return; // prevent going below 1
    // setLoading(true);
    const apiUrl = SummaryApi.updateAddToCartProduct.url
      .trim()
      .replace(/\u200B/g, "");
    const response = await fetch(apiUrl, {
      method: SummaryApi.updateAddToCartProduct.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
        quantity: qty - 1,
      }),
    });
    // setLoading(false);
    const responseData = await response.json();
    if (responseData.success) {
      fetchData();
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    const apiUrl = SummaryApi.deleteAddToCartProduct.url
      .trim()
      .replace(/\u200B/g, "");
    const response = await fetch(apiUrl, {
      method: SummaryApi.deleteAddToCartProduct.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
      }),
    });

    const responseData = await response.json();
    console.log(responseData);
    setLoading(false);

    if (responseData.success) {
      toast.success("Item removed from cart");
      context.fetchUserAddToCart();
      fetchData();
    } else {
      toast.error("Failed to delete item");
    }
  };

  const totalQty = data.reduce(
    (previousValue, currentValue) => previousValue + currentValue.quantity,
    0,
  );
  const totalAmount = data.reduce(
    (preve, item) => preve + item?.productId?.sellingPrice * item?.quantity,
    0,
  );

  const handlePayment = async () => {
    const apiUrl = SummaryApi.payment.url.trim().replace(/\u200B/g, "");
    const response = await fetch(apiUrl, {
      method: SummaryApi.payment.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartItems: data,
      }),
    });

    // setLoading(false);
    const responseData = await response.json();
    console.log("paynebt f", responseData);
    if (responseData?.url) {
      window.location.href = responseData.url;
    } else {
      toast.error("Failed to create Stripe session");
    }
  };

  return (
    <div className="container mx-auto px-8">
      <div className="text-center text-lg my-3">
        {data.length === 0 && !loading && (
          <p className="py-5 mt-10 bg-white">No data</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 justify-between">
        {/* view product */}
        <div className="w-full max-w-5xl">
          {loading
            ? loadingCart.map((_, index) => (
                <div
                  key={index}
                  className="w-full my-2 bg-slate-200 h-32 border border-slate-300 animate-pulse rounded"
                ></div>
              ))
            : data.map((product) => (
                <div
                  key={product?._id}
                  className="w-full my-2 bg-white h-32 border border-slate-300 rounded flex relative"
                >
                  <div className="w-32 h-full bg-slate-200">
                    <img
                      src={product?.productId?.productImage[0]}
                      className="h-full w-full object-scale-down mix-blend-multiply"
                      alt="product"
                    />
                  </div>

                  <div className="px-4 py-2">
                    {/* delete product */}
                    <div
                      className="absolute right-0 text-red-600 hover:bg-red-100 rounded-full p-2"
                      onClick={() => deleteProduct(product?._id)}
                    >
                      <MdDelete />
                    </div>

                    <h2 className="text-lg lg:text-xl text-ellipsis line-clamp-1">
                      {product?.productId?.productName}
                    </h2>
                    <p className="capitalize text-slate-500">
                      {product?.productId?.category}
                    </p>
                    <div className="flex items-center gap-5">
                      <p className="text-red-500 font-medium">
                        {displayINRCurrency(product?.productId?.sellingPrice)}
                      </p>
                      <p className="text-slate-500 font-semibold">
                        {displayINRCurrency(
                          product?.productId?.sellingPrice * product?.quantity,
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        className="w-6 h-6 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex justify-center items-center rounded"
                        onClick={() =>
                          decreaseQty(product?._id, product?.quantity)
                        }
                      >
                        -
                      </button>
                      <span>{product?.quantity}</span>
                      <button
                        className="w-6 h-6 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex justify-center items-center rounded"
                        onClick={() =>
                          increaseQty(product?._id, product?.quantity)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* total of product */}
        {data[0] && (
          <div className="mt-5 lg:mt-0 w-full max-w-sm">
            {loading ? (
              <div className="h-36 bg-slate-200 border border-slate-300 animate-pulse">
                total
              </div>
            ) : (
              <div className="h-36 bg-white rounded border border-slate-300">
                <h2 className="bg-red-600 text-white px-4 py-1">summary</h2>

                <div className="flex items-center justify-between px-4 gap-2 text-lg">
                  <p>Quantity:</p>
                  <p>{totalQty}</p>
                </div>

                <div className="flex items-center justify-between px-4 gap-2 text-lg">
                  <p className=" font-semibold">Total Price:</p>
                  <p className=" text-red-600 font-bold">
                    {displayINRCurrency(totalAmount)}
                  </p>
                </div>

                <button
                  className="bg-blue-600 text-white p-4 w-full mt-2"
                  onClick={handlePayment}
                >
                  Payment
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
