
import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditDepartment = () => {
    const { id } = useParams();
    const [department, setDepartment] = useState([]);
    const [dep_loading, setDep_loading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartments = async () => {
            setDep_loading(true);
            try {
                const response = await axios.get(
                    `https://mern-employee-management-system-3.onrender.com/api/department/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                if (response.data.success) {
                    setDepartment(response.data.department);
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    alert(error.response.data.error);
                }
            } finally {
                setDep_loading(false);
            }
        };
        fetchDepartments();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartment({ ...department, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://mern-employee-management-system-3.onrender.com/api/department/${id}`, department, {
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
        <>
            {dep_loading ? (
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-lg text-gray-600 font-medium">Loading department...</p>
                    </div>
                </div>
            ) : (
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
                    <div className="w-full max-w-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-800 mb-3">
                                Edit Department
                            </h1>
                            <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-600 mx-auto rounded-full"></div>
                            <p className="text-gray-600 mt-4 text-lg">
                                Update department information
                            </p>
                        </div>

                        {/* Main Form Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Department Information</h2>
                                        <p className="text-teal-100 text-sm">Update the details below</p>
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
                                            value={department.dep_name || ''}
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
                                            value={department.description || ''}
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
                                            Update Department
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditDepartment;
