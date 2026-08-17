import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"
import getCurrentUser from "./controllers/user.controller.js"
import protect from "./middleware/authMiddleware.js"
import cookieParser from "cookie-parser"
import proxyWithHeader from "./utils/proxyWithHeader.js"
import morgan from "morgan"
dotenv.config()

const app=express()
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"))

const PORT=process.env.PORT || 5000


app.use("/api/auth",proxy(process.env.AUTH_SERVICE))
app.use("/api/chat",protect,proxyWithHeader(process.env.CHAT_SERVICE))
app.use("/api/agent",protect,proxy(process.env.AGENT_SERVICE))
app.use("/api/billing",protect,proxyWithHeader(process.env.BILLING_SERVICE))
app.get("/api/me",protect,getCurrentUser)

app.get('/',(req,res)=>{
    
    res.status(200).send("hello i am server")
})

app.listen(PORT,()=>{
    console.log(`server at listening at this port :${PORT}`)
})