import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/change-password',authMiddleware, addSalary)



export default router