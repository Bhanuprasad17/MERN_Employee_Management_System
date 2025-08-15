// DepartmentList.jsx
import React from "react";
import { data, Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelper";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [dep_loading, setDep_loading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([])

  const onDepartmentDelete = async(id) =>{
    const data =  departments.filter(dep => dep._id != id)
    setDepartments(data)
    setFilteredDepartments(data)
  }

  useEffect(() => {
    const fetchDepartments = async () => {
      setDep_loading(true);
      try {
        const response = await axios.get(
          "https://mern-employee-management-system-3.onrender.com/api/department",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          let sno = 1;
          const data = await response.data.departments.map((dep) => ({
            _id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            action: <DepartmentButtons Id = {dep._id} onDepartmentDelete = {onDepartmentDelete}/>,
          }));
          setDepartments(data);
          setFilteredDepartments(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setDep_loading(false);
      }
    };
    fetchDepartments();
  }, []);

  const filterDepartments = (e) => {
    const keyword = e.target.value.toLowerCase();
    const records = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(keyword)
    );
    setFilteredDepartments(records);
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
        minHeight: '65px',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {dep_loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-emerald-200 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 text-lg font-medium text-gray-700">Loading departments...</p>
            <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
          </div>
        </div>
      ) : (
        <div className="p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Department Management</h1>
                <p className="text-gray-600">Organize and manage your company departments efficiently</p>
              </div>
              <div className="flex items-center gap-4">
                {/* Department Count Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Departments</p>
                      <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                    </div>
                  </div>
                </div>
                
                {/* Add Department Button */}
                <Link
                  to="/admin-dashboard/add-department"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 
                           text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl 
                           transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Department
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">All Departments</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredDepartments.length} {filteredDepartments.length === 1 ? 'department' : 'departments'} 
                    {filteredDepartments.length !== departments.length && ` filtered from ${departments.length} total`}
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
                    placeholder="Search departments..."
                    className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-xl 
                             focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                             bg-white shadow-sm transition-all duration-200 text-sm"
                    onChange={filterDepartments}
                  />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-hidden">
              <DataTable 
                columns={columns} 
                data={filteredDepartments} 
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
                    <p className="text-gray-500 mb-6">Get started by creating your first department</p>
                    <Link
                      to="/admin-dashboard/add-department"
                      className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 
                               text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Department
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

export default DepartmentList;