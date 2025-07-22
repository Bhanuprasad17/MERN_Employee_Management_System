import Employee from "../models/Employee.js"
import Salary from "../models/Salary.js"


const addSalary = async(req, res) =>{
    try {
        const {employeeId, basicSalary, allowances, deductions, payDate, netSalary } = req.body
        // console.log(employeeId, basicSalary, allowances, deductions, payDate,netSalary)

        const newSalary = new Salary({
            employeeId,
            basicSalary,
            allowances,
            deductions,
            netSalary,
            payDate
        })

        await newSalary.save()

        return res.status(200).json({
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error : "salary add server error"
        })  
    }

}


const getSalary = async(req, res) => {
    try {
        const { id } = req.params;
        console.log("Fetching salary for employee ID:", id);
        
        let salary = [];
        let employeeRecord = null;

        // First, try to find salary records by employeeId (ObjectId)
        salary = await Salary.find({ employeeId: id })
            .populate({
                path: 'employeeId',
                select: 'employeeId userId department',
                populate: {
                    path: 'userId',
                    select: 'name'
                }
            })
            .sort({ payDate: -1 }); // Sort by most recent first

        console.log("Direct salary search result:", salary);

        // If no records found by employeeId, try to find employee by userId and then get salary
        if (!salary || salary.length === 0) {
            console.log("No direct salary records found, trying userId lookup...");
            
            // Find employee record by userId
            employeeRecord = await Employee.findOne({ userId: id });
            console.log("Employee record found:", employeeRecord);
            
            if (employeeRecord) {
                // Now search for salary records using the employee's ObjectId
                salary = await Salary.find({ employeeId: employeeRecord._id })
                    .populate({
                        path: 'employeeId',
                        select: 'employeeId userId department',
                        populate: {
                            path: 'userId',
                            select: 'name'
                        }
                    })
                    .sort({ payDate: -1 });
                
                console.log("Salary records found via employee lookup:", salary);
            }
        }

        // Ensure salary is always an array
        if (!salary) {
            salary = [];
        } else if (!Array.isArray(salary)) {
            salary = [salary];
        }

        console.log("Final salary records to return:", salary);

        return res.status(200).json({
            success: true,
            salary: salary // Always return as array
        });

    } catch (error) {
        console.error("Salary fetch error:", error);
        return res.status(500).json({
            success: false,
            error: "salary get server error",
            message: error.message
        });  
    }
}

export {addSalary, getSalary}