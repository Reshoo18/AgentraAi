

const agent=async(req,res)=>{
    try {
        const {prompt,conversationId}
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
            conversationId,role:"user",content:prompt

        })

        const result=await graph.invoke({
            prompt,
        })
    const response =result.aiResponse
    return res.status(200).json(response)
        
    } catch (error) {
        return res.status(500).json({message:`agent error ${agent}`})
    }
}