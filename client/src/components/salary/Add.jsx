import React, { useEffect, useState } from "react";
import { fetchDepartments, fetchEmployees } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const navigate = useNavigate();

  const [salary, setSalary] = useState({
    employeeId: "",
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: ""
  });
  
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments || []);
    };
    getDepartments();
  }, []);

  const handleDepartment = async (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    
    if (departmentId) {
      try {
        console.log("Fetching employees for department:", departmentId);
        const emps = await fetchEmployees(departmentId);
        console.log("Fetched employees:", emps);
        setEmployees(emps || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        alert("Failed to fetch employees for this department");
        setEmployees([]);
      }
    } else {
      setEmployees([]);
    }
    
    // Reset employee selection when department changes
    setSalary(prev => ({ ...prev, employeeId: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalary((prev) => ({ ...prev, [name]: value }));
  };

  const calculateNetSalary = () => {
    const basic = parseFloat(salary.basicSalary) || 0;
    const allowances = parseFloat(salary.allowances) || 0;
    const deductions = parseFloat(salary.deductions) || 0;
    return basic + allowances - deductions;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const netSalary = calculateNetSalary();
      const salaryData = {
        ...salary,
        netSalary
      };

      const response = await axios.post(
        `https://mern-employee-management-system-3.onrender.com/api/salary/add`,
        salaryData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (response.data.success) {
        alert("Salary added successfully!");
        // navigate("/admin-dashboard/salary");
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      console.error("Add salary error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("Failed to add salary. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Add Salary
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg">
            Add salary information for employees
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Salary Information</h2>
                <p className="text-teal-100 text-sm">Fill in all the required details below</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                  <select
                    name="department"
                    onChange={handleDepartment}
                    value={selectedDepartment}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dep) => (
                      <option value={dep._id} key={dep._id}>{dep.dep_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Employee</label>
                  <select
                    name="employeeId"
                    onChange={handleChange}
                    value={salary.employeeId}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                    disabled={!selectedDepartment || employees.length === 0}
                  >
                    <option value="">
                      {!selectedDepartment 
                        ? "Select Department First" 
                        : employees.length === 0 
                        ? "No employees found in this department" 
                        : "Select Employee"
                      }
                    </option>
                    {employees && employees.length > 0 && employees.map((emp) => (
                      <option value={emp._id} key={emp._id}>
                        {emp.employeeId} - {emp.userId?.name || emp.name || 'Unknown'}
                      </option>
                    ))}
                  </select>
                  {selectedDepartment && employees.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      No employees found in this department
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Basic Salary</label>
                  <input
                    type="number"
                    name="basicSalary"
                    value={salary.basicSalary}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Allowances</label>
                  <input
                    type="number"
                    name="allowances"
                    value={salary.allowances}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Deductions</label>
                  <input
                    type="number"
                    name="deductions"
                    value={salary.deductions}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pay Date</label>
                  <input
                    type="date"
                    name="payDate"
                    value={salary.payDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>

              </div>

              {/* Net Salary Display */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Net Salary:</span>
                  <span className="text-2xl font-bold text-teal-600">
                    ₹{calculateNetSalary().toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Basic Salary + Allowances - Deductions
                </p>
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
                  Add Salary
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