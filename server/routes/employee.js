import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addEmployee,upload, getEmployees} from '../controllers/employeeController.js'

const router = express.Router()

router.get('/',authMiddleware, getEmployees)
router.post('/add',authMiddleware, upload.single('image'), addEmployee)
// router.get('/:id',authMiddleware,getDepartment)
// router.put('/:id',authMiddleware,updateDepartment)
// router.delete('/:id',authMiddleware,deleteDepartment)


export default router