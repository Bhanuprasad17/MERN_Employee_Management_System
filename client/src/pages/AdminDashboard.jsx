
import React, { useEffect } from "react";
import { useAuth } from "../context/authContext";
import { toast, ToastContainer } from "react-toastify";
import AdminSideBar from "../components/dashboard/AdminSideBar";
import Navbar from "../components/dashboard/Navbar";
import AdminSummary from "../components/dashboard/AdminSummary";
import { Outlet } from "react-router-dom";

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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-300 border-t-amber-500 shadow-lg"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-2 border-amber-400 opacity-20"></div>
          </div>
          <p className="mt-6 text-slate-600 font-medium text-lg">Loading Dashboard...</p>
          <p className="mt-2 text-slate-500 text-sm">Please wait while we prepare your workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 overflow-hidden">
      {/* Premium Toast Container */}
      <ToastContainer 
        position="top-right" 
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="mt-24 mr-6"
        toastClassName="rounded-xl shadow-2xl border"
        bodyClassName="font-medium"
        progressClassName="bg-gradient-to-r from-amber-400 to-amber-600"
      />
      
      {/* Sidebar */}
      <AdminSideBar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Premium content container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-8 min-h-full">
              {/* Content will be rendered here via Outlet */}
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
