import Conversation from "../models/conversationModel.js"

export const createConversation =async ()=>{
    try {
       const userID= req.headers["x-user-id"]

       const conversation= await Conversation.create(
       {
        
         userID:userID


       }
       )
       return res.status(200).json(conversation)
    } catch (error) {
       return res.status(500).json({message:`create conversation  ${error}`})
    }
}

export const getConversation =async ()=>{
    try {
       const userID= req.headers["x-user-id"]

       const conversation= await Conversation.find(
       {
        
         userID:userID


       }
       ).sort({updatedAt:-1})
       return res.status(200).json(conversation)
    } catch (error) {
       return res.status(500).json({message:`get conversation ${error}`})
    }
}