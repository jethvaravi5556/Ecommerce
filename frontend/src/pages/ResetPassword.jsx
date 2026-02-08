import React, { useState } from "react";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) return "Weak";
    if (strength === 2) return "Medium";
    return "Strong";
  };

  const isPasswordValid = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("resetEmail");

    if (!email || !newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (!isPasswordValid(newPassword)) {
      return toast.error(
        "Password must be at least 8 characters, include uppercase, number & special character",
      );
    }
    try {
      const apiUrl = SummaryApi.resetPassword.url.trim().replace(/\u200B/g, "");
      const response = await fetch(apiUrl, {
        method: SummaryApi.resetPassword.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        localStorage.removeItem("resetEmail");
        window.location.href = "/login";
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Create a new password for your account
        </p>

        {/* New Password */}
        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-xl text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        {/* Strength Indicator */}
        {newPassword && (
          <p className="mb-4 text-sm">
            Strength:{" "}
            <span
              className={`font-bold ${
                getPasswordStrength(newPassword) === "Weak"
                  ? "text-red-500"
                  : getPasswordStrength(newPassword) === "Medium"
                    ? "text-yellow-500"
                    : "text-green-600"
              }`}
            >
              {getPasswordStrength(newPassword)}
            </span>
          </p>
        )}

        {/* Confirm Password */}
        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 cursor-pointer text-xl text-gray-600"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
