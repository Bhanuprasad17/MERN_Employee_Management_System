import express from 'express'
import { login, verifyMethod } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'


const router = express.Router()


router.post('/login',login)
router.post('/verify',authMiddleware, verifyMethod)


export default router