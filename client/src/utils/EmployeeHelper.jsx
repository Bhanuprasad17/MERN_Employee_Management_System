// EmployeeHelper.jsx
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    sortable: true,
    width: "80px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width: "200px",
  },
  {
    name: "Photo",
    selector: (row) => row.profileImage,
    width: "100px",
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
    width: "180px",
  },
  {
    name: "Date of Birth",
    selector: (row) => row.dob,
    sortable: true,
    width: "150px",
  },
  {
    name: "Actions",
    selector: (row) => row.action,
    width: "400px", // Increased width to accommodate all buttons
    allowOverflow: true,
  },
];

export const fetchDepartments = async () => {
  let departments;
  try {
    const response = await axios.get("https://mern-employee-management-system-3.onrender.com/api/department", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.data.success) {
      departments = response.data.departments;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return departments;
};

// employees fro salary form
export const fetchEmployees = async (id) => {
  let employees;
  try {
    const response = await axios.get(`https://mern-employee-management-system-3.onrender.com/api/employee/department/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.data.success) {
      employees = response.data.employees;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
    console.error("Fetch employees error:", error);
  }
  return employees;
};


export const EmployeeButtons = ({ Id, onEmployeeDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await axios.delete(
          `https://mern-employee-management-system-3.onrender.com/api/employee/${Id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          onEmployeeDelete(Id);
          alert("Employee deleted successfully");
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        } else {
          alert("Error deleting employee");
        }
      }
    }
  };

  const handleEdit = () => {
    navigate(`/admin-dashboard/employees/edit/${Id}`);
  };

  const handleSalary = () => {
    navigate(`/admin-dashboard/employees/salary/${Id}`);
  };

  const handleLeave = () => {
    navigate(`/admin-dashboard/leave/${Id}`);
  };

  const handleView = () => {
    navigate(`/admin-dashboard/employee/${Id}`);
  };

  return (
    <div className="flex items-center justify-start space-x-1 min-w-max overflow-hidden">
      {/* Mobile: Dropdown Menu */}
      <div className="block lg:hidden relative">
        <div className="dropdown">
          <button 
            className="px-2 py-1.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs 
                       font-medium rounded hover:from-gray-600 hover:to-gray-700 
                       transition-all duration-200 shadow-sm hover:shadow-md
                       flex items-center gap-1"
            onClick={(e) => {
              const dropdown = e.target.closest('.dropdown').querySelector('.dropdown-menu');
              dropdown.classList.toggle('hidden');
            }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
            Actions
          </button>
          <div className="dropdown-menu hidden absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <button
              className="w-full text-left px-3 py-2 text-sm text-teal-600 hover:bg-teal-50 flex items-center gap-2 border-b border-gray-100"
              onClick={handleView}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </button>
            <button
              className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 border-b border-gray-100"
              onClick={handleEdit}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              className="w-full text-left px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2 border-b border-gray-100"
              onClick={handleSalary}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Salary
            </button>
            {/* <button
              className="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 flex items-center gap-2 border-b border-gray-100"
              onClick={handleLeave}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Leave
            </button> */}
            <button
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              onClick={handleDelete}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Desktop: Individual Buttons */}
      <div className="hidden lg:flex items-center space-x-1">
        {/* View Button */}
        <button
          className="px-2 py-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs 
                     font-medium rounded hover:from-teal-600 hover:to-teal-700 
                     transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md
                     flex items-center gap-1 whitespace-nowrap"
          onClick={handleView}
          title="View Employee Details"
        >
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="hidden xl:inline">View</span>
        </button>

        {/* Edit Button */}
        <button
          className="px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs 
                     font-medium rounded hover:from-blue-600 hover:to-blue-700 
                     transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md
                     flex items-center gap-1 whitespace-nowrap"
          onClick={handleEdit}
          title="Edit Employee"
        >
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="hidden xl:inline">Edit</span>
        </button>

        {/* Salary Button */}
        <button
          className="px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs 
                     font-medium rounded hover:from-amber-600 hover:to-amber-700 
                     transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md
                     flex items-center gap-1 whitespace-nowrap"
          onClick={handleSalary}
          title="Manage Salary"
        >
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span className="hidden xl:inline">Salary</span>
        </button>

        {/* Leave Button */}
        {/* <button
          className="px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs 
                     font-medium rounded hover:from-purple-600 hover:to-purple-700 
                     transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md
                     flex items-center gap-1 whitespace-nowrap"
          onClick={handleLeave}
          title="Manage Leave"
        >
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="hidden xl:inline">Leave</span>
        </button> */}

        {/* Delete Button */}
        <button
          className="px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs 
                     font-medium rounded hover:from-red-600 hover:to-red-700 
                     transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md
                     flex items-center gap-1 whitespace-nowrap"
          onClick={handleDelete}
          title="Delete Employee"
        >
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
          <span className="hidden xl:inline">Delete</span>
        </button>
      </div>
    </div>
  );
};