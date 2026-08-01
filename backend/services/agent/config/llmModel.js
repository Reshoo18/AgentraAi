import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAi} from "@langchain/google-genai"

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
  
    
})

const google=new ChatGoogleGenerativeAI({
     model: "openai/gpt-oss-120b",
})





export const getModel=async(agent)=>{
    switch (agent) {
        case "chat":
            
            return groq
    
        case "search":
            return groq
        
        case "coding":
            return google
        
        default :
          return groq
    }
}