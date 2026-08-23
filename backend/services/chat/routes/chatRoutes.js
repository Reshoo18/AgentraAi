import express from "express"
import { createConversation, deleteConversation, getConversations, getMessage, saveMessage, updateConversation } from "../controllers/chatControllers.js"

const router=express.Router()


router.get("/create-conversation",createConversation)
router.get("/get-conversation",getConversations)
router.post("/update-conversation",updateConversation)
router.post("/save-message",saveMessage)
router.get("/get-messages/:conversationId",getMessage)
router.delete("/del-conversation/:conversationId",deleteConversation)

export default router
