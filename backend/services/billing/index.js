import express from "express"
import connectDb from "./config/db.js" 
import dotenv from "dotenv"
import router from "./routes/billing.route.js"
const app=express()
dotenv.config()


const PORT= process.env.PORT || 5004
app.use(express.json());
app.use('/',router)

app.get("/",(req,res)=>{
    res.send("hello i am billing server")
})

app.listen(PORT,()=>{
    connectDb()
    console.log(`server at listening at this post :${PORT}`)
})