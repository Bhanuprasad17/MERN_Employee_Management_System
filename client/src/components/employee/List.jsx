// List.jsx (Mobile Responsive Employee List Component) - UPDATED WITH FIXES
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { columns, EmployeeButtons } from '../../utils/EmployeeHelper';
import DataTable from 'react-data-table-component';

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [emp_Loading, setEmp_loading] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  // Mobile pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  
  const navigate = useNavigate();

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200 shadow-md"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                  }}
                />
              </div>
            ),
            profileImageUrl: `https://mern-employee-management-system-3.onrender.com/uploads/${emp.userId.profileImage}`, // Add direct URL
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
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Custom styles for DataTable with mobile responsiveness
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
        minHeight: isMobile ? '50px' : '60px',
        borderRadius: '0',
      },
    },
    headCells: {
      style: {
        fontSize: isMobile ? '11px' : '13px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'rgb(55 65 81)',
        paddingLeft: isMobile ? '8px' : '24px',
        paddingRight: isMobile ? '8px' : '24px',
      },
    },
    rows: {
      style: {
        backgroundColor: 'white',
        minHeight: isMobile ? '60px' : '75px',
        borderBottom: '1px solid rgb(243 244 246)',
        '&:hover': {
          backgroundColor: 'rgb(249 250 251)',
          transform: isMobile ? 'none' : 'scale(1.001)',
          boxShadow: isMobile ? 'none' : '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        },
        '&:last-child': {
          borderBottom: 'none',
        },
      },
    },
    cells: {
      style: {
        fontSize: isMobile ? '12px' : '14px',
        color: 'rgb(55 65 81)',
        paddingLeft: isMobile ? '8px' : '24px',
        paddingRight: isMobile ? '8px' : '24px',
      },
    },
    pagination: {
      style: {
        backgroundColor: 'rgb(249 250 251)',
        borderTop: '1px solid rgb(229 231 235)',
        minHeight: isMobile ? '50px' : '60px',
        padding: isMobile ? '8px' : '16px',
      },
      pageButtonsStyle: {
        borderRadius: '8px',
        height: isMobile ? '32px' : '40px',
        width: isMobile ? '32px' : '40px',
        padding: isMobile ? '4px' : '8px',
        margin: isMobile ? '0 2px' : '0 4px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: 'white',
        border: '1px solid rgb(229 231 235)',
        color: 'rgb(55 65 81)',
        fontSize: isMobile ? '12px' : '14px',
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

  // Mobile pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Pagination component for mobile
  const MobilePagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} employees
          </span>
        </div>
        
        <div className="flex items-center justify-center space-x-1">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300'
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1 mx-2">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={typeof page !== 'number'}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  page === currentPage
                    ? 'bg-emerald-500 text-white shadow-md'
                    : typeof page === 'number'
                    ? 'bg-white border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300'
                    : 'bg-transparent text-gray-400 cursor-default'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              currentPage === totalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // Mobile Card Component for individual employee - FIXED VERSION
  const MobileEmployeeCard = ({ employee }) => {
    // Debug function to check employee data
    const handleViewClick = (e) => {
      console.log('View button clicked');
      console.log('Employee object:', employee);
      console.log('Employee ID:', employee._id);
      
      // Check if employee._id exists
      if (!employee._id) {
        e.preventDefault();
        alert('Employee ID not found!');
        console.error('Employee ID is missing:', employee);
        return false;
      }
      
      // Log the route we're navigating to
      const route = `/admin-dashboard/employees/view/${employee._id}`;
      console.log('Navigating to:', route);
      return true;
    };

    // Alternative navigation function using navigate hook
    const handleViewWithNavigate = () => {
      console.log('View button clicked with navigate');
      console.log('Employee ID:', employee._id);
      
      if (!employee._id) {
        alert('Employee ID not found!');
        console.error('Employee ID is missing:', employee);
        return;
      }
      
      const route = `/admin-dashboard/employees/view/${employee._id}`;
      console.log('Navigating to:', route);
      navigate(route);
    };

    // Get profile image URL
    const getProfileImageUrl = () => {
      return employee.profileImageUrl || 'https://via.placeholder.com/56x56?text=No+Image';
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start space-x-3 mb-3">
          <div className="flex-shrink-0">
            <img 
              src={getProfileImageUrl()}
              alt={employee.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow-sm"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/56x56?text=No+Image';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{employee.name}</h3>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">#{employee.sno}</span>
            </div>
            <p className="text-xs text-emerald-600 font-medium mb-1">{employee.dep_name}</p>
            <p className="text-xs text-gray-500">DOB: {employee.dob}</p>
          </div>
        </div>
        
        <div className="flex justify-end pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {/* Method 1: Using Link with proper onClick handler */}
            <Link 
              to={`/admin-dashboard/employees/view/${employee._id}`}
              className="flex items-center justify-center w-9 h-9 bg-blue-100 hover:bg-blue-200 
                         text-blue-600 rounded-lg transition-colors duration-200 touch-manipulation"
              title="View Employee"
              onClick={handleViewClick}
              style={{ touchAction: 'manipulation' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </Link>

            {/* Method 2: Alternative using button with navigate (uncomment to use instead of Link) */}
            {/* 
            <button 
              onClick={handleViewWithNavigate}
              className="flex items-center justify-center w-9 h-9 bg-blue-100 hover:bg-blue-200 
                         text-blue-600 rounded-lg transition-colors duration-200 touch-manipulation"
              title="View Employee"
              style={{ touchAction: 'manipulation' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
            */}
            
            {/* Edit Employee Button */}
            <Link 
              to={`/admin-dashboard/employees/edit/${employee._id}`}
              className="flex items-center justify-center w-9 h-9 bg-emerald-100 hover:bg-emerald-200 
                         text-emerald-600 rounded-lg transition-colors duration-200 touch-manipulation"
              title="Edit Employee"
              style={{ touchAction: 'manipulation' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            
            {/* Delete Employee Button */}
            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this employee?')) {
                  onEmployeeDelete(employee._id);
                }
              }}
              className="flex items-center justify-center w-9 h-9 bg-red-100 hover:bg-red-200 
                         text-red-600 rounded-lg transition-colors duration-200 touch-manipulation"
              title="Delete Employee"
              style={{ touchAction: 'manipulation' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
            </button>

            {/* Method 3: Use original EmployeeButtons with mobile styling (uncomment to use) */}
            {/* 
            <div className="[&>*]:text-xs [&>*]:px-2 [&>*]:py-1 [&>*]:min-h-[36px] [&>*]:touch-manipulation">
              <EmployeeButtons Id={employee._id} onEmployeeDelete={onEmployeeDelete} />
            </div>
            */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {emp_Loading ? (
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-emerald-200 rounded-full"></div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 text-base sm:text-lg font-medium text-gray-700">Loading employees...</p>
            <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
          </div>
        </div>
      ) : (
        <div className="p-3 sm:p-6">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            {/* Title and Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Employee Management</h1>
                <p className="text-gray-600 text-sm sm:text-base">Manage and organize your workforce efficiently</p>
              </div>
              
              {/* Add Employee Button */}
              <Link
                to="/admin-dashboard/add-employee"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 
                         text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl 
                         transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Employee
              </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Total Employees Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Employees</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{employees.length}</p>
                    <p className="text-xs text-gray-500">Active workforce</p>
                  </div>
                </div>
              </div>

              {/* Filtered Results Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Filtered Results</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{filteredEmployees.length}</p>
                    <p className="text-xs text-gray-500">Current view</p>
                  </div>
                </div>
              </div>

              {/* Departments Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Active Departments</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{uniqueDepartments}</p>
                    <p className="text-xs text-gray-500">Unique divisions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar - Mobile First */}
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                className="pl-9 sm:pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-xl 
                         focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                         bg-white shadow-sm transition-all duration-200 text-sm"
                onChange={filterEmployees}
              />
            </div>
          </div>

          {/* Mobile View - Card Layout */}
          {isMobile ? (
            <div className="space-y-3">
              {/* Header Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">All Employees</h2>
                <p className="text-sm text-gray-600">
                  {filteredEmployees.length} {filteredEmployees.length === 1 ? 'employee' : 'employees'} 
                  {filteredEmployees.length !== employees.length && ` filtered from ${employees.length} total`}
                </p>
              </div>

              {/* Employee Cards */}
              {filteredEmployees.length > 0 ? (
                <>
                  {currentEmployees.map((employee) => (
                    <MobileEmployeeCard key={employee._id} employee={employee} />
                  ))}
                  <MobilePagination />
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                  <p className="text-gray-500 mb-4">Get started by adding your first employee</p>
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
              )}
            </div>
          ) : (
            /* Desktop View - DataTable */
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
          )}
        </div>
      )}
    </div>
  );
};

export default List;