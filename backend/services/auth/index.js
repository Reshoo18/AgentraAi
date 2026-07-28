import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
dotenv.config()


const app=express()

const PORT=process.env.PORT || 5001

app.get('/',(req,res)=>{
    
    res.status(200).send("hello i am auth server")
})

app.listen(PORT,()=>{
    connectDb()
    console.log(`server at listening at this port :${PORT}`)
})