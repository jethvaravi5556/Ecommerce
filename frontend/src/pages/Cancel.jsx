import React from "react";
import { Link } from "react-router-dom";
// import Lottie from "lottie-react";
import cancelImage from "../assest/cancel.gif"; // Download and place this

const Cancel = () => {
  return (
    <div className=" flex flex-col justify-center items-center text-red-700">
      {/* <div className="w-60 h-60"> */}
        <img src={cancelImage} width={200} height={200} />
      {/* </div> */}
      <h1 className="text-3xl font-bold mb-4">❌ Payment Cancelled</h1>
      <p className="text-lg mb-6">Your payment was not completed.</p>
      <Link
        to="/cart"
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
      >
        Return to Cart
      </Link>
    </div>
  );
};

export default Cancel;
