import { getModel } from "../config/llmModel.js";
import { deductCredits } from "../utils.js/deductInterviews.js";
import { generatePpt } from "../utils.js/generatePpt.js";
import { getFromS3 } from "../utils.js/getFromS3.js";
import { uploadToS3 } from "../utils.js/uploadToS3.js";

export const pptAgent = async (state) => {
  try {
    const llm = await getModel("ppt");

    const prompt = `
You are a professional presentation designer.

Return ONLY valid JSON.

Do NOT return markdown.
Do NOT return explanations.
Do NOT return code blocks.

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
- Keep the content professional and easy to understand.
- No markdown.
- No explanation.
- No code block.
- Return ONLY valid JSON.

Topic:
${state.prompt}
`;

    const res = await llm.invoke(prompt);

    // LLM response ko JSON me convert karo
    let content = res.content;

    // Agar model content ko array/object format me return kare
    if (typeof content !== "string") {
      content = JSON.stringify(content);
    }

    // ```json ... ``` aa jaye to remove karo
    content = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const data = JSON.parse(content);
    await deductCredits(state.userId,"ppt")

    console.log("PPT DATA:");
    console.dir(data, { depth: null });

    // -------------------------
    // GENERATE PPT BUFFER
    // -------------------------

    const pptBuffer = await generatePpt(data);

    if (!pptBuffer) {
      throw new Error("PPT buffer was not generated");
    }

    console.log("PPT BUFFER GENERATED:", pptBuffer.length);

    // -------------------------
    // UPLOAD TO S3
    // -------------------------

    const filename = `ppt-${Date.now()}.pptx`;

    await uploadToS3(
      filename,
      pptBuffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );

    console.log("PPT uploaded:", filename);

    // -------------------------
    // GET DOWNLOAD URL
    // -------------------------

    const downloadUrl = await getFromS3(
      filename,
      60 * 10
    );

    console.log("PPT DOWNLOAD URL:", downloadUrl);

    // -------------------------
    // RETURN RESPONSE
    // -------------------------

    return {
      ...state,

      aiResponse: `# PPT Generated

**${data.title}**

📥 [Download PPT](${downloadUrl})

⏳ Link expires in 10 minutes.`,

      artifacts: [
        {
          type: "ppt",
          name: filename,
          url: downloadUrl,
        },
      ],
    };
  } catch (error) {
    console.error("PPT AGENT ERROR:", error);

    return {
      ...state,

      aiResponse: "❌ Failed to generate PPT",

      artifacts: [],
    };
  }
};