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

    // Store session ID against user
    await redis.set(
      `user-session-${user._id}`,
      sessionId
    );

    // Store complete session
    const key = `session:${sessionId}`;

    await redis.set(
      key,
      JSON.stringify({
        userID: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiresAt: user.planExpiresAt,
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

    console.log("UPDATE PLAN BODY:", req.body);
    console.log("UPDATE PLAN COOKIE:", req.cookies?.session);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update user payment details
    user.plan = plan;
    user.credits = Number(credits);
    user.totalCredits = Number(credits);

    user.planExpiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    await user.save();

    // Get session ID stored against this user
    const currentSessionId = await redis.get(
      `user-session-${user._id}`
    );

    console.log("CURRENT SESSION ID:", currentSessionId);

    // Update Redis session
    if (currentSessionId) {
      await redis.set(
        `session:${currentSessionId}`,
        JSON.stringify({
          userID: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          plan: user.plan,
          credits: user.credits,
          totalCredits: user.totalCredits,
          planExpiresAt: user.planExpiresAt,
        }),
        "EX",
        7 * 24 * 60 * 60
      );
    }

    console.log("UPDATED USER:", {
      id: user._id,
      plan: user.plan,
      credits: user.credits,
      totalCredits: user.totalCredits,
    });

    return res.status(200).json({
      success: true,
      credits: user.credits,
      totalCredits: user.totalCredits,
      plan: user.plan,
    });
  } catch (error) {
    console.error("UPDATE PLAN ERROR:", error);

    return res.status(500).json({
      message: `Payment issue ${error.message}`,
    });
  }
};