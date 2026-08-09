import { getModel } from "../config/llmModel.js"


export const codingAgent = async (state) => {
  const intentLlm = await getModel("intent")
  const llm=await getModel("coding")
  const intentRes = await intentLlm.invoke(`
You are an intent classifier.

Return ONLY one of these values.

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

💡
User Request:

${state.prompt}
  `)
  const intent=intentRes.content
if(intent="CODE_GENRATION"){
    const prompt=`
    
You are CortexAI Coding Agent.

Generate the requested project.

Default stack:
- HTML
- CSS
- JavaScript

Use React / Next.js / Vue ONLY if explicitly requested.

Rules:
- Responsive
- Modern UI
- CSS Variables
- Flexbox/Grid
- Smooth Scroll
- Hover Effects
- Beautiful spacing
- Single page unless user asks otherwise.

Return ONLY valid JSON.

Schema:
{
  "files": [
    {
      "name": "index.html",
      "content": "..."
    },
    {
      "name": "style.css",
      "content": "..."
    },
    {
      "name": "script.js",
      "content": "..."
    }
  ]
}

Rules:
- Output must start with {
- Output must end with }
- No markdown
- No explanation
- No extra text
- No \`\`\`
- Never mention intent

User Request:
${state.prompt}
    
    
    
    
    `
    const res=await llm.invoke(prompt)
      const data=JSON.parse(res.content)
      return{
        ...state,
        aiResponse:"code generated successfully",
        artifacts:[
            {
                id:Date.name(),
                type:"project",
                files:data.files|| []
            }
        ]
      }
}

const res = await llm.invoke(`
    The user's request is:

${intent}

Return Markdown only.

Never generate project files.

Use headings like:

# Overview

## Explanation

## Problems

## Improvements

## Best Practices

## Optimized Code (if needed)

User Request:

${state.prompt}
`);
   
const data=res.content
return{
    ...state,
    aiResponse:data,
    artifacts:[]
}

}