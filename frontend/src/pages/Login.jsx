import React, { useContext, useState } from "react";
import loginIcons from "../assest/signin.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import SummaryApi from "../common";
import Context from "../context";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setUserDetails } from "../store/userSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  // const generalContext= useContext(Context)
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = data;

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      let apiUrl = SummaryApi.signIn.url.trim();
      apiUrl = apiUrl.replace(/\u200B/g, ""); 

      const response = await fetch(apiUrl, {
        method: SummaryApi.signIn.method, 
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ To include cookies (JWT token)
        body: JSON.stringify(data),
      });

      const dataApi = await response.json();

      console.log("User after Google login:", dataApi);

      if (dataApi.success) {
        toast.success(dataApi.message);
        localStorage.setItem("token", dataApi.token); // ✅ Store JWT for authentication
        dispatch(setUserDetails(dataApi.user));
        // ✅ Wrap fetchUserDetails in try-catch to prevent errors from triggering "Error connecting to server"
        try {
          await fetchUserDetails();
          await fetchUserAddToCart();
        } catch (fetchError) {
          console.error("Error fetching user details:", fetchError);
        }
        navigate("/");
      } else {
        toast.error(dataApi.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error connecting to server");
    }
  };

  return (
    <section id="login">
      <div className="mx-auto container p-8">
        <div className="bg-white p-5 w-full max-w-md mx-auto">
          <div className="mx-auto w-20 h-20">
            <img src={loginIcons} alt="Login Icon" />
          </div>
          <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="grid">
              <label>Email:</label>
              <div className="bg-slate-100 p-2">
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  placeholder="Enter Email"
                  className="w-full h-full outline-none bg-transparent"
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
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
              <Link
                to="/forgot-password"
                className="block w-fit ml-auto hover:underline hover:text-red-600"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 w-full max-w-[150px] mx-auto my-6 block hover:scale-110 transition-all"
            >
              Login
            </button>
          </form>
          <div className="flex items-center justify-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="px-4 text-gray-900 text-sm">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <div className="text-center mt-4">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await fetch(
                    "http://localhost:8000/api/google-login",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                      body: JSON.stringify({
                        token: credentialResponse.credential,
                      }),
                    },
                  );

                  const raw = await res.text(); // to debug if JSON parse fails

                  if (!res.ok) {
                    console.error("Raw error response:", raw);
                    throw new Error(`HTTP error! status: ${res.status}`);
                  }

                  const dataApi = JSON.parse(raw); // ✅ Convert to object

                  console.log("dataapi", dataApi._id);
                  if (dataApi.success) {
                    toast.success(dataApi.message);
                    localStorage.setItem("token", dataApi.token); // optional
                    dispatch(setUserDetails(dataApi.user));
                    await fetchUserDetails();
                    await fetchUserAddToCart();
                    navigate("/");
                  } else {
                    toast.error(dataApi.message);
                  }
                } catch (err) {
                  console.error("Google login error:", err);
                  toast.error("Something went wrong");
                }
              }}
              onError={() => {
                toast.error("Google login failed");
              }}
            />
          </div>
          <div className="text-center">
            <p>
              Don't have an account?{" "}
              <Link
                to="/sign-up"
                className="text-red-500 hover:text-red-700 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;