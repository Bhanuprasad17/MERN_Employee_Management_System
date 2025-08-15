// AddDepartment.jsx
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddDepartment = () => {
    const [department, setDepartment] = useState({
        dep_name: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartment({ ...department, [name]: value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://mern-employee-management-system-3.onrender.com/api/department/add', department, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                navigate('/admin-dashboard/departments');
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">
                        Add New Department
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-600 mx-auto rounded-full"></div>
                    <p className="text-gray-600 mt-4 text-lg">
                        Create a new department for your organization
                    </p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Department Information</h2>
                                <p className="text-teal-100 text-sm">Fill in the details below</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-8">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="dep_name"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Department Name
                                </label>
                                <input
                                    id="dep_name"
                                    name="dep_name"
                                    type="text"
                                    placeholder="Enter Department Name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                             focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                                             transition-all duration-200 bg-gray-50 hover:bg-white"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={5}
                                    placeholder="Enter department description..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                             resize-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                                             transition-all duration-200 bg-gray-50 hover:bg-white"
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin-dashboard/departments')}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold 
                                             hover:bg-gray-200 transition-all duration-200 
                                             border border-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold 
                                             hover:bg-teal-700 transform hover:scale-105 transition-all duration-200 
                                             shadow-lg hover:shadow-xl"
                                >
                                    Add Department
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDepartment;