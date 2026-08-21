

import dotenv from "dotenv";

 dotenv.config();



import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {ChatOpenRouter } from '@langchain/openrouter'


const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
});

const google = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-3.6-flash",
});

const openrouter=new ChatOpenRouter({
    model:"deepseek/deepseek-chat",
    temperature:0,
    maxTokens:2500
})

export const getModel = (agent) => {
  switch (agent) {
    case "chat":
    case "search":
      return groq;

    case "coding":
      return openrouter;
      case "imageAnalyzer":
      return google;

    default:
      return groq;
  }
};