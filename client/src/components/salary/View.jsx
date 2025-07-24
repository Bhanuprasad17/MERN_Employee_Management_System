import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const View = () => {
    const [salaries, setSalaries] = useState([])
    const [filteredSalaries, setFilteredSalaries] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [employee, setEmployee] = useState(null)
    const [error, setError] = useState(null)
    const { id } = useParams()
    const navigate = useNavigate()

    const fetchSalaries = async () => {
        try {
            setLoading(true)
            setError(null)
            console.log("Fetching salaries for employee ID:", id)
            
            const response = await axios.get(`https://mern-employee-management-system-3.onrender.com/api/salary/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            
            console.log("API Response:", response.data)
            
            if (response.data.success) {
                let salaryData = response.data.salary || [];
                
                // Ensure it's always an array
                if (!Array.isArray(salaryData)) {
                    salaryData = salaryData ? [salaryData] : [];
                }
                
                console.log("Processed salary data:", salaryData);
                
                setSalaries(salaryData)
                setFilteredSalaries(salaryData)
                
                // Get employee info from the first salary record
                if (salaryData.length > 0 && salaryData[0].employeeId) {
                    setEmployee(salaryData[0].employeeId)
                    console.log("Employee info:", salaryData[0].employeeId)
                }
            } else {
                console.error("API returned success: false")
                setError("Failed to fetch salary records")
                setSalaries([])
                setFilteredSalaries([])
            }
        } catch (error) {
            console.error('Fetch salaries error:', error)
            setSalaries([])
            setFilteredSalaries([])
            
            if (error.response) {
                console.error("Error response:", error.response.data)
                setError(error.response.data.error || error.response.data.message || 'Failed to fetch salary records')
            } else if (error.request) {
                console.error("Network error:", error.request)
                setError('Network error - please check if the server is running')
            } else {
                console.error("Error:", error.message)
                setError('An unexpected error occurred')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSalaries();
    }, [id])

    // Fixed function name from filteredSlaries to filteredSalaries
    const filterSalaries = (q) => {
        if (!q.trim()) {
            setFilteredSalaries(salaries)
            return
        }
        
        const filtered = salaries.filter(salary => {
            const payDate = new Date(salary.payDate).toLocaleDateString()
            const netSalary = salary.netSalary?.toString() || '0'
            const basicSalary = salary.basicSalary?.toString() || '0'
            const allowances = salary.allowances?.toString() || '0'
            const deductions = salary.deductions?.toString() || '0'
            
            return payDate.toLowerCase().includes(q.toLowerCase()) ||
                   netSalary.includes(q) ||
                   basicSalary.includes(q) ||
                   allowances.includes(q) ||
                   deductions.includes(q)
        })
        
        setFilteredSalaries(filtered)
    }

    const handleSearchChange = (e) => {
        const query = e.target.value
        setSearchQuery(query)
        filterSalaries(query)
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount || 0)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        } catch (error) {
            return 'Invalid Date'
        }
    }

    const getLatestPayDate = () => {
        if (!filteredSalaries || filteredSalaries.length === 0) return 'N/A'
        try {
            const dates = filteredSalaries
                .map(s => new Date(s.payDate))
                .filter(date => !isNaN(date))
            
            if (dates.length === 0) return 'N/A'
            
            const latestDate = new Date(Math.max(...dates))
            return formatDate(latestDate)
        } catch (error) {
            return 'N/A'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg">Loading salary records...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Data</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={fetchSalaries}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                Salary Records
                            </h1>
                            <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full"></div>
                            {employee && (
                                <p className="text-gray-600 mt-4 text-lg">
                                    Employee: <span className="font-semibold text-gray-800">
                                        {employee.userId?.name || 'Unknown Employee'} 
                                        ({employee.employeeId || 'N/A'})
                                    </span>
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search by date, salary amount, allowances, deductions..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Debug Information (Remove in production) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            <strong>Debug Info:</strong> Employee ID: {id}, 
                            Total Records: {salaries.length}, 
                            Filtered Records: {filteredSalaries.length}, 
                            Employee Data: {employee ? 'Loaded' : 'Not loaded'}
                        </p>
                    </div>
                )}

                {/* Salary Records */}
                {!filteredSalaries || filteredSalaries.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Salary Records Found</h3>
                        <p className="text-gray-500">
                            {searchQuery ? 'No records match your search criteria.' : 'No salary records available for this employee.'}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setFilteredSalaries(salaries)
                                }}
                                className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        {/* Table Header */}
                        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Salary History</h2>
                            <p className="text-teal-100 text-sm">
                                {searchQuery ? `Showing ${filteredSalaries.length} of ${salaries.length} records` : `Total Records: ${filteredSalaries.length}`}
                            </p>
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pay Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Basic Salary</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Allowances</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deductions</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Net Salary</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredSalaries.map((salary, index) => (
                                        <tr key={salary._id || index} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {formatDate(salary.payDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatCurrency(salary.basicSalary)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                                +{formatCurrency(salary.allowances)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                                -{formatCurrency(salary.deductions)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-teal-600">
                                                {formatCurrency(salary.netSalary)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(salary.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-200">
                            {filteredSalaries.map((salary, index) => (
                                <div key={salary._id || index} className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                Salary #{index + 1}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Pay Date: {formatDate(salary.payDate)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-teal-600">
                                                {formatCurrency(salary.netSalary)}
                                            </p>
                                            <p className="text-sm text-gray-500">Net Salary</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Basic</p>
                                            <p className="font-semibold text-gray-900">
                                                {formatCurrency(salary.basicSalary)}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-green-600">Allowances</p>
                                            <p className="font-semibold text-green-600">
                                                +{formatCurrency(salary.allowances)}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-red-600">Deductions</p>
                                            <p className="font-semibold text-red-600">
                                                -{formatCurrency(salary.deductions)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                                        Created: {formatDate(salary.createdAt)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Summary Card */}
                {filteredSalaries && filteredSalaries.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-600 font-medium">Total Records</p>
                                <p className="text-2xl font-bold text-blue-800">{filteredSalaries.length}</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <p className="text-sm text-green-600 font-medium">Total Paid</p>
                                <p className="text-2xl font-bold text-green-800">
                                    {formatCurrency(filteredSalaries.reduce((sum, salary) => sum + (salary.netSalary || 0), 0))}
                                </p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <p className="text-sm text-purple-600 font-medium">Avg. Salary</p>
                                <p className="text-2xl font-bold text-purple-800">
                                    {formatCurrency(filteredSalaries.reduce((sum, salary) => sum + (salary.netSalary || 0), 0) / filteredSalaries.length)}
                                </p>
                            </div>
                            <div className="text-center p-4 bg-teal-50 rounded-lg">
                                <p className="text-sm text-teal-600 font-medium">Latest Pay</p>
                                <p className="text-2xl font-bold text-teal-800">
                                    {getLatestPayDate()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default View