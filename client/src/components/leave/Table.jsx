import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaFilter } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';

// LeaveButton component with modern styling
const LeaveButton = ({ id, onUpdate }) => {
  const navigate = useNavigate()

  const handleApprove = async () => {
    try {
      const response = await axios.put(
        `https://mern-employee-management-system-3.onrender.com/api/leave/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        alert("Leave approved successfully");
        onUpdate();
      }
    } catch (error) {
      alert("Error approving leave");
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.put(
        `https://mern-employee-management-system-3.onrender.com/api/leave/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        alert("Leave rejected successfully");
        onUpdate();
      }
    } catch (error) {
      alert("Error rejecting leave");
    }
  };

  const hanldeView = async(id) =>{
    navigate(`/admin-dashboard/leaves/${id}`)
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleApprove}
        className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Approve
      </button>
      <button
        onClick={handleReject}
        className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Reject
      </button>
      <button 
        onClick={() => hanldeView(id)}
        className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <FaEye className="text-xs" />
      </button>
    </div>
  );
};

const Table = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://mern-employee-management-system-3.onrender.com/api/leave",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        let sno = 1;
        const data = response.data.leaves.map((leave) => ({
          _id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId.employeeId,
          name: leave.employeeId.userId.name,
          leaveType: leave.leaveType,
          department: leave.employeeId.department.dep_name,
          days: new Date(leave.endDate).getDate() - new Date(leave.startDate).getDate(),
          status: leave.status,
        }));
        setLeaves(data);
        setFilteredLeaves(data);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterLeaves = () => {
    let filtered = leaves;

    if (searchTerm) {
      filtered = filtered.filter(leave =>
        leave.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(leave => 
        leave.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredLeaves(filtered);
    setResetPaginationToggle(!resetPaginationToggle);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    filterLeaves();
  }, [searchTerm, statusFilter, leaves]);

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-3 py-1 text-xs font-bold rounded-full shadow-sm";
    switch (status.toLowerCase()) {
      case 'approved':
        return `${baseClasses} bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300`;
      case 'rejected':
        return `${baseClasses} bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300`;
      case 'pending':
        return `${baseClasses} bg-gradient-to-r from-amber-100 to-yellow-200 text-amber-800 border border-amber-300`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300`;
    }
  };

  const columns = [
    {
      name: 'S.No',
      selector: row => row.sno,
      sortable: true,
      width: '80px',
      cell: row => (
        <div className="font-semibold text-slate-600">
          {row.sno}
        </div>
      ),
    },
    {
      name: 'Employee ID',
      selector: row => row.employeeId,
      sortable: true,
      width: '130px',
      cell: row => (
        <div className="font-mono text-sm bg-slate-100 px-2 py-1 rounded-md text-slate-700">
          {row.employeeId}
        </div>
      ),
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      width: '160px',
      cell: row => (
        <div className="font-medium text-slate-800">
          {row.name}
        </div>
      ),
    },
    {
      name: 'Leave Type',
      selector: row => row.leaveType,
      sortable: true,
      width: '130px',
      cell: row => (
        <div className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">
          {row.leaveType}
        </div>
      ),
    },
    {
      name: 'Department',
      selector: row => row.department,
      sortable: true,
      width: '140px',
      cell: row => (
        <div className="text-sm text-slate-600 font-medium">
          {row.department}
        </div>
      ),
    },
    {
      name: 'Days',
      selector: row => row.days,
      sortable: true,
      width: '80px',
      center: true,
      cell: row => (
        <div className="bg-indigo-50 text-indigo-700 font-bold px-2 py-1 rounded-full text-center min-w-[40px]">
          {row.days}
        </div>
      ),
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      width: '130px',
      cell: row => (
        <span className={getStatusBadge(row.status)}>
          {row.status}
        </span>
      ),
    },
    {
      name: 'Actions',
      cell: row => <LeaveButton id={row._id} onUpdate={fetchLeaves} />,
      ignoreRowClick: true,
      allowOverflow: true,
      width: '220px',
    },
  ];

  // Modern DataTable styles
  const customStyles = {
    table: {
      style: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
      },
    },
    head: {
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontWeight: '700',
        fontSize: '13px',
        textTransform: 'uppercase',
        color: '#ffffff',
        letterSpacing: '1px',
        borderBottom: 'none',
      },
    },
    headCells: {
      style: {
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '16px',
        paddingBottom: '16px',
      },
    },
    cells: {
      style: {
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '16px',
        paddingBottom: '16px',
        fontSize: '14px',
        color: '#334155',
        borderBottom: '1px solid #e2e8f0',
      },
    },
    rows: {
      style: {
        backgroundColor: '#ffffff',
        '&:nth-of-type(even)': {
          backgroundColor: '#f8fafc',
        },
        '&:hover': {
          backgroundColor: '#e0f2fe',
          transform: 'scale(1.01)',
          transition: 'all 0.2s ease-in-out',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        minHeight: '60px',
        transition: 'all 0.2s ease-in-out',
      },
    },
    pagination: {
      style: {
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderTop: '2px solid #cbd5e1',
        paddingTop: '16px',
        paddingBottom: '16px',
        paddingLeft: '20px',
        paddingRight: '20px',
        fontSize: '14px',
        color: '#475569',
        fontWeight: '500',
      },
      pageButtonsStyle: {
        borderRadius: '8px',
        height: '36px',
        width: '36px',
        padding: '6px',
        margin: '0 3px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        color: '#475569',
        fill: '#475569',
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        '&:disabled': {
          cursor: 'not-allowed',
          color: '#94a3b8',
          fill: '#94a3b8',
          backgroundColor: '#f1f5f9',
        },
        '&:hover:not(:disabled)': {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          fill: '#ffffff',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)',
        },
        '&:focus': {
          outline: 'none',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          fill: '#ffffff',
          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
        },
      },
    },
  };

  const NoDataComponent = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-full p-6 mb-6 shadow-lg">
        <FaSearch className="h-12 w-12 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-700 mb-3">No Records Found</h3>
      <p className="text-sm text-slate-500 text-center max-w-md leading-relaxed">
        We couldn't find any leave records matching your search criteria. 
        Try adjusting your filters or search terms to discover more results.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Modern Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Leave Management System</h1>
            <p className="text-blue-100 text-lg">Monitor and manage employee leave requests with modern efficiency</p>
          </div>
        </div>

        {/* Compact Controls Panel */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-5 py-3 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 flex items-center">
              <FaFilter className="mr-2 text-indigo-600" />
              Search & Filter
            </h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Search Section */}
              <div>
                <label htmlFor="search" className="block text-xs font-bold text-slate-700 mb-2">
                  🔍 Search Records
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by ID, name, type, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 text-sm shadow-sm transition-all duration-200 bg-slate-50 hover:bg-white"
                  />
                </div>
              </div>

              {/* Filter Section */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  🎯 Filter Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "all", label: "All", color: "from-slate-500 to-slate-600", textColor: "text-white" },
                    { key: "pending", label: "Pending", color: "from-amber-500 to-yellow-600", textColor: "text-white" },
                    { key: "approved", label: "Approved", color: "from-green-500 to-emerald-600", textColor: "text-white" },
                    { key: "rejected", label: "Rejected", color: "from-red-500 to-rose-600", textColor: "text-white" }
                  ].map(({ key, label, color, textColor }) => (
                    <button
                      key={key}
                      onClick={() => handleStatusFilter(key)}
                      className={`px-3 py-2 text-xs font-bold rounded-lg border-2 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md ${
                        statusFilter === key
                          ? `bg-gradient-to-r ${color} ${textColor} border-transparent shadow-md scale-105`
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Table Container */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-8 py-6 border-b border-slate-200">
            <h3 className="text-xl font-bold text-slate-800">📊 Leave Records Dashboard</h3>
            <p className="text-sm text-slate-600 mt-2 font-medium">
              Displaying {filteredLeaves.length} record{filteredLeaves.length !== 1 ? 's' : ''} 
              {filteredLeaves.length !== leaves.length && ` of ${leaves.length} total`}
            </p>
          </div>
          
          <DataTable
            columns={columns}
            data={filteredLeaves}
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            progressPending={loading}
            progressComponent={
              <div className="p-16 text-center">
                <div className="inline-flex items-center px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100">
                  <div className="animate-spin rounded-full h-6 w-6 border-3 border-blue-600 border-t-transparent mr-4"></div>
                  <span className="text-blue-700 font-bold text-lg">Loading awesome data...</span>
                </div>
              </div>
            }
            noDataComponent={<NoDataComponent />}
            customStyles={customStyles}
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25]}
            paginationComponentOptions={{
              rowsPerPageText: 'Records per page:',
              rangeSeparatorText: 'of',
              selectAllRowsItem: true,
              selectAllRowsItemText: 'All Records',
            }}
            highlightOnHover
            striped
            responsive
            fixedHeader
            fixedHeaderScrollHeight="600px"
          />
        </div>
      </div>
    </div>
  );
};

export default Table;