// List.jsx (Employee List Component)
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { columns, EmployeeButtons } from '../../utils/EmployeeHelper';
import DataTable from 'react-data-table-component';

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [emp_Loading, setEmp_loading] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const onEmployeeDelete = async(id) => {
    const data = employees.filter(emp => emp._id !== id);
    setEmployees(data);
    setFilteredEmployees(data);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmp_loading(true);
      try {
        const response = await axios.get(
          "https://mern-employee-management-system-3.onrender.com/api/employee",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          let sno = 1;
          const data = await response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            dep_name: emp.department.dep_name,
            name: emp.userId.name,
            dob: new Date(emp.dob).toLocaleDateString(),
            profileImage: (
              <div className="flex items-center justify-center">
                <img 
                  src={`https://mern-employee-management-system-3.onrender.com/uploads/${emp.userId.profileImage}`} 
                  alt={emp.userId.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-md"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                  }}
                />
              </div>
            ),
            action: (<EmployeeButtons Id={emp._id} onEmployeeDelete={onEmployeeDelete} />)
          }));
          setEmployees(data);
          setFilteredEmployees(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setEmp_loading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filterEmployees = (e) => {
    const keyword = e.target.value.toLowerCase();
    const records = employees.filter((emp) =>
      emp.dep_name.toLowerCase().includes(keyword) ||
      emp.name.toLowerCase().includes(keyword)
    );
    setFilteredEmployees(records);
  };

  // Custom styles for DataTable
  const customStyles = {
    table: {
      style: {
        backgroundColor: 'transparent',
      },
    },
    headRow: {
      style: {
        backgroundColor: 'rgb(249 250 251)',
        borderBottom: '1px solid rgb(229 231 235)',
        minHeight: '60px',
        borderRadius: '0',
      },
    },
    headCells: {
      style: {
        fontSize: '13px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'rgb(55 65 81)',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
    },
    rows: {
      style: {
        backgroundColor: 'white',
        minHeight: '75px',
        borderBottom: '1px solid rgb(243 244 246)',
        '&:hover': {
          backgroundColor: 'rgb(249 250 251)',
          transform: 'scale(1.001)',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        },
        '&:last-child': {
          borderBottom: 'none',
        },
      },
    },
    cells: {
      style: {
        fontSize: '14px',
        color: 'rgb(55 65 81)',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
    },
    pagination: {
      style: {
        backgroundColor: 'rgb(249 250 251)',
        borderTop: '1px solid rgb(229 231 235)',
        minHeight: '60px',
      },
      pageButtonsStyle: {
        borderRadius: '8px',
        height: '40px',
        width: '40px',
        padding: '8px',
        margin: '0 4px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: 'white',
        border: '1px solid rgb(229 231 235)',
        color: 'rgb(55 65 81)',
        '&:hover:not(:disabled)': {
          backgroundColor: 'rgb(16 185 129)',
          borderColor: 'rgb(16 185 129)',
          color: 'white',
        },
        '&:focus': {
          outline: 'none',
          ring: '2px',
          ringColor: 'rgb(16 185 129)',
        },
      },
    },
  };

  // Calculate unique departments count
  const uniqueDepartments = employees.length > 0 
    ? [...new Set(employees.map(emp => emp.dep_name))].length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {emp_Loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-emerald-200 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 text-lg font-medium text-gray-700">Loading employees...</p>
            <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
          </div>
        </div>
      ) : (
        <div className="p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Management</h1>
                <p className="text-gray-600">Manage and organize your workforce efficiently</p>
              </div>
              
              {/* Add Employee Button */}
              <Link
                to="/admin-dashboard/add-employee"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 
                         text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl 
                         transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Employee
              </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Employees Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                    <p className="text-xs text-gray-500">Active workforce</p>
                  </div>
                </div>
              </div>

              {/* Filtered Results Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Filtered Results</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredEmployees.length}</p>
                    <p className="text-xs text-gray-500">Current view</p>
                  </div>
                </div>
              </div>

              {/* Departments Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Departments</p>
                    <p className="text-2xl font-bold text-gray-900">{uniqueDepartments}</p>
                    <p className="text-xs text-gray-500">Unique divisions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">All Employees</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredEmployees.length} {filteredEmployees.length === 1 ? 'employee' : 'employees'} 
                    {filteredEmployees.length !== employees.length && ` filtered from ${employees.length} total`}
                  </p>
                </div>
                
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search employees..."
                    className="pl-10 pr-4 py-2.5 w-72 border border-gray-300 rounded-xl 
                             focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                             bg-white shadow-sm transition-all duration-200 text-sm"
                    onChange={filterEmployees}
                  />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-hidden">
              <DataTable 
                columns={columns} 
                data={filteredEmployees} 
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[5, 10, 15, 20]}
                customStyles={customStyles}
                highlightOnHover
                pointerOnHover
                responsive
                noDataComponent={
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                    <p className="text-gray-500 mb-6">Get started by adding your first employee</p>
                    <Link
                      to="/admin-dashboard/add-employee"
                      className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 
                               text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Employee
                    </Link>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;