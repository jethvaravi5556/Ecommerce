import React, { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ROLE from "../common/role";
import Footer from "../components/Footer";

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside
        className={`fixed md:sticky top-16 left-0 h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] w-64 bg-white border-r z-40
  transform transition-transform duration-300 overflow-y-auto
  ${menuOpen ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0 md:w-64`}
      >
        {/* Profile */}
        <div className="flex flex-col items-center justify-center h-40 border-b pt-4 md:pt-6">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              className="w-20 h-20 rounded-full object-cover"
              alt="user"
            />
          ) : (
            <FaRegUserCircle className="text-6xl text-gray-400" />
          )}

          <p className="mt-2 font-semibold">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.role}</p>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2 p-4">
          <NavLink
            to="/admin-panel/dashboard"
            className={({ isActive }) =>
              `p-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
            onClick={() => {
              setMenuOpen(false);
            }}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin-panel/all-users"
            className={({ isActive }) =>
              `p-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
            onClick={() => {
              setMenuOpen(false);
            }}
          >
            All Users
          </NavLink>

          <NavLink
            to="/admin-panel/all-products"
            className={({ isActive }) =>
              `p-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
            onClick={() => {
              setMenuOpen(false);
            }}
          >
            All Products
          </NavLink>
          <NavLink
            to="/admin-panel/all-orders"
            className={({ isActive }) =>
              `p-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
            onClick={() => {
              setMenuOpen(false);
            }}
          >
            All Orders
          </NavLink>
        </nav>
      </aside>

      {/* OVERLAY - Mobile Only */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex flex-col flex-1 w-full">
        {/* MOBILE HEADER */}
        <header className="md:hidden flex items-center gap-4 bg-white p-4 border-b sticky top-0 z-20">
          <button
            className="text-2xl text-gray-700 p-1 hover:bg-gray-100 rounded transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle sidebar"
          >
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>

          <h2 className="font-semibold text-lg">Admin Panel</h2>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-8 overflow-x-auto">
          <div className="w-full md:max-w-7xl md:mx-auto">
            <Outlet />
          </div>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminPanel;
