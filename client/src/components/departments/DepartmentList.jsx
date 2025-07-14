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
            action: <DepartmentButtons _id = {dep._id}/>,
          }));
          setDepartments(data);
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
              />
              <Link
                to="/admin-dashboard/add-department"
                className="px-4 py-1 bg-teal-600 rounded text-white"
              >
                Add New Department
              </Link>
            </div>
            <div className="mt-5">
              <DataTable columns={columns} data={departments} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DepartmentList;
