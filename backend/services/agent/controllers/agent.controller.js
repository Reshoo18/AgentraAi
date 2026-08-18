import axios from "axios";
import { graph } from "../graph/graphs.js";
import { addMessage } from "../config/memory.js";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId, agent } = req.body;
    const userId=req.headers["x-user-id"]
    // Save user message to database
    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: "user",
      content: prompt,
    });

    // Save user message to Redis memory
    await addMessage(
      conversationId,
      "user",
      prompt
    );

    // Run graph
    const result = await graph.invoke({
      prompt,
      conversationId,
      agent,
      userId,
    });

    const response = result.aiResponse;

    // Save assistant response to Redis memory
    await addMessage(
      conversationId,
      "assistant",
      response
    );

    // Save assistant message to database
    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: "assistant",
      content: response,
      images: result?.images || [],
      artifacts: result?.artifacts || [],
    });

    return res.status(200).json({
      answer: response,
      images: result?.images || [],
      artifacts: result?.artifacts || [],
    });

  } catch (error) {
    console.error("AGENT ERROR:", error);

    return res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};