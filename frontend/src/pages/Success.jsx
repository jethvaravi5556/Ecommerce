import React from "react";
// import { Link } from "react-router-dom";
import successImage from "../assest/success.gif"; // You must download the JSON
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="flex flex-col justify-center items-center text-green-700">
      {/* <div className=""> */}
        <img src={successImage} width={200} height={200}/>
      {/* </div> */}
      <h1 className="text-3xl font-bold mb-4">🎉 Payment Successful!</h1>
      <p className="text-lg mb-6">Thank you for your purchase.</p>
      <Link
        to="/order"
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        See Order
      </Link>
    </div>
  );
};

export default Success;
