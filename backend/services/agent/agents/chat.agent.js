import { getModel } from "../config/llmModel.js"

export const chatAgent=async(state)=>{
    const llm=getModel("chat")
    const systemPrompt="you are AgentraAI , an inteligent AI Assistant"

    const response=await llm.invoke([
        {
            "role":"system",
            "content":systemPrompt
        },
        {
            "role":"user",
            "content":state.prompt
        }
    ])

    return {
        ...state,
        aiResponse:response.content
    }
}