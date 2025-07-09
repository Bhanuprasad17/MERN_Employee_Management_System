import React from "react";
import { useAuth } from "../context/authContext";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import AdminSideBar from "../components/dashboard/AdminSideBar";
import Navbar from "../components/dashboard/Navbar";
import AdminSummary from "../components/dashboard/AdminSummary";

const AdminDashboard = () => {
  useEffect(() => {
    toast.success("Successfully logged in!");
  }, []);

  const { user, loading } = useAuth();

  return (
    <div className="flex">
      <ToastContainer position="top-right" autoClose={3000} />
      <AdminSideBar />
      <div className="flex-1 ml-64 bg-gray-100 h-screen">
        <Navbar />
        <AdminSummary />
      </div>
    </div>
  );
};

export default AdminDashboard;
