import { getModel } from "../config/llmModel.js"
import { agent } from "../controllers/agent.controller.js"

export const router=async(state)=>{
    
    if(agent.state && agent.state!=="auto"){
      return {
    ...state,
    agent:state.agent
  
}
    }

    const llm=getModel("router")
    const prompt=`You are an agent router.

Available agents:

- chat
- search
- coding
- pdf
- ppt
- vision

Rules:

chat:
General conversation,
explanations,
learning,
questions.

search:
Current events,
latest information,
news,
recent developments,
internet lookup.

coding:
Generate code,
debug code,
build projects,
architecture,
API design.

pdf:
Questions about generate PDFs
or document context.

ppt:
Questions about generate ppts
or ppt context.

vision:
Generate image,
Create image

Return ONLY one word:

chat
search
coding
pdf
vision

User Query: 
 ${state.prompt}`

const response=await llm.invoke(prompt)

return {
    ...state,
    agent:response.content
    .trim()
    .toLowerCase()
}

}