import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";
import { FaShoppingCart } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiShoppingBag, FiLogOut } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { toast } from "react-toastify";

import Context from "../context";
import ImageSearchContext from "../context/ImageSearchContext";
import SummaryApi from "../common";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import Logo from "./Logo";

const Header = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(Context);
  const { setImageSearchResults } = useContext(ImageSearchContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  const isAdminPanel = location.pathname.startsWith("/admin-panel");
  const isAdminViewingAdminPanel = user?.role === ROLE.ADMIN && isAdminPanel;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const apiurl = SummaryApi.logout_user.url.trim().replace(/\u200B/g, "");
      const res = await fetch(apiurl, {
        method: SummaryApi.logout_user.method,
        credentials: "include",
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (data.success) {
        toast.success(data.message || "Logged out successfully");
        dispatch(setUserDetails(null));
        navigate("/");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("❌ Logout failed:", error);
      toast.error("Something went wrong during logout");
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    navigate(value ? `/search?q=${value}` : "/search");
  };

  const handleImageSearch = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:8000/api/image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setImageSearchResults(data.products || []);
        navigate("/image-search");
      }
    } catch (err) {
      console.error("❌ Image search failed:", err);
    }
  };

  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/">
          <Logo w={140} h={100} />
        </Link>

        {/* Desktop Right Section */}
        <div className="hidden lg:flex items-center gap-5">
          {isAdminViewingAdminPanel ? (
            <Link
              to="/"
              className="bg-red-600 text-white px-4 py-1 rounded-full"
            >
              Buy
            </Link>
          ) : (
            <>
              {user?._id && (
                <Link to="/cart" className="relative text-2xl">
                  <FaShoppingCart />
                  <div className="bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center absolute -top-2 -right-3">
                    {context?.cartProductCount || 0}
                  </div>
                </Link>
              )}

              {user?._id && (
                <Link
                  to="/saved-items"
                  className="text-2xl text-red-500"
                  title="Saved Items"
                >
                  <AiFillHeart />
                </Link>
              )}

              {user?._id && (
                <Link to="/order" className="flex items-center gap-1 text-xl">
                  <FiShoppingBag />
                </Link>
              )}

              {user?._id && (
                <div className="relative" ref={profileRef}>
                  <div
                    onClick={() => setShowProfileMenu((prev) => !prev)}
                    className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg text-white overflow-hidden cursor-pointer"
                  >
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0)?.toUpperCase() || "U"
                    )}
                  </div>

                  {showProfileMenu && (
                    <div className="absolute right-0 top-12 bg-white shadow-lg rounded text-sm z-50 w-40">
                      {user?.role === ROLE.ADMIN && (
                        <Link
                          to="/admin-panel/all-users"
                          className="block px-4 py-2 hover:bg-slate-100"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Admin Panel
                        </Link>
                      )}

                      <Link
                        to="/order"
                        className="block px-4 py-2 hover:bg-slate-100"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Orders
                      </Link>

                      <Link
                        to="/saved-items"
                        className="block px-4 py-2 hover:bg-slate-100"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Saved Items
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {user?._id && (
                <button
                  onClick={handleLogout}
                  className="text-2xl text-red-600 hover:text-red-700"
                >
                  <FiLogOut />
                </button>
              )}

              {!user?._id && (
                <Link
                  to="/login"
                  className="bg-red-600 text-white px-4 py-1 rounded-full"
                >
                  Login
                </Link>
              )}
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-3xl text-gray-700"
          >
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white px-4 py-4 shadow-md border-t space-y-3">
          {isAdminViewingAdminPanel ? (
            <Link
              to="/"
              className="block bg-red-600 text-white px-4 py-2 rounded text-center"
              onClick={() => setMenuOpen(false)}
            >
              Buy
            </Link>
          ) : (
            <>
              {user && (
                <>
                  <Link
                    to="/order"
                    onClick={() => setMenuOpen(false)}
                    className="block"
                  >
                    Orders
                  </Link>

                  <Link
                    to="/saved-items"
                    onClick={() => setMenuOpen(false)}
                    className="block"
                  >
                    Saved
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setMenuOpen(false)}
                    className="block"
                  >
                    Cart ({context?.cartProductCount || 0})
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="text-red-600 block"
                  >
                    Logout
                  </button>
                </>
              )}

              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block"
                >
                  Login
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;


//Header.jsx