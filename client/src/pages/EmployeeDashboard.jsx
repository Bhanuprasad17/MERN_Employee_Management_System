import React from 'react'
import Sidebar from '../components/employeeDashboard/Sidebar'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navbar from '../components/dashboard/Navbar'

const EmployeeDashboard = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
      {/* Premium Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area - This should take full remaining width */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <Navbar />

        {/* Main Content - This should expand to fill remaining height */}
        <main className="flex-1 w-full">
          {/* Premium content container - Full width and height */}
          <div className="w-full h-full">
            {/* Content will be rendered here via Outlet - Should consume full space */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default EmployeeDashboard