import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
dotenv.config()

const app=express()



const PORT=process.env.PORT || 5000

app.use("/auth",proxy(process.env.AUTH_SERVICE))

app.get('/',(req,res)=>{
    
    res.status(200).send("hello i am server")
})

app.listen(PORT,()=>{
    console.log(`server at listening at this port :${PORT}`)
})