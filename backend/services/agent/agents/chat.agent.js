import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getModel } from "../config/llmModel.js";
import { getMemory } from "../config/memory.js";
import { deductCredits } from "../utils.js/deductInterviews.js";

export const chatAgent = async (state) => {
  try {
    
    const llm = getModel("chat");

  const history = await getMemory(state.conversationId);
const searchContext = state.searchResults?.results?.length
  ? state.searchResults.results
      .slice(0, 3)
      .map(
        (item, index) => `
Result ${index + 1}

Title: ${item.title}

Content:
${item.content}
`
      )
      .join("\n\n")
  : "";

  const systemPrompt = `You are CortexAI, an intelligent AI assistant.

  ${searchContext}
   If searchContext is exist
-Use search results to answer.
-Do not mention internal tools

    Rules:

- For simple questions, greetings, and short queries, respond naturally in plain text.
- For technical, educational, coding, or detailed topics, use clean Markdown.

Formatting:

- Use # for titles and ## for sections.
- Leave a blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with language tags for code.
- Keep paragraphs short and readable.
- Never write headings and content on the same line.
- Never generate large walls of text.
`;
  const messages = [new SystemMessage(systemPrompt)];
  console.log("conversationId =", state.conversationId);
  console.log("history =", history);
  console.log("isArray =", Array.isArray(history));
  console.log("type =", typeof history);

//   history.forEach((msg) => {
//     if (msg.role == "user") {
//       messages.push(new HumanMessage(msg.content));
//     }
//     if (msg.role == "assistant") {
//       messages.push(new AIMessage(msg.content));
//     }
//   });
  history.forEach((msg) => {
  if (!msg.content) return;

  if (msg.role === "user") {
    messages.push(new HumanMessage(msg.content));
  }

  if (msg.role === "assistant") {
    messages.push(new AIMessage(msg.content));
  }
});
  messages.push(new HumanMessage(state.prompt));
  console.log(messages);

  const response = await llm.invoke(messages);
   await deductCredits(state.userId,"chat")

  return {
    ...state,
    aiResponse: response.content,
  };
  } catch (error) {
    return {
    ...state,
    aiResponse: "Failed to generate response"
  };
  }
};
