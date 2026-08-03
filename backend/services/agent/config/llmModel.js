// import { ChatGroq } from "@langchain/groq"
// import { ChatGoogleGenerativeAI} from "@langchain/google-genai"

// const groq = new ChatGroq({
  
//     model: "openai/gpt-oss-120b",
  
    
// })

// const google=new ChatGoogleGenerativeAI({
  
//      model: "openai/gpt-oss-120b",
// })





// export const getModel=async(agent)=>{
//     switch (agent) {
//         case "chat":
            
//             return groq
    
//         case "search":
//             return groq
        
//         case "coding":
//             return google
        
//         default :
//           return groq
//     }
// }

import dotenv from "dotenv";

 dotenv.config();



import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
});

const google = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
});

export const getModel = (agent) => {
  switch (agent) {
    case "chat":
    case "search":
      return groq;

    case "coding":
      return google;

    default:
      return groq;
  }
};