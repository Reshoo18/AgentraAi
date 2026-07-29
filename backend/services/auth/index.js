import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/authRoute.js"
import cookieParser from "cookie-parser"
dotenv.config()


const app=express()
app.use(express.json())
app.use(cookieParser());
app.use('/',router)
const PORT=process.env.PORT || 5001

app.get('/',(req,res)=>{
    
    res.status(200).send("hello i am auth server")
})

app.listen(PORT,()=>{
    connectDb()
    console.log(`server at listening at this port :${PORT}`)
})