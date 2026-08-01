import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({

 title:{
    type:STrring,
    default:"New chat"
 },
 userID:{
    type:String,
 }

},{timestamps:true})


const Conversation=new mongoose.model("Conversation",conversationSchema)

export default Conversation