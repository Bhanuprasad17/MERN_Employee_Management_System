import React, { useEffect, useState } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {

  const navigate = useNavigate()

  const [departments, setDepartments] = useState([])

  const [formData, setFormData] = useState({

  })

  useEffect(() =>{
    const getDepartments = async() =>{
      const departments = await fetchDepartments()
      setDepartments(departments)
    }
    getDepartments()
  },[])

  const handleChnage = (e) =>{
    const {name,value,files} = e.target
    if(name == 'image'){
      setFormData((prevData) => ({...prevData,[name] : files[0]}))
    }else{
      setFormData((prevData) => ({...prevData,[name] : value}))
    }
  }

  const handleSubmit = async(e) =>{

    e.preventDefault()

    const formDataObj = new FormData()

    Object.keys(formData).forEach(key => {
      formDataObj.append(key,formData[key]) 
    });


     try {
            const response = await axios.post('https://mern-employee-management-system-3.onrender.com/api/employee/add', formDataObj, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                navigate('/admin-dashboard/employees');
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error);
            }
        }

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Add New Employee
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg">
            Create a new employee profile for your organization
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Employee Information</h2>
                <p className="text-teal-100 text-sm">Fill in all the required details below</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleChnage}
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                             transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChnage}
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                             transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>

                {/* Employee Id */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    onChange={handleChnage}
                    placeholder="Enter employee ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                             transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    onChange={handleChnage}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                             transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    onChange={handleChnage}
                    name="gender"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                             transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    onChange={handleChnage}
                    name="maritalStatus"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                             transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                  </select>
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    onChange={handleChnage}
                    placeholder="Enter designation"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                             transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    name="department"
                    onChange={handleChnage}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                             transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dep) =>{
                      return <option value={dep._id} key={dep._id}>{dep.dep_name}</option>
                    })}
                  </select>
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Salary
                  </label>
                  <input
                    type="number"
                    name="salary"
                    onChange={handleChnage}
                    placeholder="Enter salary amount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                             transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChnage}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                             transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    onChange={handleChnage}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                             transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>

                {/* Image Upload - Full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="image"
                      onChange={handleChnage}
                      accept="image/*"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                               transition-all duration-200 bg-gray-50 hover:bg-white
                               file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                               file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700
                               hover:file:bg-teal-100"
                      required
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Upload a profile picture (JPG, PNG, GIF up to 10MB)</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/admin-dashboard/employees')}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold 
                           hover:bg-gray-200 transition-all duration-200 
                           border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold 
                           hover:bg-teal-700 transform hover:scale-105 transition-all duration-200 
                           shadow-lg hover:shadow-xl"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;