import { searchTool } from "../config/tavily.js"
import { deductCredits } from "../utils.js/deductInterviews.js"

export const searchAgent=async(state)=>{
     try {
        const results= await searchTool.invoke({
            query:state.prompt
        })
        await deductCredits(state.userId,"search")
        console.log(results)
        return {
            ...state,
            searchResults:results,
            images:results.images
        }
     } catch (error) {
        console.log(error)
    return {
         ...state,
            searchResults:[],
            images:[]
    }
     }
}