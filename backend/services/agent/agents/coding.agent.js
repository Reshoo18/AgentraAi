// import { getModel } from "../config/llmModel.js"


// export const codingAgent = async (state) => {
//   const intentLlm = await getModel("intent")
//   const llm=await getModel("coding")
//   const intentRes = await intentLlm.invoke(`
// You are an intent classifier.

// Return ONLY one of these values.

// CODE_GENERATION
// CODE_REVIEW
// CODE_EXPLANATION
// DEBUGGING
// OPTIMIZATION
// CONVERSION
// DOCUMENTATION

// 💡
// User Request:

// ${state.prompt}
//   `)
//   const intent=intentRes.content.trim().toUpperCase();

// if(intent==="CODE_GENERATION"){
//     const prompt=`
    
// You are CortexAI Coding Agent.

// Generate the requested project.

// Default stack:
// - HTML
// - CSS
// - JavaScript

// Use React / Next.js / Vue ONLY if explicitly requested.

// Rules:
// - Responsive
// - Modern UI
// - CSS Variables
// - Flexbox/Grid
// - Smooth Scroll
// - Hover Effects
// - Beautiful spacing
// - Single page unless user asks otherwise.

// Return ONLY valid JSON.

// Schema:
// {
//   "files": [
//     {
//       "name": "index.html",
//       "content": "..."
//     },
//     {
//       "name": "style.css",
//       "content": "..."
//     },
//     {
//       "name": "script.js",
//       "content": "..."
//     }
//   ]
// }

// Rules:
// - Output must start with {
// - Output must end with }
// - No markdown
// - No explanation
// - No extra text
// - No \`\`\`
// - Never mention intent

// User Request:
// ${state.prompt}
    
    
    
    
//     `
//     const res=await llm.invoke(prompt)
//       const data=JSON.parse(res.content)
//       return{
//         ...state,
//         aiResponse:"code generated successfully",
//         artifacts:[
//             {
//                 id:Date.now().toString(),
//                 type:"project",
//                 files:data.files|| [],
//                 title:state.prompt
//             }
//         ]
//       }
// }

// const res = await llm.invoke(`
//     The user's request is:

// ${intent}

// Return Markdown only.

// Never generate project files.

// Use headings like:

// # Overview

// ## Explanation

// ## Problems

// ## Improvements

// ## Best Practices

// ## Optimized Code (if needed)

// User Request:

// ${state.prompt}
// `);
   
// const data=res.content
// return{
//     ...state,
//     aiResponse:data,
//     artifacts:[]
// }

// }

import { getModel } from "../config/llmModel.js";

export const codingAgent = async (state) => {
  const intentLlm = getModel("intent");
  const llm = getModel("coding");

  // 1. Detect coding intent
  const intentRes = await intentLlm.invoke(`
You are an intent classifier.

Return ONLY one of these values:

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:
${state.prompt}
`);

  const intent = intentRes.content.trim().toUpperCase();

  console.log("CODING INTENT:", intent);

  // 2. Generate project
  if (intent === "CODE_GENERATION") {
    const prompt = `
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
- No code fences
- Never mention intent

User Request:
${state.prompt}
`;

    const res = await llm.invoke(prompt);

    let content = res.content.trim();

    // Remove accidental markdown fences if model adds them
    content = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let data;

    try {
      data = JSON.parse(content);
    } catch (error) {
      console.error("CODING JSON ERROR:", error);
      console.error("MODEL RESPONSE:", content);

      return {
        ...state,
        aiResponse: "Code generation failed. Invalid JSON returned by the model.",
        artifacts: [],
      };
    }

    return {
      ...state,
      aiResponse: "code generated successfully",
      artifacts: [
        {
          id: Date.now().toString(),
          type: "project",
          title: state.prompt,
          files: data.files || [],
        },
      ],
    };
  }

  // 3. Other coding requests
  const res = await llm.invoke(`
The user's request is:

${state.prompt}

The detected intent is:

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

  return {
    ...state,
    aiResponse: res.content,
    artifacts: [],
  };
};