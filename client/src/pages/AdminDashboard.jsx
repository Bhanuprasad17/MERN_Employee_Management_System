import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import AdminSideBar from "../components/dashboard/AdminSideBar";
import Navbar from "../components/dashboard/Navbar";
import AdminSummary from "../components/dashboard/AdminSummary";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      toast.success("Welcome back! Successfully logged in.", {
        style: {
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          color: 'white',
          borderRadius: '12px',
          border: '1px solid #059669',
          boxShadow: '0 10px 25px rgba(5, 150, 105, 0.2)',
        },
      });
    }
  }, [user, loading]);

  // Premium loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Dashboard...</h2>
          <p className="text-gray-600">Please wait while we prepare your workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Premium Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content Area - This should take full remaining width */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <Navbar />

        {/* Main Content - This should expand to fill remaining height */}
        <main className="flex-1 w-full">
          {/* Premium content container - Full width and height */}
          <div className="w-full h-full">
            {/* Content will be rendered here via Outlet - Should consume full space */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;