import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    try {
      const response = await axios.post(
        "https://mern-employee-management-system-3.onrender.com/api/auth/login",
        { email, password }
      );

      setError("");
      if (response.data.success) {
        toast.success("Successfully logged in!");
        // optionally redirect here
      }
      // console.log(response.data.user)

      login(response.data.user);

      localStorage.setItem("token", response.data.token);
      if (response.data.user.role == "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.data && error.response.data.error) {
          console.log("jai");
          setError(error.response.data.error);
          toast.error(error.response.data.error);
        } else {
          setError("Login failed. Please try again.");
          toast.error("Login failed. Please try again.");
        }
      } else if (error.request) {
        setError("Network error. Please check your connection.");
        toast.error("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleGuestLogin = async (userType) => {
    let guestEmail, guestPassword;
    
    if (userType === "admin") {
      guestEmail = "admin@gmail.com";
      guestPassword = "123456";
    } else if (userType === "employee") {
      guestEmail = "bhanuprasadsuram0018@gmail.com";
      guestPassword = "123456";
    }

    // Update the form fields for visual feedback
    setEmail(guestEmail);
    setPassword(guestPassword);
    setError(null);

    try {
      const response = await axios.post(
        "https://mern-employee-management-system-3.onrender.com/api/auth/login",
        { email: guestEmail, password: guestPassword }
      );

      setError("");
      if (response.data.success) {
        toast.success(`Successfully logged in as Guest ${userType === "admin" ? "Admin" : "Employee"}!`);
      }

      login(response.data.user);

      localStorage.setItem("token", response.data.token);
      if (response.data.user.role == "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.data && error.response.data.error) {
          setError(error.response.data.error);
          toast.error(error.response.data.error);
        } else {
          setError("Guest login failed. Please try again.");
          toast.error("Guest login failed. Please try again.");
        }
      } else if (error.request) {
        setError("Network error. Please check your connection.");
        toast.error("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred during guest login.");
        toast.error("An unexpected error occurred during guest login.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Full-width green banner */}
      <div className="w-full bg-teal-600 py-4 text-center">
        <h1 className="text-white text-3xl font-semibold">
          Employee Management System
        </h1>
      </div>

      {/* Centered Login Card */}
      <div className="mt-12 w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        {error && <p className="text-red-500">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="Enter Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Enter Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Login
          </button>

          {/* Guest Login Buttons */}
          <div className="space-y-2">
            <div className="text-center text-sm text-gray-600 mb-2">
              Or try as guest:
            </div>
            <button
              type="button"
              onClick={() => handleGuestLogin("admin")}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-200 text-sm"
            >
              Login as Guest Admin
            </button>
            <button
              type="button"
              onClick={() => handleGuestLogin("employee")}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors duration-200 text-sm"
            >
              Login as Guest Employee
            </button>
          </div>

          {/* Forgot Password Link */}
          {/* <div className="text-center mt-4">
            <a href="#" className="text-sm text-teal-600 hover:underline">
              Forgot Password?
            </a>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Login;