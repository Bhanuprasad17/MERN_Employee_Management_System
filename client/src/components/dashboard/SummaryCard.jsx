// src/components/SummaryCard.jsx
import React from 'react';

const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <div
      className='rounded flex bg-white shadow-md min-h-[80px] p-2 
                 transform transition duration-300 ease-in-out 
                 hover:scale-105 animate-fade-in'
    >
      <div className={`${color} text-3xl flex justify-center items-center text-white px-4`}>
        {icon}
      </div>
      <div className='pl-4 py-1'>
        <p className='text-lg font-semibold'>{text}</p>
        <p className='text-xl font-bold'>{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
