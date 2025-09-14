import React, { useState } from "react";

import { FiBell } from "react-icons/fi"; // React Icons bell
import { NavLink } from "react-router";

const Navbar = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const link = (
    <>
      <NavLink to="/" className="hover:text-green-600">Home</NavLink>
      <NavLink to="/membership" className="hover:text-green-600">Membership</NavLink>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      {/* Left Side: Logo */}
      <div className="navbar-start">
        <p className="text-3xl italic font-bold">
          Civic<span className="text-green-600">Talk</span>
        </p>
      </div>

      {/* Center: Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-5 text-lg">
          {link}
        </ul>
      </div>

      {/* Right Side: Notification / Join / Profile */}
      <div className="navbar-end flex items-center gap-4">
        {/* Notification Icon */}
        <button className="btn btn-ghost btn-circle">
          <FiBell className="h-6 w-6" />
        </button>

        {!user ? (
          // Not logged in: Join Us button
          <NavLink to="auth/login" className="btn btn-sm btn-primary">
            Join Us
          </NavLink>
        ) : (
          // Logged in: Profile Picture
          <div className="relative">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt="profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-base-100 border rounded-lg shadow-lg z-50 p-2 menu">
                <li className="px-4 py-2 font-semibold">{user.name}</li>
                <li>
                  <NavLink to="/dashboard" className="px-4 py-2 hover:bg-green-100 rounded">
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 hover:bg-red-100 text-red-600 rounded w-full text-left"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
