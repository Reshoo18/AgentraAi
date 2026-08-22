import { checkAgentLimit } from "../config/agentLimit.js";
import { getModel } from "../config/llmModel.js"
import { deductCredits } from "../utils.js/deductInterviews.js";
import { generatePdf } from "../utils.js/generatePdf.js";
import { getFromS3 } from "../utils.js/getFromS3.js";
import { uploadToS3 } from "../utils.js/uploadToS3.js";

export const pdfAgent=async(state)=>{
    try {
      await checkAgentLimit(state.userId,"pdf")

        const llm=await getModel("pdf")
        const prompt = `
You are an expert document writer.

Return ONLY valid JSON.

Do NOT return markdown.
Do NOT return explanations.

Structure:

{
  "title": "",
  "subtitle": "",
  "sections": [
    {
      "heading": "",
      "points": []
    }
  ]
}

Generate 4-8 sections.

Each section should have 3-6 concise bullet points.

Topic:
${state.prompt}
`;
const res=await llm.invoke(prompt)
  const data = JSON.parse(res.content);
  await deductCredits(state.userId,"pdf")
console.log(JSON.parse(res.content))

const pdfBuffer=await generatePdf(data)

const filename=`pdf-${Date.now()}.pdf`

await uploadToS3(filename,pdfBuffer,"application/pdf")

const downloadUrl=await getFromS3(filename,60*24)

return {
    ...state,
    aiResponse: `# PDF Generated

**${data.title}**

📥 [Download PDF](${downloadUrl})

⏳ Link expires in 10 minutes.`
}


    } catch (error) {
        console.log(error)
        return {
            ...state,
            aiResponse: error?.data?.message ||"failed to generate the pdf"
        }
    }
}