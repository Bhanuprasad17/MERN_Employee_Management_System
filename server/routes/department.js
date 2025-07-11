import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addDepartment, getDepartments } from '../controllers/departmentController.js'

const router = express.Router()

router.get('/',authMiddleware, getDepartments)
router.post('/add',authMiddleware, addDepartment)


export default router