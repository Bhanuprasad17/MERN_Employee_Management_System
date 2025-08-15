// FRONTEND COMPONENT
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaSearch, FaPlus, FaUser } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const List = () => {
  const {user} = useAuth()
  const [leaves, setLeaves] = useState([])
  const [filteredLeaves, setFilteredLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pagination, setPagination] = useState({})

  const {empId} = useParams()

  // Fixed: Better ID determination logic
  const id = user.role === 'admin' ? empId || user._id : user._id

  // Fetch leaves data
  useEffect(() => {
    fetchLeaves()
  }, [currentPage, statusFilter, typeFilter, id]) // Added id as dependency

  const fetchLeaves = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      })
      
      // Add filters only if they have values
      if (statusFilter) {
        params.append('status', statusFilter)
      }
      
      if (typeFilter) {
        params.append('leaveType', typeFilter)
      }
      
      // Include query parameters in the URL
      const url = `https://mern-employee-management-system-3.onrender.com/api/leave/${id}?${params.toString()}`
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      
      const data = response.data
      
      if (data.success) {
        setLeaves(data.data || [])
        setFilteredLeaves(data.data || [])
        setPagination(data.pagination || {})
        setTotalPages(data.pagination?.totalPages || 1)
      } else {
        setError(data.message || 'Failed to fetch leaves')
      }
    } catch (err) {
      if (err.response) {
        // Server responded with error status
        setError(err.response.data?.message || `HTTP error! status: ${err.response.status}`)
      } else if (err.request) {
        // Request was made but no response received
        setError('No response from server. Please check your connection.')
      } else {
        // Something else happened
        setError('Failed to fetch leaves. Please try again.')
      }
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Search functionality - works on client side
  useEffect(() => {
    if (searchTerm) {
      const filtered = leaves.filter(leave => {
        const employeeId = leave.employeeId?.userId || leave.employeeId?._id || ''
        const employeeName = leave.employeeId?.name || ''
        const department = leave.employeeId?.department || ''
        const leaveType = leave.leaveType || ''
        const reason = leave.reason || ''
        const status = leave.status || ''
        
        return (
          employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
          status.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
      setFilteredLeaves(filtered)
    } else {
      setFilteredLeaves(leaves)
    }
  }, [searchTerm, leaves])

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case 'Sick Leave':
        return 'bg-red-50 text-red-700'
      case 'Casual Leave':
        return 'bg-blue-50 text-blue-700'
      case 'Annual Leave':
        return 'bg-green-50 text-green-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  // Handle filter changes and reset to page 1
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value)
    setCurrentPage(1)
    setSearchTerm('')
  }

  const handleTypeFilterChange = (value) => {
    setTypeFilter(value)
    setCurrentPage(1)
    setSearchTerm('')
  }

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('')
    setTypeFilter('')
    setSearchTerm('')
    setCurrentPage(1)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-gray-800 mb-2">Manage Leaves</h3>
          <p className="text-gray-600">View, search, and manage employee leave requests</p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-sm" />
              </div>
              <input 
                type="text"
                placeholder="Search by employee name, ID, leave type, reason, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select 
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select 
                value={typeFilter}
                onChange={(e) => handleTypeFilterChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">All Types</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Annual Leave">Annual Leave</option>
              </select>

              {/* Clear Filters Button */}
              {(statusFilter || typeFilter || searchTerm) && (
                <button 
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150"
                >
                  Clear Filters
                </button>
              )}
            </div>
            
            {/* Add New Leave Button */}
            <Link 
              to="/employee-dashboard/add-leave"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <FaPlus className="text-sm" />
              Add New Leave
            </Link>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading leaves...</p>
            </div>
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-xl font-medium mb-2">No leave requests found</p>
              <p className="text-sm">
                {searchTerm || statusFilter || typeFilter 
                  ? 'Try adjusting your search or filters' 
                  : 'Start by adding your first leave request'
                }
              </p>
              {(searchTerm || statusFilter || typeFilter) && (
                <button 
                  onClick={clearFilters}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Employee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Leave Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reason</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Applied Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <FaUser className="text-blue-600 text-sm" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {leave.employeeId?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {leave.employeeId?.userId || leave.employeeId?._id || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              Dept: {leave.employeeId?.department || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(leave.leaveType)}`}>
                          {leave.leaveType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {calculateDays(leave.startDate, leave.endDate)} day(s)
                          </div>
                          <div className="text-gray-500">
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={leave.reason}>
                          {leave.reason}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(leave.status)}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(leave.appliedAt || leave.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-4 space-y-4">
              {filteredLeaves.map((leave) => (
                <div key={leave._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <FaUser className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {leave.employeeId?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {leave.employeeId?.userId || leave.employeeId?._id || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Dept: {leave.employeeId?.department || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(leave.status)}`}>
                      {leave.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Leave Type:</span>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(leave.leaveType)}`}>
                        {leave.leaveType}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="text-sm font-medium">
                        {calculateDays(leave.startDate, leave.endDate)} day(s)
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Dates:</span>
                      <span className="text-sm">
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      </span>
                    </div>
                    
                    <div className="pt-2">
                      <span className="text-sm text-gray-600">Reason:</span>
                      <p className="text-sm text-gray-900 mt-1">{leave.reason}</p>
                    </div>
                    
                    <div className="pt-2">
                      <span className="text-xs text-gray-500">
                        Applied: {formatDate(leave.appliedAt || leave.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                  {pagination.totalCount && (
                    <span className="ml-2">
                      ({pagination.totalCount} total records)
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || !pagination.hasPrevPage}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || !pagination.hasNextPage}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default List