import React, { useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    const apiUrl = SummaryApi.sendOtp.url.trim().replace(/\u200B/g, "");
      const response = await fetch(apiUrl, {
        method: SummaryApi.sendOtp.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (data.success) {
      toast.success(data.message);
      localStorage.setItem("resetEmail", email);
      window.location.href = "/verify-otp";
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">Enter your registered email to receive an OTP</p>
        <input
          type="email"
          placeholder="Email address"
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded transition"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
