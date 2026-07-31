import redis from "../../shared/redis/redis.js"

// const protect = async (req,res,next)=>{

//     try {
//         const sessionId=req.cookies?.session
//         if(!sessionId){
//             return res.status(400).json({message:"session not find"})
//         }
//         const session = await redis.get(`session:${sessionId}`)
//         if(!session){
//              return res.status(400).json({message:"session expired"})

//         }
//         req.user=JSON.parse(session)
//         next()
        
//     } catch (error) {
//          return res.status(400).json({message:`protected error ${error}`})
        
//     }
// }

const protect = async (req, res, next) => {
  try {
    console.log("Headers Cookie:", req.headers.cookie);
    console.log("Parsed Cookies:", req.cookies);

    const sessionId = req.cookies?.session;

    console.log("Session ID:", sessionId);

    if (!sessionId) {
      return res.status(400).json({ message: "session not found" });
    }

    const session = await redis.get(`session:${sessionId}`);

    console.log("Redis Session:", session);

    if (!session) {
      return res.status(400).json({ message: "session expired" });
    }

    req.user = JSON.parse(session);

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export default protect;

