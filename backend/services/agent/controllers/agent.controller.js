import axios from "axios";
import { graph } from "../graph/graphs.js";
import { addMessage } from "../config/memory.js";

export const agent = async (req, res,next) => {
  try {
    const { prompt, conversationId, agent } = req.body;
    const file=req.file
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
      file
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
    next(error)
  }
};