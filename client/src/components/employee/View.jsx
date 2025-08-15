import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const View = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

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
          setEmployee(response.data.employee);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      }
    };
    fetchEmployee();
  }, []);

  return (
    <>
      {employee ? (
        <div className="max-w-4xl mx-auto mt-12 bg-white p-10 rounded-xl shadow-lg border border-gray-200">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)} // or navigate("/employee-list")
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            ← Back
          </button>

          <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
            Employee Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Profile Image */}
            <div className="flex justify-center">
              <img
                src={`https://mern-employee-management-system-3.onrender.com/uploads/${employee.userId.profileImage}`}
                alt="Employee"
                className="rounded-full w-60 h-60 object-cover border-4 border-gray-300 shadow-md"
              />
            </div>

            {/* Employee Info */}
            <div className="space-y-5">
              <div className="flex items-center">
                <p className="w-40 font-semibold text-gray-700">Name:</p>
                <p className="text-gray-800">{employee.userId.name}</p>
              </div>
              <div className="flex items-center">
                <p className="w-40 font-semibold text-gray-700">Employee ID:</p>
                <p className="text-gray-800">{employee.employeeId}</p>
              </div>
              <div className="flex items-center">
                <p className="w-40 font-semibold text-gray-700">Date of Birth:</p>
                <p className="text-gray-800">
                  {new Date(employee.dob).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center">
                <p className="w-40 font-semibold text-gray-700">Gender:</p>
                <p className="text-gray-800">{employee.gender}</p>
              </div>
              <div className="flex items-center">
                <p className="w-40 font-semibold text-gray-700">Department:</p>
                <p className="text-gray-800">{employee.department.dep_name}</p>
              </div>
              <div className="flex items-center">
                <p className="w-40 font-semibold text-gray-700">Marital Status:</p>
                <p className="text-gray-800">{employee.maritalStatus}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-20 text-lg">Loading...</div>
      )}
    </>
  );
};

export default View;
