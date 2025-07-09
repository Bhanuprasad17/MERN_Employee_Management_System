import User from "./models/User.js"
import bcrypt from 'bcrypt'
import connectToDatabase from "./db/db.js"
import dotenv from 'dotenv';
dotenv.config();

const userRegister = async() =>{
    await connectToDatabase()
    console.log('connect to mongodb')

    try {
        const hashedPassword = await bcrypt.hash('admin',10)

        const newUser = new User({
            name : "admin",
            email : "admin@gmail.com",
            password : hashedPassword,
            role : "admin"
        })

        await newUser.save()

        
    } catch (error) {
        console.log(error)
    }
}

userRegister()