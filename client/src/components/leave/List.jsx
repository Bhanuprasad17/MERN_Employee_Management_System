import React from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaPlus } from 'react-icons/fa'

const List = () => {
  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      {/* Header Section */}
      <div className='mb-8'>
        <div className='text-center mb-6'>
          <h3 className='text-3xl font-bold text-gray-800 mb-2'>Manage Leaves</h3>
          <p className='text-gray-600'>View, search, and manage employee leave requests</p>
        </div>
        
        {/* Search and Action Bar */}
        <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            {/* Search Input */}
            <div className='relative flex-1 max-w-md'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaSearch className='text-gray-400 text-sm' />
              </div>
              <input 
                type='text'
                placeholder='Search by Department Name'
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white'
              />
            </div>
            
            {/* Add New Leave Button */}
            <Link 
              to='/employee-dashboard/add-leave'
              className='flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg'
            >
              <FaPlus className='text-sm' />
              Add New Leave
            </Link>
          </div>
        </div>
      </div>
      
      {/* Content Area - Ready for leave list */}
      <div className='bg-white rounded-xl shadow-lg border border-gray-200 min-h-96 flex items-center justify-center'>
        <div className='text-center text-gray-500'>
          <div className='text-4xl mb-4'>📋</div>
          <p className='text-lg font-medium'>Leave requests will appear here</p>
          <p className='text-sm'>Add your leave list component in this section</p>
        </div>
      </div>
    </div>
  )
}

export default List