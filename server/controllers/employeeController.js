import multer from "multer";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import Employee from "../models/Employee.js";
import path from "path";
import Department from "../models/Department.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      role,
    } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        error: "User Already registered in emp",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      profileImage: req.file ? req.file.filename : "",
    });

    const savedUser = await newUser.save();

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    });

    await newEmployee.save();

    return res.status(200).json({
      success: true,
      message: "employee created",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "server error in adding employee",
    });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", { password: 0 })
      .populate("department");

    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Get employees Server Error",
    });
  }
};

const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById({ _id: id })
      .populate("userId", { password: 0 })
      .populate("department");
    console.log(employee);
    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Get Employee Server Error",
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, maritalStatus, designation, department, salary } = req.body;

    // Step 1: Check if employee exists
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    // Step 2: Update the User (name and image if updated)
    const userUpdateData = { name };
    if (req.file) {
      userUpdateData.profileImage = req.file.filename;
    }

    await User.findByIdAndUpdate(employee.userId, userUpdateData);

    // Step 3: Update Employee data
    await Employee.findByIdAndUpdate(id, {
      maritalStatus,
      designation,
      salary,
      department,
    });

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
    });

  } catch (error) {
    console.error("Update employee error:", error);
    return res.status(500).json({
      success: false,
      error: "Update employee server error",
    });
  }
};


export { addEmployee, upload, getEmployees, getEmployee, updateEmployee };
