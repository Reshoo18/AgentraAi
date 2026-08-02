import express from "express"
import { createConversation, getConversations, getMessage, saveMessage, updateConversation } from "../controllers/chatControllers.js"

const router=express.Router()


router.get("/create-conversation",createConversation)
router.get("/get-conversation",getConversations)
router.post("/update-conversation",updateConversation)
router.post("/save-message",saveMessage)
router.get("/get-message/:conversationId",getMessage)

export default router
