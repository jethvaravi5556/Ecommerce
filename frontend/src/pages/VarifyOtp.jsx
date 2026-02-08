import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const OTP_LENGTH = 6;
const RESEND_TIMEOUT = 60; // in seconds

const VerifyOtp = () => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(RESEND_TIMEOUT);
  const inputRefs = useRef([]);

  // Autofill using WebOTP API (Android only)
  useEffect(() => {
    if ('OTPCredential' in window) {
      navigator.credentials.get({
        otp: { transport: ['sms'] },
        signal: new AbortController().signal
      }).then(content => {
        if (content && content.code) {
          const digits = content.code.split('');
          if (digits.length === OTP_LENGTH) setOtp(digits);
        }
      }).catch(console.error);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP change
  const handleChange = (value, idx) => {
    if (!/^\d?$/.test(value)) return; // Allow only digits

    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);

    // Move focus forward
    if (value && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('resetEmail');
    const otpCode = otp.join('');
    if (!email || otpCode.length < OTP_LENGTH) return toast.error("Invalid OTP or email");

    const apiUrl = SummaryApi.verifyOtp.url.trim().replace(/\u200B/g, "");
    const response = await fetch(apiUrl, {
      method: SummaryApi.verifyOtp.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: otpCode })
    });

    const data = await response.json();
    if (data.success) {
      toast.success(data.message);
      window.location.href = "/reset-password";
    } else {
      toast.error(data.message);
    }
  };

  const handleResend = async () => {
    const email = localStorage.getItem("resetEmail");
    if (!email) return toast.error("Missing email");

    const apiUrl = SummaryApi.sendOtp.url.trim().replace(/\u200B/g, "");
    const response = await fetch(apiUrl, {
      method: SummaryApi.sendOtp.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (data.success) {
      toast.success("OTP resent successfully");
      setTimer(RESEND_TIMEOUT);
    } else {
      toast.error(data.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Enter the 6-digit code</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          We've sent a code to your registered email.
        </p>

        <div className="flex justify-between mb-4">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el) => (inputRefs.current[idx] = el)}
              className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded"
        >
          Verify OTP
        </button>

        <div className="text-center mt-4">
          {timer > 0 ? (
            <p className="text-sm text-gray-500">
              Resend code in <span className="font-medium">{timer}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-green-600 font-medium hover:underline"
            >
              Send code to email instead
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default VerifyOtp;
