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
            const response = await axios.post('http://localhost:3000/api/employee/add', formDataObj, {
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
    <div className="max-w-4xl mx-auto mt-10 bg-white p-10 rounded-xl shadow-lg border">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add New Employee
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChnage}
              placeholder="Insert Name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChnage}
              placeholder="Insert Email"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Employee Id */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee Id
            </label>
            <input
              type="text"
              name="employeeId"
              onChange={handleChnage}
              placeholder="Employee ID"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              onChange={handleChnage}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              onChange={handleChnage}
              name="gender"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            <label className="block text-sm font-medium text-gray-700">
              Marital Status
            </label>
            <select
              onChange={handleChnage}
              name="maritalStatus"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              onChange={handleChnage}
              placeholder="Designation"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="department"
              onChange={handleChnage}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select Department</option>
              {/* Add dynamic department options here */}
              {
                departments.map((dep) =>{
                  return <option value={dep._id} key={dep._id}>{dep.dep_name}</option>
                })
              }
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Salary
            </label>
            <input
              type="number"
              name="salary"
              onChange={handleChnage}
              placeholder="Salary"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChnage}
              placeholder="******"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              onChange={handleChnage}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChnage}
              accept="image/*"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        {/* Centered Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
