import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaCalendarAlt, FaClock, FaBuilding, FaFileAlt, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://mern-employee-management-system-3.onrender.com/api/leave/detail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        if (response.data.success) {
          // Fixed: Use 'leaves' instead of 'leave' to match your controller
          setLeave(response.data.leaves);
        } else {
          setError("Failed to fetch leave details");
        }
      } catch (error) {
        console.error("Error fetching leave:", error);
        if (error.response && error.response.data && error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError("An error occurred while fetching leave details");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLeave();
    }
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <FaCheckCircle className="text-green-600" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-600" />;
      case 'pending':
        return <FaHourglassHalf className="text-yellow-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-4 py-2 text-sm font-bold rounded-full shadow-sm";
    switch (status?.toLowerCase()) {
      case 'approved':
        return `${baseClasses} bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300`;
      case 'rejected':
        return `${baseClasses} bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300`;
      case 'pending':
        return `${baseClasses} bg-gradient-to-r from-amber-100 to-yellow-200 text-amber-800 border border-amber-300`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300`;
    }
  };

  const calculateLeaveDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    return diffDays;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <p className="text-xl font-semibold text-slate-700">Loading leave details...</p>
          <p className="text-sm text-slate-500 mt-2">Please wait while we fetch the information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <FaTimesCircle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-4">Error Loading Details</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaArrowLeft className="inline mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!leave) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Leave Not Found</h2>
          <p className="text-slate-600 mb-6">The requested leave details could not be found.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaArrowLeft className="inline mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <FaArrowLeft className="mr-2" />
          Back to Leave List
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">📋 Leave Request Details</h1>
            <p className="text-blue-100 text-lg">Complete information about the leave application</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Section */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 text-center shadow-lg border border-slate-200">
                  <div className="relative inline-block mb-6">
                    {/* Debug: Add console log to check image path */}
                    {console.log('Profile Image Path:', leave.employeeId?.userId?.profileImage)}
                    {console.log('Full Image URL:', `https://mern-employee-management-system-3.onrender.com/uploads/${leave.employeeId?.userId?.profileImage}`)}
                    
                    {leave.employeeId?.userId?.profileImage ? (
                      <img
                        src={`https://mern-employee-management-system-3.onrender.com/uploads/${leave.employeeId.userId.profileImage}`}
                        alt="Employee Profile"
                        className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl mx-auto"
                        onError={(e) => {
                          console.log('Image failed to load, using placeholder');
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully');
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback Avatar */}
                    <div 
                      className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center border-4 border-white shadow-xl mx-auto"
                      style={{ display: leave.employeeId?.userId?.profileImage ? 'none' : 'flex' }}
                    >
                      <FaUser className="h-20 w-20 text-white" />
                    </div>
                    
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full shadow-lg">
                      <FaUser className="h-4 w-4" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    {leave.employeeId.userId.name || 'N/A'}
                  </h2>
                  <p className="text-slate-600 font-medium">
                    ID: {leave.employeeId?.employeeId || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Details Section */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Leave Information */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 shadow-lg border border-blue-200">
                    <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                      <FaFileAlt className="mr-2" />
                      Leave Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-blue-700 mb-1">Leave Type</label>
                        <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium">
                          {leave.leaveType || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-blue-700 mb-1">Reason</label>
                        <div className="bg-white text-slate-700 px-3 py-2 rounded-lg border border-blue-200">
                          {leave.reason || 'No reason provided'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-blue-700 mb-1">Status</label>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(leave.status)}
                          <span className={getStatusBadge(leave.status)}>
                            {leave.status || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date & Duration */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 shadow-lg border border-green-200">
                    <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      Date & Duration
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-green-700 mb-1">Start Date</label>
                        <div className="bg-white text-slate-700 px-3 py-2 rounded-lg border border-green-200 font-medium">
                          {formatDate(leave.startDate)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-green-700 mb-1">End Date</label>
                        <div className="bg-white text-slate-700 px-3 py-2 rounded-lg border border-green-200 font-medium">
                          {formatDate(leave.endDate)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-green-700 mb-1">Total Days</label>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-lg font-bold text-center">
                          {calculateLeaveDays(leave.startDate, leave.endDate)} Days
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Department Information */}
                  <div className="md:col-span-2 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6 shadow-lg border border-purple-200">
                    <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center">
                      <FaBuilding className="mr-2" />
                      Department Information
                    </h3>
                    <div className="bg-white text-slate-700 px-4 py-3 rounded-lg border border-purple-200 font-medium text-center">
                      {leave.employeeId?.department?.dep_name || 'Department not specified'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-slate-100 to-slate-200 px-8 py-4 border-t border-slate-300">
            <p className="text-sm text-slate-600 text-center">
              Leave request details • Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;