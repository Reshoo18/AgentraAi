import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import User from "../models/user.model.js";
import crypto from "node:crypto";
import redis from "../../../shared/redis/redis.js";

export const login = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    // Verify Firebase Token
    const decoded = await getAuth(app).verifyIdToken(token);

    // Find User
    let user = await User.findOne({
      fireBaseUid: decoded.uid,
    });

    // Create User if not exists
    if (!user) {
      user = await User.create({
        fireBaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      });
    }

    // Generate Session
    const sessionId = crypto.randomUUID();
    const key = `session:${sessionId}`;

    await redis.set(
      key,
      JSON.stringify({
        userID: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }),
      "EX",
      7 * 24 * 60 * 60
    );

    // Verify Redis
    const saved = await redis.get(key);

    console.log("Saved Key:", key);
    console.log("Saved Value:", saved);

    // Set Cookie
    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false, // production => true
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const logOut = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;

    if (sessionId) {
      await redis.del(`session:${sessionId}`);
    }

    res.clearCookie("session");

    return res.status(200).json({
      message: "User logged out successfully",
    });

  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUserPayment = async (req, res) => {
  try {
    const { plan, credits, userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.plan = plan;
    user.credits += credits;
    user.totalCredits = credits;
    user.planExpiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    await user.save();

    const sessionId = req.cookies?.session;

    await redis.set(
      `session-${sessionId}`,
      JSON.stringify({
        userID: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan:user.plan,
        credits:user.credits,
        totalCredits:user.totalCredits,
        planExpiresAt:user.planExpiresAt
      }),
      "EX",
      7 * 24 * 60 * 60
    );

    return res.status(200).json({success:true})

  } catch (error) {
    return res.status(400).json({message:`Paymen issue ${error}`})
  }

};