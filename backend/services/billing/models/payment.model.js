import mongoose, { Schema } from "mongoose";

const paymentSchema= new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    orderId:{
        type:String,
        required:true
    },
    paymentId:String,
    amount:Number,
    currency:{
        type:String,
        default:"INR"
    },
    credits:{
        type:Number
    },
    plan:{
        type:String
    },
    status:{
        type:String,
        enum:["creadted","paid","failed"],
        default:"created"
    }


},{timestamps:true})

const Payment= new mongoose.model("Payment",paymentSchema)

export default Payment