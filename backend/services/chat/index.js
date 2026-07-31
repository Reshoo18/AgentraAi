import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"

dotenv.config()

const app=express()

const PORT=process.env.PORT||5002

app.get("/",(req,res)=>{
    res.send("hello i am chat server")
})

app.listen(PORT,()=>{
    connectDb()
    console.log(`Server are listening at this port ${PORT}`)
})