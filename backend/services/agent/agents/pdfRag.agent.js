import fs from "fs"
import {PDFParse} from "pdf-parse"
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters"

import { getModel } from "../config/llmModel.js"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { deductCredits } from "../utils.js/deductInterviews.js"
import vectorStore from "../config/vectorDb.js"
export const pdfRag=async(state)=>{
    try {
        const buffer=fs.readFileSync(state.file.path)
        const pdf=new PDFParse({
            data:buffer
        })

        const result=await pdf.getText()
        const text= result.text;

        const splitter=new RecursiveCharacterTextSplitter({
            chunkSize:1000,
            chunkOverlap:200,
        })
        const docs=await splitter.createDocuments([text])

console.log("DOCS:", docs.length);
console.log("FIRST DOC:", docs[0]?.pageContent);
        const collectionName=`pdf-${Date.now()}`

        const store=await vectorStore(docs,collectionName)

console.log("VECTOR STORE CREATED");

        const relevantDocs=await store.similaritySearch(state.prompt,5)


console.log("RETRIEVED DOCS:");

relevantDocs.forEach((doc, index) => {
  console.log(`DOC ${index + 1}:`);
  console.log("CONTENT:", doc.pageContent);
  console.log("METADATA:", doc.metadata);
});
        

console.log("RELEVANT DOCS:", relevantDocs.length);
console.log(
  "CONTEXT:",
  relevantDocs
    .map((d) => d.pageContent)
    .join("\n\n")
);


        const context=relevantDocs.map(d=>d.pageContent).join("\n\n")

        const llm=await getModel("pdf-agent")
        
        const messages=[
        new SystemMessage(`
You are AgentraAI PDF Assistant.

Rules:

- Answer ONLY from the uploaded PDF.
- Never make up information.
- If the answer is not present in the PDF, reply:
"I couldn't find this information in the uploaded PDF."
- Use Markdown formatting.
`)
,
new HumanMessage(`Context:${context}
    
    Question:${state.prompt}
    `)
        ]

        const response=await llm.invoke(messages)
        await deductCredits(state.userId,"pdf")
        return {
            ...state,
            aiResponse:response.content
        }
    } catch (error) {

        console.log(error)
        return {
            ...state,
            aiResponse:"failed to analyze pdf"
        }
        
    }
    finally{
        fs.unlinkSync(state.file.path)
    }
}