import Department from "../models/Department.js"



const getDepartments = async (req,res) =>{
    try {
        const departments  = await Department.find()

        return res.status(200).json({
            success : true,
            departments 
        })
    } catch (error) {
         return res.status(500).json({
            success : false,
            error : 'Get Department Server Error'
        })   
    }
}

const addDepartment = async(req,res) =>{
    try {
        const {dep_name,description} = req.body
        const newDepartment = new Department({
            dep_name,
            description
        })
        await newDepartment.save()

        return res.status(200).json({
            success : true,
            department : newDepartment
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            error : 'Add Department Server Error'
        })   
    }
}




export {addDepartment, getDepartments}