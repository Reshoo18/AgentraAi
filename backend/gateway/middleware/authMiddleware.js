import redis from "../../shared/redis/redis.js"

const protect = async (req,res,next)=>{

    try {
        const sessionId=req.cookies?.session
        if(!sessionId){
            return res.status(400).json({message:"session not find"})
        }
        const session = await redis.get(`sessionId ${sessionId}`)
        if(!session){
             return res.status(400).json({message:"session expired"})

        }
        req.user=JSON.parse(session)
        next()
        
    } catch (error) {
         return res.status(400).json({message:`protected error ${error}`})
        
    }
}

export default protect