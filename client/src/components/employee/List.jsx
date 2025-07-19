import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { columns, EmployeeButtons } from '../../utils/EmployeeHelper';
import DataTable from 'react-data-table-component'

const List = () => {

  const [employees, setEmployees] = useState([])
  const [emp_Loading, setEmp_loading] = useState(false);

   useEffect(() => {
    const fetchEmployees = async () => {
      setEmp_loading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/employee",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          let sno = 1;
          const data = await response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            dep_name: emp.department.dep_name,
            name : emp.userId.name,
            dob : new Date(emp.dob).toDateString(),
            profileImage :<img src={`http://localhost:5000/${emp.userId.profileImage}`} />,
            action: (<EmployeeButtons Id = {emp._id}/>)
          }));
          setEmployees(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setEmp_loading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className='p-6'>
        <div className="text-center">
              <h3 className="text-2xl font-bold">Manage Employees</h3>
            </div>
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="search by Department"
                className="px-5 py-0.5 border"
                // onChange={filterDepartments}
              />
              <Link
                to="/admin-dashboard/add-employee"
                className="px-4 py-1 bg-teal-600 rounded text-white"
              >
                Add New Employee
              </Link>
              <div>
                <DataTable columns={columns} data={employees}/>
              </div>
            </div>
    </div>
  )
}

export default List