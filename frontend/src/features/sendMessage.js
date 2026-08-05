import api from "../utils/axios"



const sendMsg=async(payload)=>{
    try {
        const {data}=await api.post("/api/agent/chat",payload)
        return data
    } catch (error) {
            console.log("Status:", error.response?.status);
    console.log("Data:", error.response?.data);
    console.log("Message:", error.message);

        console.log(error)
        return null
    }
}

export default sendMsg
  
