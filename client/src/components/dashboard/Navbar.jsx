import React, { useState } from "react";
import { useAuth } from '../../context/authContext';
import {
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaBell,
  FaCog,
  FaUserCircle,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="flex items-center text-white justify-between h-20 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-6 md:px-8 shadow-2xl relative border-b border-slate-600">
      {/* Decorative overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent"></div>
      
      {/* Left side - Welcome message */}
      <div className="flex items-center space-x-6 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
            <FaUserCircle className="text-white text-lg" />
          </div>
          <div>
            <p className="text-sm md:text-base font-semibold tracking-wide">
              <span className="hidden sm:inline text-slate-300">Welcome back, </span>
              <span className="text-white">
                {user?.name?.split(" ")[0] || "User"}
              </span>
            </p>
            <p className="text-xs text-slate-400 hidden md:block">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-3 md:space-x-6 relative z-10">
        {/* Notifications - Premium style */}
        <button className="hidden md:flex items-center justify-center w-12 h-12 rounded-xl bg-slate-600 hover:bg-slate-500 transition-all duration-300 relative shadow-lg border border-slate-500">
          <FaBell className="text-lg text-slate-200" />
          {/* Premium notification badge */}
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-slate-700 font-semibold">
            3
          </span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          {/* Desktop: Premium profile dropdown */}
          <button
            onClick={toggleDropdown}
            className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-xl bg-slate-600 hover:bg-slate-500 transition-all duration-300 shadow-lg border border-slate-500"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
              <FaUser className="text-sm text-white" />
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold text-white block max-w-32 truncate">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-slate-300">Administrator</span>
            </div>
            <FaChevronDown
              className={`text-xs transition-transform duration-300 text-slate-300 ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Mobile: Premium logout button */}
          <button
            onClick={handleLogout}
            className="md:hidden flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-300 shadow-lg border border-red-500"
          >
            <FaSignOutAlt className="text-sm" />
            <span className="text-sm font-medium">Logout</span>
          </button>

          {/* Premium Dropdown Menu - Desktop only */}
          {showDropdown && (
            <>
              {/* Transparent Backdrop */}
              <div
                className="fixed inset-0 z-10 bg-transparent"
                onClick={() => setShowDropdown(false)}
              />

              {/* Dropdown Content - Compact Version */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-20 border border-slate-200 overflow-hidden">
                {/* Compact Menu Items */}
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-amber-600">Administrator</p>
                  </div>

                  <button className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                    <FaUser className="text-slate-400 text-xs" />
                    <span>Profile</span>
                  </button>

                  <button className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                    <FaCog className="text-slate-400 text-xs" />
                    <span>Settings</span>
                  </button>

                  <hr className="my-1 border-slate-200" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt className="text-red-500 text-xs" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;