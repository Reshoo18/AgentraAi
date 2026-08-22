import express from "express"
import dotenv from "dotenv"
 dotenv.config({ path: "./.env" });


import connectDb from "./config/db.js"
import router from "./routes/agent.route.js"


const app=express()


const PORT=process.env.PORT || 5003

app.use(express.json())
app.use("/",router)

app.use((err,req,res,next)=>{
  console.log(err)
  if(err.status){
    return res.status(err.status).json(err.data)
  }

  return res.status(500).json({message:`agent error ${error}`})
})

app.get("/",(req,res)=>{
    res.send("hello i m agent server")
})


app.listen(PORT,()=>{
    connectDb()
    console.log(`Server are listening at this port ${PORT}`)
})