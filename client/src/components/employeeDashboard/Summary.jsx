import React from "react";
// import { useAuth } from "../../context/AuthContext";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const Summary = () => {
  const { user } = useAuth();

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200 transform transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 mx-4 mt-4">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
      
      {/* Content */}
      <div className="relative z-10 p-6 flex items-center">
        {/* Icon Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 shadow-md flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
          <FaUserCircle className="text-white text-3xl" />
        </div>
        
        {/* Text Section */}
        <div className="ml-6 flex-1">
          <p className="text-gray-600 font-medium tracking-wide uppercase text-sm">
            Welcome Back
          </p>
          <p className="text-gray-900 font-bold text-2xl leading-tight mt-1">
            {user?.name || "Employee"}
          </p>
        </div>
      </div>
      
      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 rounded-xl transition-colors duration-300"></div>
    </div>
  );
};

export default Summary;