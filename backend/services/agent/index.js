import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/agent.route.js"


const app=express()
dotenv.config()

const PORT=process.env.PORT || 5003

app.use(express.json())
app.use("/",router)

app.get("/",(req,res)=>{
    res.send("hello i m agent server")
})


app.listen(PORT,()=>{
    connectDb()
    console.log(`Server are listening at this port ${PORT}`)
})