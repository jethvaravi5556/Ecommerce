import React, { useState } from "react";
import loginIcons from "../assest/signin.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import imageTobase64 from "../helpers/imageTobase64";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    profilePic: "",
  });

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const upperCase = /[A-Z]/;
    const lowerCase = /[a-z]/;
    const digit = /[0-9]/;
    const specialChar = /[!@#$%^&*]/;

    const checks = [
      minLength.test(password),
      upperCase.test(password),
      lowerCase.test(password),
      digit.test(password),
      specialChar.test(password),
    ];

    const passedChecks = checks.filter(Boolean).length;

    if (passedChecks <= 2) return "Weak";
    if (passedChecks === 3 || passedChecks === 4) return "Moderate";
    if (passedChecks === 5) return "Strong";
    return "";
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(validatePassword(value));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagePic = await imageTobase64(file);
      setData((prev) => ({
        ...prev,
        profilePic: imagePic,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmpassword } = data;

    if (!name || !email || !password || !confirmpassword) {
      toast.error("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password !== confirmpassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (validatePassword(password) === "Weak") {
      toast.error(
        "Password must be at least 8 characters with uppercase, lowercase, number and special character",
      );
      return;
    }

    let apiUrl = SummaryApi.signUp.url.trim().replace(/\u200B/g, "");

    try {
      const response = await fetch(apiUrl, {
        method: SummaryApi.signUp.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const dataApi = await response.json();

      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate("/login");

        setData({
          name: "",
          email: "",
          password: "",
          confirmpassword: "",
          profilePic: "",
        });

        setPasswordStrength("");
      } else {
        toast.error(dataApi.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Error connecting to the server");
    }
  };

  return (
    <section id="signup">
      <div className="mx-auto container p-8">
        <div className="bg-white p-5 w-full max-w-md mx-auto">
          <div className="mx-auto w-20 h-20 relative overflow-hidden rounded-full">
            <img
              src={data.profilePic || loginIcons}
              alt="login icon"
              className="w-full h-full"
            />
            <form>
              <label className="absolute bottom-0 w-full bg-opacity-85 bg-slate-200 text-xs pb-4 pt-2 cursor-pointer">
                Upload Photo
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </form>
          </div>

          <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="grid">
              <label>Name:</label>
              <div className="bg-slate-100 p-2">
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleOnChange}
                  placeholder="Enter Your Name"
                  className="w-full h-full outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid">
              <label>Email:</label>
              <div className="bg-slate-100 p-2">
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  placeholder="Enter Email"
                  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$"
                  className="w-full h-full outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label>Password:</label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleOnChange}
                  placeholder="Enter Password"
                  className="w-full h-full outline-none bg-transparent"
                  required
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>

              {passwordStrength && (
                <p
                  className={`text-sm mt-1 ${
                    passwordStrength === "Weak"
                      ? "text-red-500"
                      : passwordStrength === "Moderate"
                        ? "text-yellow-500"
                        : "text-green-500"
                  }`}
                >
                  Password Strength: {passwordStrength}
                </p>
              )}
            </div>

            <div>
              <label>Confirm Password:</label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmpassword"
                  value={data.confirmpassword}
                  onChange={handleOnChange}
                  placeholder="Enter Confirm Password"
                  className="w-full h-full outline-none bg-transparent"
                  required
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 w-full max-w-[150px] mx-auto my-6 block hover:scale-110 transition-all">
              Sign Up
            </button>
          </form>

          <p>
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-red-500 hover:text-red-700 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;