import express from "express"
import { createOrder, verifyPayment } from "../controllers/billing.controller.js"

const rounter=express.Router()

rounter.post("/create",createOrder)
rounter.post("/verify",verifyPayment)

export default rounter