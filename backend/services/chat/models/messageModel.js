import mongoose, { model } from "mongoose";


const messageSchema=new mongoose.Schema({
   conversationId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Conversation"

   },
   rple:{
    type:String,
   enum:["user","assistant"]
   },
   content:String


},{timestamps:true})

const Message= new mongoose.model("Message",messageSchema)

export default Message