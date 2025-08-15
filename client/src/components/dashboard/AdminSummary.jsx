// src/components/AdminSummary.jsx
import React from 'react';
import SummaryCard from './SummaryCard';
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaTimesCircle,
  FaUsers
} from 'react-icons/fa';

const AdminSummary = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='mb-12'>
          <div className='border-l-4 border-indigo-600 pl-6'>
            <h1 className='text-4xl font-bold text-gray-800 tracking-tight'>
              Dashboard Overview
            </h1>
            <p className='text-lg text-gray-600 mt-2 font-medium'>
              Executive Summary & Key Metrics
            </p>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
          <SummaryCard 
            icon={<FaUsers />} 
            text="Total Employees" 
            number={13} 
            color="from-blue-600 to-blue-700"
            bgAccent="bg-blue-50"
            borderAccent="border-blue-200"
          />
          <SummaryCard 
            icon={<FaBuilding />} 
            text="Total Departments" 
            number={5} 
            color="from-amber-600 to-amber-700"
            bgAccent="bg-amber-50"
            borderAccent="border-amber-200"
          />
          <SummaryCard 
            icon={<FaMoneyBillWave />} 
            text="Monthly Salary" 
            number="$645" 
            color="from-emerald-600 to-emerald-700"
            bgAccent="bg-emerald-50"
            borderAccent="border-emerald-200"
          />
        </div>

        {/* Leave Management Section */}
        <div className='bg-white rounded-2xl shadow-xl border border-gray-200 p-8'>
          <div className='text-center mb-10'>
            <h2 className='text-3xl font-bold text-gray-800 mb-3'>
              Leave Management
            </h2>
            <div className='w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full'></div>
            <p className='text-gray-600 mt-4 text-lg'>
              Comprehensive leave tracking and analytics
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <SummaryCard 
              icon={<FaFileAlt />} 
              text="Leave Applied" 
              number={5} 
              color="from-blue-600 to-blue-700"
              bgAccent="bg-blue-50"
              borderAccent="border-blue-200"
              compact={true}
            />
            <SummaryCard 
              icon={<FaCheckCircle />} 
              text="Leave Approved" 
              number={2} 
              color="from-green-600 to-green-700"
              bgAccent="bg-green-50"
              borderAccent="border-green-200"
              compact={true}
            />
            <SummaryCard 
              icon={<FaHourglassHalf />} 
              text="Leave Pending" 
              number={5} 
              color="from-yellow-600 to-yellow-700"
              bgAccent="bg-yellow-50"
              borderAccent="border-yellow-200"
              compact={true}
            />
            <SummaryCard 
              icon={<FaTimesCircle />} 
              text="Leave Rejected" 
              number={1} 
              color="from-red-600 to-red-700"
              bgAccent="bg-red-50"
              borderAccent="border-red-200"
              compact={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;