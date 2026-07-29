import {getAuth} from "firebase-admin/auth"
import {app} from "../config/firebase.js"
import User from "../models/user.model.js"
import crypto from "node:crypto";
import redis from "../../../shared/redis/redis.js";
export const login = async (req,res)=>{
    try {
        const {token}=req.body
      const decoded= await getAuth(app).verifyIdToken(token)
      let user= await User.findOne({
        fireBaseUid:decoded.uid
      })
       
      if(!user){
       user=await  User.create({
            fireBaseUid:decoded.uid,
            name:decoded.name,
            email:decoded.email,
            avatar:decoded.picture
        })
      }

      const sessionId=crypto.randomUUID()
      await redis.set(`session -${sessionId}`,JSON.stringify({
          userID:user._id,
          name:user.name,
          email:user.email,
          avatar:user.avatar
      }),"EX",7*24*60*60)

      res.cookie("session",sessionId,{
        httpOnly:true,
        secure:false,
        sameSite:"strict",
        maxAge:7*24*60*60*1000
      })
      return res.status(200).json(user)

    }

  catch (error) {
  console.error("LOGIN ERROR:", error);

  return res.status(500).json({
    message: error.message,
    stack: error.stack,
  });
}
}

export const logOut=async (req,res)=>{
    try {
        const sessionId=req.cookies?.session
        await redis.del(`session -${sessionId}`)

        res.clearCookie("session")
         res.status(200).json({message:"USer logged out "})

    } catch (error) {
        res.status(500).json({message:error})
    }
}