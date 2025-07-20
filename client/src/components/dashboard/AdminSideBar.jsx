
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaCogs,
  FaMoneyBillWave,
  FaTachometerAlt as FaTachometer,
  FaUsers,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const AdminSideBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items
  const navItems = [
    { to: "/admin-dashboard", icon: FaTachometer, label: "Dashboard", end: true },
    { to: "/admin-dashboard/employees", icon: FaUsers, label: "Employee" },
    { to: "/admin-dashboard/departments", icon: FaBuilding, label: "Department" },
    { to: "/admin-dashboard/leave", icon: FaCalendarAlt, label: "Leave" },
    { to: "/admin-dashboard/salary/add", icon: FaMoneyBillWave, label: "Salary" },
    { to: "/admin-dashboard/settings", icon: FaCogs, label: "Settings" },
  ];

  // Classic premium styling for navigation links
  const getLinkClassName = ({ isActive }) =>
    `${
      isActive
        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg border-l-4 border-amber-300"
        : "text-slate-300 hover:bg-slate-700 hover:text-white border-l-4 border-transparent hover:border-amber-400"
    } flex items-center justify-center md:justify-start space-x-0 md:space-x-4 py-4 px-6 transition-all duration-300 group relative`;

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-3 rounded-xl shadow-2xl hover:from-slate-600 hover:to-slate-700 transition-all duration-300 border border-slate-600"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white h-screen fixed left-0 top-0 bottom-0 z-40 transition-transform duration-500 ease-in-out shadow-2xl border-r border-slate-700
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:w-20 lg:w-72
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 h-20 flex items-center justify-center px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <h3 className="text-xl lg:text-2xl text-center font-bold tracking-wider relative z-10">
            <span className="md:hidden lg:inline drop-shadow-lg">Employee MS</span>
            <span className="hidden md:inline lg:hidden drop-shadow-lg">EMS</span>
          </h3>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white bg-opacity-5 rounded-full"></div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-8 space-y-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={getLinkClassName}
                end={item.end}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <IconComponent className="text-xl flex-shrink-0 drop-shadow-sm" />
                <span className="md:hidden lg:inline transition-all duration-300 font-medium tracking-wide">
                  {item.label}
                </span>
                {/* Premium Tooltip for tablet view */}
                <div className="hidden md:block lg:hidden absolute left-24 bg-gradient-to-r from-slate-900 to-slate-800 text-white text-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-600">
                  {item.label}
                  <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-t border-slate-600"></div>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Premium decorative element */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>

        {/* Mobile Menu Footer */}
        <div className="md:hidden absolute bottom-6 left-6 right-6">
          <div className="border-t border-slate-600 pt-6">
            <p className="text-slate-400 text-sm text-center font-medium">
              © 2024 Employee MS
            </p>
          </div>
        </div>
      </div>

      {/* Content Spacer for larger screens */}
      <div className="hidden md:block md:w-20 lg:w-72 flex-shrink-0"></div>
    </>
  );
};


export default AdminSideBar