import { getModel } from "../config/llmModel.js"

export const pptAgent = async (params) => {
    try {
        const llm = await getModel("ppt")

        const prompt = `You are a professional presentation designer.

Return ONLY valid JSON.

Format:

{
  "title": "",
  "subtitle": "",
  "slides": [
    {
      "title": "",
      "points": [
        "",
        "",
        "",
        ""
      ]
    }
  ]
}

Rules:

- Generate exactly 6 content slides.
- Each slide should have 4-6 concise bullet points.
- No markdown.
- No explanation.
- No code block.
- Return ONLY JSON.

Topic:
${state.prompt}`

    } catch (error) {

    }
}