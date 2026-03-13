import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiShoppingBag, FiLogOut } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { toast } from "react-toastify";

import Context from "../context";
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

  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [search, setSearch] = useState("");

  const profileRef = useRef(null);

  const isAdminPanel = location.pathname.startsWith("/admin-panel");

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
      const res = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(null));
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    navigate(value ? `/search?q=${value}` : "/search");
  };

  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/">
          <Logo w={140} h={100} />
        </Link>

        {/* SEARCH BAR (ONLY USER SIDE) */}
        {!isAdminPanel && (
          <div className="hidden lg:flex items-center w-full max-w-md border rounded-full pl-3 mx-5">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full outline-none py-1"
              value={search}
              onChange={handleSearch}
            />
            <div className="text-xl bg-red-600 text-white px-3 py-2 rounded-r-full">
              <CiSearch />
            </div>
          </div>
        )}

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-5">
          {isAdminPanel && user?.role === ROLE.ADMIN && (
            <Link
              to="/"
              className="bg-red-600 text-white px-4 py-1 rounded-full"
            >
              Buy
            </Link>
          )}

          {!isAdminPanel && (
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
                  className="relative text-2xl text-red-500"
                >
                  <AiFillHeart />

                  <div className="bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center absolute -top-2 -right-3">
                    {context?.savedItemCount || 0}
                  </div>
                </Link>
              )}

              {user?._id && (
                <Link to="/order" className="text-xl">
                  <FiShoppingBag />
                </Link>
              )}
            </>
          )}

          {/* PROFILE */}
          {user?._id && (
            <div className="relative" ref={profileRef}>
              <div
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white overflow-hidden cursor-pointer"
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
                <div className="absolute right-0 top-12 bg-white shadow-lg rounded text-sm z-50 w-44">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-slate-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    My Profile
                  </Link>

                  {user?.role === ROLE.ADMIN && !isAdminPanel && (
                    <Link
                      to="/admin-panel/all-users"
                      className="block px-4 py-2 hover:bg-slate-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Admin Panel
                    </Link>
                  )}

                  {!isAdminPanel && (
                    <>
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
                    </>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 text-red-600 flex items-center gap-2"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {!user?._id && (
            <Link
              to="/login"
              className="bg-red-600 text-white px-4 py-1 rounded-full"
            >
              Login
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-3xl">
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t shadow-md px-4 py-4 space-y-3">
          {/* USER SIDE SEARCH */}
          {!isAdminPanel && (
            <div className="flex items-center border rounded-full px-3 py-2">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
                className="w-full outline-none"
              />
              <CiSearch className="text-xl text-red-600" />
            </div>
          )}

          {user?._id ? (
            <>
              {/* PROFILE */}
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block py-2 border-b"
              >
                My Profile
              </Link>

              {/* ADMIN PANEL */}
              {user?.role === ROLE.ADMIN && (
                <Link
                  to="/admin-panel/all-users"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 border-b"
                >
                  Admin Panel
                </Link>
              )}

              {/* ORDERS */}
              {!isAdminPanel && (
                <Link
                  to="/order"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 border-b"
                >
                  Orders
                </Link>
              )}

              {/* SAVED ITEMS */}
              {!isAdminPanel && (
                <Link
                  to="/saved-items"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 border-b"
                >
                  Saved Items
                </Link>
              )}

              {/* BUY BUTTON (ADMIN PANEL ONLY) */}
              {isAdminPanel && user?.role === ROLE.ADMIN && (
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="block bg-red-600 text-white px-4 py-2 rounded-lg text-center"
                >
                  Buy
                </Link>
              )}

              {/* LOGOUT */}
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 text-red-600 py-2"
              >
                <FiLogOut />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block bg-red-600 text-white px-4 py-2 rounded-lg text-center"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
