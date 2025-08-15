import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const AddLeave = () => {
  const {user} = useAuth()
  const [formData, setFormData] = useState({
    userId : user._id,
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  
  const navigate = useNavigate();

  console.log(formData)

  const leaveTypes = [
    'Select Leave Type',
    'Sick Leave',
    'Casual Leave',
    'Annual Leave'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

 const handleSubmit = (e) => {
  e.preventDefault();
  
  // Basic form validation
  if (!formData.leaveType || formData.leaveType === 'Select Leave Type') {
    alert('Please select a leave type');
    return;
  }
  
  if (!formData.startDate || !formData.endDate) {
    alert('Please select both from and to dates');
    return;
  }
  
  if (new Date(formData.startDate) > new Date(formData.endDate)) {
    alert('From date cannot be later than to date');
    return;
  }
  
  if (!formData.reason.trim()) {
    alert('Please provide a description');
    return;
  }
  
  console.log('Leave request submitted:', formData);

  const submitLeaveRequest = async () => {
    try {
      const response = await axios.post(
        `https://mern-employee-management-system-3.onrender.com/api/leave/add`,
        formData, // Send the form data as the request body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      if (response.data.success) {
        navigate('/employee-dashboard/leaves');
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      } else {
        alert('An error occurred while submitting the leave request');
        console.error('Error:', error);
      }
    }
  };
  
  submitLeaveRequest();
};
  const handleBack = () => {
    navigate('/employee-dashboard/leaves');
  };

  const handleCancel = () => {
    navigate('/employee-dashboard/leaves');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Enhanced Back Button */}
        <div className="mb-10">
          <button
            onClick={handleBack}
            className="group inline-flex items-center gap-3 text-slate-600 hover:text-indigo-600 font-medium transition-all duration-300 mb-6 px-3 py-2 rounded-xl hover:bg-white/60 hover:shadow-sm backdrop-blur-sm"
            type="button"
          >
            <div className="p-1 rounded-lg bg-white/80 group-hover:bg-indigo-50 group-hover:scale-110 transition-all duration-300 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            Back to Dashboard
          </button>
          
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-indigo-800 bg-clip-text text-transparent leading-tight">
              Request for Leave
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Fill out the form below to submit your leave request
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* Enhanced Form Container */}
        <div className="relative">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-3xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-blue-500/5 to-teal-500/5 rounded-3xl transform -rotate-1"></div>
          
          <form onSubmit={handleSubmit} className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
            {/* Floating Badge */}
            <div className="absolute -top-4 left-8">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                New Request
              </div>
            </div>

            <div className="space-y-8 pt-4">
              {/* Leave Type with Enhanced Styling */}
              <div className="group">
                <label htmlFor="leaveType" className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                  Leave Type
                </label>
                <div className="relative">
                  <select
                    id="leaveType"
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-white appearance-none cursor-pointer text-slate-700 font-medium shadow-sm hover:shadow-md group-hover:border-indigo-300"
                    required
                  >
                    {leaveTypes.map((type, index) => (
                      <option 
                        key={index} 
                        value={type}
                        disabled={type === 'Select Leave Type'}
                        className={type === 'Select Leave Type' ? 'text-slate-400' : 'text-slate-800'}
                      >
                        {type}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <div className="p-1 rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Date Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* From Date */}
                <div className="group">
                  <label htmlFor="startDate" className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
                    From Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 pl-14 bg-gradient-to-r from-slate-50 to-emerald-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-slate-700 font-medium shadow-sm hover:shadow-md group-hover:border-emerald-300"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* To Date */}
                <div className="group">
                  <label htmlFor="endDate" className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full"></div>
                    To Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 pl-14 bg-gradient-to-r from-slate-50 to-rose-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 text-slate-700 font-medium shadow-sm hover:shadow-md group-hover:border-rose-300"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <div className="p-2 rounded-xl bg-gradient-to-r from-rose-100 to-pink-100">
                        <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Description */}
              <div className="group">
                <label htmlFor="reason" className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
                  Description
                </label>
                <div className="relative">
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full px-6 py-4 pl-14 bg-gradient-to-r from-slate-50 to-amber-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 resize-none text-slate-700 font-medium shadow-sm hover:shadow-md group-hover:border-amber-300"
                    placeholder="Please provide the reason for your leave request..."
                    required
                  />
                  <div className="absolute top-4 left-0 flex items-center pl-4 pointer-events-none">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="pt-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="group relative w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 font-bold rounded-2xl hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 to-gray-100/50 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    <div className="relative flex items-center gap-3">
                      <div className="p-1 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </div>
                      Cancel
                    </div>
                  </button>
                  
                  <button
                    type="submit"
                    className="group relative w-full sm:flex-1 sm:min-w-[200px] px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                    <div className="relative flex items-center gap-3">
                      <div className="p-1 rounded-lg bg-white/20 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                      Submit Leave Request
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Decorative Elements */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default AddLeave;