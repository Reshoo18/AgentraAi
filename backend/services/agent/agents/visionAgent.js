import axios from "axios";
import { getModel } from "../config/llmModel.js";
import { uploadToS3 } from "../utils.js/uploadToS3.js";
import { getFromS3 } from "../utils.js/getFromS3.js";
import { deductCredits } from "../utils.js/deductInterviews.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const visionAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId,"image")
    // 1. Convert user's request into a detailed image prompt
    const llm = await getModel("image");

    const res = await llm.invoke(`
You are an expert image generation prompt engineer.

Convert the user's request into ONE precise image-generation prompt.

STRICT RULES:
- Preserve every subject explicitly requested by the user.
- Never remove, replace, or substitute a requested subject.
- "and" means ALL requested subjects must appear.
- Preserve the exact number of important subjects when specified.
- Keep all requested objects, animals, people and vehicles clearly visible.
- Do not add unrelated main subjects.
- Make the scene physically realistic and coherent.

Style:
- photorealistic
- cinematic lighting
- professional photography
- realistic textures
- sharp focus
- natural colors
- beautiful composition
- depth of field
- high detail

Return ONLY the final image prompt.

User Request:
${state.prompt}
`);

    const prompt = res.content.trim();

    console.log("FINAL IMAGE PROMPT:");
    console.log(prompt);

    // 2. Cloudflare Workers AI
    const url =
      `https://api.cloudflare.com/client/v4/accounts/` +
      `${process.env.CLOUDFLARE_ACCOUNT_ID}` +
      `/ai/run/@cf/black-forest-labs/flux-1-schnell`;

    console.log("CLOUDFLARE IMAGE REQUEST");

    const imageRes = await axios.post(
      url,
      {
        prompt: prompt,
        steps: 4,
        seed: Math.floor(Math.random() * 2147483647)
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
     await deductCredits(state.userId,"vision")
    console.log("CLOUDFLARE RESPONSE RECEIVED");

    // 3. Cloudflare returns Base64 image
    const base64Image = imageRes.data?.result?.image;

    if (!base64Image) {
      throw new Error(
        `Cloudflare did not return an image: ${JSON.stringify(imageRes.data)}`
      );
    }

    // 4. Base64 -> Buffer
    const buffer = Buffer.from(base64Image, "base64");

    // 5. Upload to S3
    const filename = `image-${Date.now()}.jpg`;

    await uploadToS3(
      filename,
      buffer,
      "image/jpeg"
    );

    // 6. Generate signed S3 URL
    const downloadUrl = await getFromS3(
      filename,
      24 * 60 
    );

    // 7. Return result
    return {
      ...state,

      aiResponse: `
# 🖼️ Image Generated Successfully

![Generated Image](${downloadUrl})

📥 [Download Image](${downloadUrl})

⏳ Link expires in 24 hours.
`,

      images: [downloadUrl]
    };

  } catch (error) {
        console.log(error)
        return {
            ...state,
            aiResponse: error?.data?.message ||"failed to generate the image"
        }
    }
};