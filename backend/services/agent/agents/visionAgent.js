import { getModel } from "../config/llmModel"

export const visionAgent=async(state)=>{
    const llm=await getModel("image")
}