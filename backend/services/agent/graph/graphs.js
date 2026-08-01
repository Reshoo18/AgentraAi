import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent";
import { searchAgent } from "../agents/search.agent";
import { codingAgent } from "../agents/coding.agent";
import { pdfAgent } from "../agents/pdf.agent";
import { pptAgent } from "../agents/ppt.agent";

import { visionAgent } from "../agents/visionAgent.js";


const workFlow=new StateGraph(agentState)

workFlow.addNode("router",router)
workFlow.addNode("chat",chatAgent)
workFlow.addNode("search",searchAgent)
workFlow.addNode("coding",codingAgent)
workFlow.addNode("pdf",pdfAgent)
workFlow.addNode("ppt",pptAgent)
workFlow.addNode("vision",visionAgent)

workFlow.addEdge("__start__","router")
workFlow.addConditionalEdges("router",(state)=>{
    switch (state.agent) {
        case "chat":
            return "chat";
        
        case "search":
            return "search";
        case "coding":
            return "coding";
        case "pdf":
            return "pdf";
        case "ppt":
            return "ppt";
        
        case "vision":
            return "vision";



        default:
           return "chat"
    }
},{
    chat:"chat",
    search:"search",
    coding:"coding",
    pdf:"pdf",
    ppt:"ppt",
    vision:"vision"
})

workFlow.addEdge("search","chat")
workFlow.addEdge("chat","__end__")
workFlow.addEdge("coding","__end__")
workFlow.addEdge("pdf","__end__")
workFlow.addEdge("ppt","__end__")
workFlow.addEdge("vision","__end__")

const graph=workFlow.compile()