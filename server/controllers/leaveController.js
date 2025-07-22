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
                message: "Employee not found"
            });
        }

        const newLeave = new Leave({
            employeeId: employee._id,
            leaveType,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason
        });

        await newLeave.save();

        return res.status(200).json({
            success: true,
            data: newLeave
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "leave add server error"
        });
    }
};



const getLeaves = async (req, res) => {
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
                    message: "Employee not found"
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
                path: 'employeeId',
                select: 'name email department position userId' // Select specific fields
            })
            .sort({ appliedAt: -1 }); // Sort by most recent first
        
        return res.status(200).json({
            success: true,
            data: leaves
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch leaves"
        });
    }
};

export { addLeave, getLeaves };
