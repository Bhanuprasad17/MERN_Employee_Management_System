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
  }

  useEffect(() => {
    const fetchDepartments = async () => {
      setDep_loading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/department",
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
    headRow: {
      style: {
        backgroundColor: '#f8fafc',
        borderBottom: '2px solid #e2e8f0',
        minHeight: '60px',
      },
    },
    headCells: {
      style: {
        fontSize: '14px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#374151',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
    },
    rows: {
      style: {
        minHeight: '65px',
        '&:hover': {
          backgroundColor: '#f1f5f9',
        },
      },
    },
    cells: {
      style: {
        fontSize: '14px',
        color: '#4b5563',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
    },
  };

  return (
    <>
      {dep_loading ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">Loading departments...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-3">
                  Department Management
                </h1>
                <div className="w-32 h-1 bg-gradient-to-r from-teal-500 to-blue-600 mx-auto rounded-full"></div>
                <p className="text-gray-600 mt-4 text-lg">
                  Organize and manage company departments
                </p>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white">All Departments</h2>
                    <p className="text-teal-100 mt-1">Manage and organize your departments</p>
                  </div>
                  <Link
                    to="/admin-dashboard/add-department"
                    className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold 
                             hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 
                             shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Department
                  </Link>
                </div>
              </div>

              {/* Search Bar */}
              <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search departments..."
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                             bg-white shadow-sm transition-all duration-200"
                    onChange={filterDepartments}
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-hidden">
                <DataTable 
                  columns={columns} 
                  data={filteredDepartments} 
                  pagination
                  customStyles={customStyles}
                  noDataComponent={
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg">No departments found</p>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentList;