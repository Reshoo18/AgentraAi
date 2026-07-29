const getCurrentUser=async(req,res)=>{

    try {

        return res.status(200).json(req.body)
        
    } catch (error) {
        return res.status(500).json({message:`something went wrong ${error}`})
    }
}

export default getCurrentUser