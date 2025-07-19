import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/auth.js'
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import connectToDatabase from './db/db.js'


connectToDatabase()

const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())

// app.use(express.static('public/uploads'))
app.use('/uploads', express.static('uploads'))
app.use('/api/auth',authRouter)
app.use('/api/department',departmentRouter)
app.use('/api/employee',employeeRouter)


app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})

