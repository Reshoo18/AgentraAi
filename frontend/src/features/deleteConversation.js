import api from "../utils/axios"


export const deleteConversation=async(conversationId)=>{
    try {
        const {data}=await api.delete(`/api/chat/del-conversation/${conversationId}`)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}