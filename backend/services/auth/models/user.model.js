import mongoose, { Schema } from "mongoose";

const userSchema= new  mongoose.Schema(
   
    {
        fireBaseUid:{
          type:String,
          unique
        },
    name:String,
    email:String,
    avatar:String
}


,{timestamps:true})


const User=mongoose.model("User",userSchema)
export default User