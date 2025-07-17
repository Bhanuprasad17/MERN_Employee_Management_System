import React from "react";
import { data, Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelper";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [dep_loading, setDep_loading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([])

  const onDepartmentDelete = async(id) =>{
    const data =  departments.filter(dep => dep._id != id)
    setDepartments(data)
  }

  useEffect(() => {
    const fetchDepartments = async () => {
      setDep_loading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/department",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          let sno = 1;
          const data = await response.data.departments.map((dep) => ({
            _id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            action: <DepartmentButtons Id = {dep._id} onDepartmentDelete = {onDepartmentDelete}/>,
          }));
          setDepartments(data);
          setFilteredDepartments(data);
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


const filterDepartments = (e) => {
  const keyword = e.target.value.toLowerCase();
  const records = departments.filter((dep) =>
    dep.dep_name.toLowerCase().includes(keyword)
  );
  setFilteredDepartments(records);
};

  return (
    <>
      {dep_loading ? (
        <>Loading...</>
      ) : (
        <>
          <div className="p-5">
            <div className="text-center">
              <h3 className="text-2xl font-bold">Manage Departments</h3>
            </div>
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="search by Department"
                className="px-5 py-0.5 border"
                onChange={filterDepartments}
              />
              <Link
                to="/admin-dashboard/add-department"
                className="px-4 py-1 bg-teal-600 rounded text-white"
              >
                Add New Department
              </Link>
            </div>
            <div className="mt-5">
              {/* <DataTable columns={columns} data={departments} /> */}
              <DataTable columns={columns} data={filteredDepartments} pagination/>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DepartmentList;
