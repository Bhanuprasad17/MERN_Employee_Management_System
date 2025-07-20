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


const getSalary = async(req,res) =>{
    try {
        const {id} = req.params;
        console.log("Fetching salary for employee ID:", id);
        
        // Populate both employeeId and userId.name for employee details
        const salary = await Salary.find({employeeId : id})
            .populate({
                path: 'employeeId',
                select: 'employeeId userId department',
                populate: {
                    path: 'userId',
                    select: 'name'
                }
            })
            .sort({ payDate: -1 }); // Sort by most recent first

        console.log("Found salary records:", salary);

        return res.status(200).json({
            success : true,
            salary
        })
        
    } catch (error) {
        console.error("Salary fetch error:", error);
        return res.status(500).json({
            success: false,
            error : "salary get server error"
        })  
    }
}

export {addSalary, getSalary}