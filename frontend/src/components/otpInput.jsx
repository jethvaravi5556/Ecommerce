import React, { useRef, useState, useEffect } from "react";

const OtpInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (element, index) => {
    const val = element.value.replace(/[^0-9]/g, "");
    if (!val) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next
    if (index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Auto-submit if all filled
    if (newOtp.every((digit) => digit !== "") && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    const newOtp = pastedData.split("");
    const filled = new Array(length).fill("");

    for (let i = 0; i < newOtp.length; i++) {
      if (/^\d$/.test(newOtp[i])) {
        filled[i] = newOtp[i];
      }
    }

    setOtp(filled);
    filled.forEach((digit, i) => {
      if (digit) inputRefs.current[i].value = digit;
    });

    if (filled.every((d) => d !== "") && onComplete) {
      onComplete(filled.join(""));
    }
  };

  return (
    <div className="flex justify-center space-x-2" onPaste={handlePaste}>
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={otp[index]}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputRefs.current[index] = el)}
          className="w-12 h-12 border-2 text-center text-lg rounded-md focus:outline-none focus:border-green-500"
        />
      ))}
    </div>
  );
};

export default OtpInput;
