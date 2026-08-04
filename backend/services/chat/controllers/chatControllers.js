import Conversation from "../models/conversationModel.js"
import Message from "../models/messageModel.js"

export const createConversation =async (req,res)=>{
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

export const getConversations =async (req,res)=>{
    try {
       const userID= req.headers["x-user-id"]

       const conversations= await Conversation.find(
       {
        
         userID:userID


       }
       ).sort({updatedAt:-1})
       return res.status(200).json(conversations)
    } catch (error) {
       return res.status(500).json({message:`get conversations ${error}`})
    }
}


export const saveMessage=async (req,res)=>{
   try {
     const {conversationId,role,content}=req.body
    const message= await Message.create({
        conversationId,
        role,
        content
    }
    )
    return res.status(200).json(message)
    
   } catch (error) {
      return res.status(500).json({message:` save message error ${error}`})
   }
}

export const getMessage = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({
      message: `get message error ${error}`,
    });
  }
};
export const updateConversation =async ()=>{
    try {
       const {id,title}=req.params

       const conversation= await Conversation.update(id,{title})
       return res.status(200).json(conversation)
    } catch (error) {
       return res.status(500).json({message:`update conversation ${error}`})
    }
}




