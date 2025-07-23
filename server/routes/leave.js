

import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addLeave,getLeave,getLeaveDetail,getLeaves, approveLeave, rejectLeave } from '../controllers/leaveController.js'

const router = express.Router()

router.post('/add',authMiddleware, addLeave)
router.get('/:id',authMiddleware, getLeave)
router.get('/detail/:id',authMiddleware,getLeaveDetail)
router.get('/',authMiddleware,getLeaves)
router.put('/:id/reject',authMiddleware,rejectLeave)
router.put('/:id/approve',authMiddleware,approveLeave)



export default router