import {BrowserRouter,Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import PrivateRoutes from './utils/PrivateRoutes'
import RoleBasedRoutes from './utils/RoleBasedRoutes'
import AdminSummary from './components/dashboard/AdminSummary'
import DepartmentList from './components/departments/DepartmentList'
import AddDepartment from './components/departments/AddDepartment'
import EditDepartment from './components/departments/EditDepartment'
import List from './components/employee/List'
import Add from './components/employee/Add'
import View from './components/employee/View'
import Edit from './components/employee/Edit'
import AddSalary from './components/salary/Add'
import ViewSalary from './components/salary/View'
import Summary from './components/employeeDashboard/Summary'
import Profile from './components/employeeDashboard/Profile'
import LeaveList from './components/leave/List'
import AddLeave from './components/leave/AddLeave'
import Setting from './components/employeeDashboard/Setting'
import Table from './components/leave/Table'
import Detail from './components/leave/Detail'

function App() {

  return (
    <BrowserRouter>
       <Routes>
          <Route path='/' element = {<Navigate to='/admin-dashboard'/>}/>
          <Route path='/login' element = {<Login/>}/>
          <Route path='/admin-dashboard' element = {
            <PrivateRoutes>
              <RoleBasedRoutes requiredRole={["admin"]}>
                <AdminDashboard/>
              </RoleBasedRoutes>
            </PrivateRoutes>
            }>
              <Route index element = {<AdminSummary />}></Route>
              <Route path='/admin-dashboard/departments' element = {<DepartmentList />}></Route>
              <Route path='/admin-dashboard/add-department' element = {<AddDepartment />}></Route>
              <Route path='/admin-dashboard/department/:id' element = {<EditDepartment />}></Route>
              
              <Route path='/admin-dashboard/employees' element = {<List />}></Route>
              <Route path='/admin-dashboard/add-employee' element = {<Add />}></Route>
              <Route path='/admin-dashboard/employee/:id' element = {<View />}></Route>
              <Route path='/admin-dashboard/employees/edit/:id' element = {<Edit />}></Route>
              <Route path='/admin-dashboard/employees/salary/:id' element = {<ViewSalary />}></Route>
              <Route path='/admin-dashboard/salary/add' element = {<AddSalary />}></Route>
              <Route path='/admin-dashboard/leaves' element = {<Table />}></Route>
              <Route path='/admin-dashboard/leaves/:id' element = {<Detail />}></Route>
              <Route path='/admin-dashboard/settings' element = {<Setting />}></Route>
              {/* <Route path='/admin-dashboard/leave/:id' element = {<LeaveList />}></Route> */}
            </Route>
          <Route path='/employee-dashboard' element = {
            <PrivateRoutes >
              <RoleBasedRoutes requiredRole={["admin","employee"]}>
              <EmployeeDashboard/>
              </RoleBasedRoutes>
            </PrivateRoutes>
            }>
              <Route index element = {<Summary />}></Route>
              <Route path='/employee-dashboard/profile/:id' element = {<View />}/>
              <Route path='/employee-dashboard/leaves/:id' element = {<LeaveList />}/>
              <Route path='/employee-dashboard/add-leave' element = {<AddLeave />}/>
              <Route path='/employee-dashboard/salary/:id' element = {<ViewSalary />}/>
              <Route path='/employee-dashboard/settings' element = {<Setting />}/>
            </Route>
       </Routes>
    </BrowserRouter>
  )
}

export default App
