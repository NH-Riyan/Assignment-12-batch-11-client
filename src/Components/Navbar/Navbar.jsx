import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiBell } from "react-icons/fi";
import { NavLink } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import useAxios from "../Hooks/useAxios";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const axiosInstance = useAxios();

  // Fetch announcements from backend
  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosInstance.get("/announcements");
      return res.data;
    },
  });

  const handleLogout = () => {
    logOut()
      .then(() => {
        alert("you logged out");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const link = (
    <>
      <NavLink to="/" className="hover:text-green-600">
        Home
      </NavLink>
      <NavLink to="/membership" className="hover:text-green-600">
        Membership
      </NavLink>
    </>
  );

  return (
    <div className="navbar mb-7 bg-base-100 shadow-sm px-4">
     
      <div className="navbar-start">
        <p className="text-3xl italic font-bold">
          Civic<span className="text-green-600">Talk</span>
        </p>
      </div>

      {/* Center: Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-5 text-lg">{link}</ul>
      </div>

      {/* Right Side: Notification / Join / Profile */}
      <div className="navbar-end flex items-center gap-4">
        {/* Notification Icon with Count */}
        <div className="relative">
          <button className="btn btn-ghost btn-circle">
            <FiBell className="h-6 w-6" />
          </button>
          {announcements.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {announcements.length}
            </span>
          )}
        </div>

        {user ? (
          // When logged in
          <div className="relative flex items-center gap-4">
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="profile"
              title={user.displayName || user.name || "User"}
              className="w-10 h-10 rounded-full border-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <ul className="absolute right-0 top-12 w-48 bg-base-100 border rounded-lg shadow-lg z-50 p-2 menu">
                <li className="px-4 py-2 font-semibold">
                  {user.displayName || user.email}
                </li>
                <li>
                  <NavLink
                    to="/dashboard"
                    className="px-4 py-2 hover:bg-green-100 rounded block"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-red-100 text-red-600 rounded w-full text-left"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          // When not logged in → show Join Us
          <NavLink to="/auth/login" className="btn btn-sm btn-primary">
            Join Us
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
