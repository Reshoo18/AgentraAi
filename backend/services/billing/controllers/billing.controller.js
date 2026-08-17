import axios from "axios";
import crypto from "crypto";
import { PLANS } from "../config/Plans.js";
import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.model.js";

export const createOrder = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("HEADERS:", req.headers);

    const { plan } = req.body;

    const userId = req.headers["x-user-id"];

    console.log("PLAN:", plan);
    console.log("USER ID:", userId);

    if (!userId) {
      return res.status(401).json({
        message: "User ID missing",
      });
    }

    const selectedPlan = PLANS[plan];

    console.log("SELECTED PLAN:", selectedPlan);

    if (!selectedPlan) {
      return res.status(400).json({
        message: "Plan not found",
      });
    }

    const order = await razorpay.orders.create({
      amount: selectedPlan.amount * 100,
      currency: "INR",
      receipt: `receipt-${Date.now()}`,
    });

    console.log("RAZORPAY ORDER:", order);

    await Payment.create({
      userId,
      orderId: order.id,
      amount: selectedPlan.amount,
      credits: selectedPlan.credits,
      plan: selectedPlan.id,
      currency: order.currency,
      status: "created",
    });

    return res.status(200).json({
      order,
      plan: selectedPlan,
    });

  } catch (error) {
    console.error("🔥 CREATE ORDER ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generateSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generateSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    const payment = await Payment.findOne({
      orderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    payment.status = "paid";
    payment.paymentId = razorpay_payment_id;

    await payment.save();

    console.log("PAYMENT:", payment);

    await axios.post(
  `${process.env.AUTH_SERVICE}/update-plan`,
  {
    userId: payment.userId,
    plan: payment.plan,
    credits: payment.credits,
  },
  {
    headers: {
      Cookie: req.headers.cookie || "",
    },
  }
);

    return res.status(200).json({
      success: true,
      message: "Payment verified",
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);

    return res.status(500).json({
      message: `Payment failed ${error.message}`,
    });
  }
};