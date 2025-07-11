import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/auth.js'
import departmentRouter from './routes/department.js'
import mongoose from 'mongoose'
import connectToDatabase from './db/db.js'


connectToDatabase()

const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())


app.use('/api/auth',authRouter)
app.use('/api/department',departmentRouter)


app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})

