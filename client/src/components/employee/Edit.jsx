import React, { useEffect, useState } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `https://mern-employee-management-system-3.onrender.com/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          const emp = response.data.employee;
          setEmployee(emp);
          setFormData({
            name: emp.userId.name,
            maritalStatus: emp.maritalStatus,
            designation: emp.designation,
            salary: emp.salary,
            department: emp.department._id,
            role: emp.role || "", // Added role field
          });
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
        console.error("Fetch employee error:", error);
      }
    };

    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };

    fetchEmployee();
    getDepartments();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(
        `https://mern-employee-management-system-3.onrender.com/api/employee/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (response.data.success) {
        alert("Employee updated successfully!");
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      console.error("Update error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("Failed to update employee. Please try again.");
      }
    }
  };

  return (
    <>
      {employee && departments ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
          <div className="w-full max-w-5xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-3">
                Edit Employee
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-600 mx-auto rounded-full"></div>
              <p className="text-gray-600 mt-4 text-lg">
                Update employee profile information
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
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

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Marital Status</label>
                      <select
                        name="maritalStatus"
                        onChange={handleChange}
                        value={formData.maritalStatus || ""}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                      <select
                        name="role"
                        onChange={handleChange}
                        value={formData.role || ""}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        required
                      >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Salary</label>
                      <input
                        type="number"
                        name="salary"
                        value={formData.salary || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                      <select
                        name="department"
                        onChange={handleChange}
                        value={formData.department || ""}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((dep) => (
                          <option value={dep._id} key={dep._id}>{dep.dep_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => navigate("/admin-dashboard/employees")}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Update Employee
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500 text-lg">Loading...</div>
      )}
    </>
  );
};

export default Edit;