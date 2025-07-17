import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EditDepartment = () => {
    const {id} = useParams()

    const [department, setDepartment] = useState([])
    const [dep_loading,setDep_loading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
    const fetchDepartments = async () => {
      setDep_loading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/department/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
            setDepartment(response.data.department)
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

  const handleChange = (e) =>{
        const {name,value} = e.target
        setDepartment({...department,[name]:value})
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3000/api/department/${id}`,department,{
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
    <>{dep_loading ? <div>Loading...</div> : <div>
          <section className="flex items-center justify-center w-full h-full">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Edit Department
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
              value={department.dep_name}
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
              value={department.description}
              className="mt-1 w-full px-4 py-2 border rounded-md resize-none focus:ring-2 focus:ring-teal-500 focus:outline-none"
              onChange={handleChange}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition"
          >
            Edit Department
          </button>
        </form>
      </div>
    </section>
    </div>}</>
  )
}

export default EditDepartment