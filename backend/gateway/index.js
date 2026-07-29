import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"
import getCurrentUser from "./controllers/user.controller.js"
import protect from "./middleware/authMiddleware.js"
dotenv.config()

const app=express()
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))


const PORT=process.env.PORT || 5000

app.use("/api/auth",proxy(process.env.AUTH_SERVICE))
app.get("/api/me",protect,getCurrentUser)

app.get('/',(req,res)=>{
    
    res.status(200).send("hello i am server")
})

app.listen(PORT,()=>{
    console.log(`server at listening at this port :${PORT}`)
})