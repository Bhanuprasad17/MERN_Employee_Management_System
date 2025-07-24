import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/auth.js'
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import salaryRouter from './routes/salary.js'
import leaveRouter from './routes/leave.js'
import settingRouter from './routes/setting.js'
import connectToDatabase from './db/db.js'
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config()
connectToDatabase()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(cors())
app.use(express.json())
app.get('/gettings',(req,res)=>
{
    console.log('hello iam ssk');
    res.send('send by ssk')
})

// app.use(express.static('public/uploads'))
// app.use('/uploads', express.static('uploads'))
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/auth',authRouter)
app.use('/api/department',departmentRouter)
app.use('/api/employee',employeeRouter)
app.use('/api/salary', salaryRouter)
app.use('/api/leave',leaveRouter)
app.use('/api/setting',settingRouter)


app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})

