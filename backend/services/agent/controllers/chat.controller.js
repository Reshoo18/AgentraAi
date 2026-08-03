import axios from "axios";
import { graph } from "../graph/graphs.js";

export const agent=async(req,res)=>{
    try {
        const {prompt,conversationId}=req.body
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
            conversationId,role:"user",content:prompt

        })

        const result=await graph.invoke({
            prompt,
        })
    const response =result.aiResponse
    return res.status(200).json(response)
        
    } catch (error) {
  console.error("AGENT ERROR:", error);

  return res.status(500).json({
    message: error.message,
    stack: error.stack,
  });
}
}

