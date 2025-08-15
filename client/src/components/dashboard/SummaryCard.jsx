
import React from 'react';

const SummaryCard = ({ icon, text, number, color, bgAccent, borderAccent, compact = false }) => {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-xl bg-white shadow-lg border-2 ${borderAccent}
        transform transition-all duration-300 ease-out
        hover:shadow-2xl hover:-translate-y-2 hover:scale-105
        ${compact ? 'min-h-[120px]' : 'min-h-[140px]'}
      `}
    >
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${bgAccent} opacity-30`}></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent"></div>
      
      {/* Content */}
      <div className="relative z-10 p-6 flex items-center h-full">
        {/* Icon Section */}
        <div className={`
          bg-gradient-to-br ${color} 
          rounded-xl p-4 shadow-lg flex items-center justify-center
          transform transition-transform duration-300 group-hover:scale-110
          ${compact ? 'w-14 h-14' : 'w-16 h-16'}
        `}>
          <div className={`text-white ${compact ? 'text-xl' : 'text-2xl'}`}>
            {icon}
          </div>
        </div>
        
        {/* Text Section */}
        <div className="ml-6 flex-1">
          <p className={`
            text-gray-600 font-semibold tracking-wide uppercase
            ${compact ? 'text-xs' : 'text-sm'}
          `}>
            {text}
          </p>
          <p className={`
            text-gray-800 font-bold leading-none mt-2
            ${compact ? 'text-2xl' : 'text-3xl'}
          `}>
            {number}
          </p>
        </div>
      </div>
      
      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-300 rounded-xl transition-colors duration-300"></div>
      
      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-2xl"></div>
    </div>
  );
};

export default SummaryCard;
