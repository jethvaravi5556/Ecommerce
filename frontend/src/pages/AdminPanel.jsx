import React, { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ROLE from "../common/role";

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
    <div className="min-h-[calc(100vh-120px)] flex flex-col md:flex-row relative">
      {/* Sidebar */}
      <aside
        className={`bg-white md:min-h-full w-full md:max-w-60 customShadow transition-all duration-300 z-40
        ${menuOpen ? "block fixed top-0 left-0 h-full" : "hidden md:block"}`}
      >
        <div className="h-32 flex justify-center items-center mt-20 flex-col border-b">
          <div className="text-5xl cursor-pointer relative group flex justify-center">
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                className="w-20 h-20 rounded-full object-cover"
                alt={user?.name}
              />
            ) : (
              <FaRegUserCircle />
            )}
          </div>
          <p className="capitalize font-semibold text-lg">{user?.name}</p>
          <p className="text-sm">{user?.role}</p>
        </div>

        {/* Navigation */}
        <nav className="grid p-4 space-y-2 text-sm">
          <Link
            to="/admin-panel/all-users"
            className="px-2 py-2 hover:bg-slate-100 block"
            onClick={() => setMenuOpen(false)}
          >
            All Users
          </Link>
          {/*  */}
        </nav>
      </aside>

      {/* Mobile Menu Toggle */}
      <button
        className="absolute top-4 left-4 text-3xl text-gray-700 md:hidden z-50"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? <HiX /> : <HiMenuAlt3 />}
      </button>

      {/* Main Content */}
      <main className="w-full h-full p-4 pt-16 md:pt-4 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
