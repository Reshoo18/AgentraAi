import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embeddings.js";
import dotenv from "dotenv";

dotenv.config();

const vectorStore = async (docs, collectionName) => {
  const store = await QdrantVectorStore.fromDocuments(
    docs,
    embeddings,
    {
      url: process.env.QDRANT_ENDPOINT,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName,

      contentPayloadKey: "pageContent",
      metadataPayloadKey: "metadata",
    }
  );

  return store;
};

export default vectorStore;