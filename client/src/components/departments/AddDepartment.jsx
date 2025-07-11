import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddDepartment = () => {

    const [department, setDepartment ] = useState({
        dep_name : '',
        description : ''
    })

    const handleChange = (e) =>{
        const {name,value} = e.target
        setDepartment({...department,[name]:value})
    }

    const navigate = useNavigate()

    const handleSubmit = async(e) =>{
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:3000/api/department/add',department,{
                headers : {
                    "Authorization" : `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(response.data.success){
                navigate('/admin-dashboard/departments')
            }
        } catch (error) {
            if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            }
        }
    }

  return (
    /* CENTER the whole card */
    <section className="flex items-center justify-center w-full h-full">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Add Department
        </h3>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="dep_name"
              className="block text-sm font-medium text-gray-600"
            >
              Department Name
            </label>
            <input
              id="dep_name"
              name = 'dep_name'
              type="text"
              placeholder="Enter Department Name"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-600"
            >
              Description
            </label>
            <textarea
              id="description"
              name = 'description'
              rows={4}
              placeholder="Description"
              className="mt-1 w-full px-4 py-2 border rounded-md resize-none focus:ring-2 focus:ring-teal-500 focus:outline-none"
              onChange={handleChange}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition"
          >
            Add Department
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddDepartment;
