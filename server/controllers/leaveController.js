import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;
    console.log(userId, leaveType, startDate, endDate, reason);

    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
    });

    await newLeave.save();

    return res.status(200).json({
      success: true,
      data: newLeave,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "leave add server error",
    });
  }
};

const getLeave = async (req, res) => {
  try {
    const { userId, status, leaveType } = req.query;

    // Build filter object
    let filter = {};

    // If userId is provided, filter by specific employee
    if (userId) {
      const employee = await Employee.findOne({ userId });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      filter.employeeId = employee._id;
    }

    // Add status filter if provided
    if (status) {
      filter.status = status;
    }

    // Add leave type filter if provided
    if (leaveType) {
      filter.leaveType = leaveType;
    }

    // Get leaves with employee details populated
    const leaves = await Leave.find(filter)
      .populate({
        path: "employeeId",
        select: "name email department position userId", // Select specific fields
      })
      .sort({ appliedAt: -1 }); // Sort by most recent first

    return res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch leaves",
    });
  }
};

const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: "employeeId",
      populate: [
        {
          path: "department",
          select: "dep_name",
        },
        {
          path: "userId",
          select: "name",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      leaves: leaves, // Changed from 'data' to 'leaves' for consistency
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch leaves",
    });
  }
};

const getLeaveDetail = async (req, res) => {
    try {
         const {id} = req.params;
         console.log(id)
    const leave = await Leave.findById({_id:id}).populate({
      path: "employeeId",
      populate: [
        {
          path: "department",
          select: "dep_name",
        },
        {
          path: "userId",
          select: "name , profileImage",
        },
      ],
    });

    console.log(leave)

    return res.status(200).json({
      success: true,
      leaves: leave, // Changed from 'data' to 'leaves' for consistency
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch leaves",
    });
  }
};


const rejectLeave = async (req, res) => {
    // console.log('hi')
    try {
        const { id } = req.params;
        // console.log(id)
    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    // Update status to Rejected
    leave.status = "Rejected";
    leave.updatedAt = new Date();

    await leave.save();

    return res.status(200).json({
      success: true,
      message: "Leave rejected successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Reject Leave Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while rejecting leave",
    });
  }
};


const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    // Update status to Approved
    leave.status = "Approved";
    leave.updatedAt = new Date();

    await leave.save();

    return res.status(200).json({
      success: true,
      message: "Leave approved successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Approve Leave Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while approving leave",
    });
  }
};


export { addLeave, getLeave, getLeaves, getLeaveDetail, rejectLeave, approveLeave };
