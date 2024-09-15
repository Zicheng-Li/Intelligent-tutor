import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";

import { Chroma } from "@langchain/community/vectorstores/chroma";
import { CohereEmbeddings } from "@langchain/cohere"; // Import CohereEmbeddings

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a very knowledgeable tutor for university students. You are provided with specific information from PDFs uploaded by the user related to their course. You will answer the students' questions based solely on the information extracted from these PDFs. If you can't find the information from the PDF's, tell the students that no such content is covered in any of the PDF's.

Current conversation:
{chat_history}

Context from uploaded PDFs:
{context}

User: {input}
AI:`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      temperature: 0.8,
      model: "gpt-3.5-turbo-0125",
    });

    /**
     * Chat models stream message chunks rather than bytes, so this
     * output parser handles serialization and byte-encoding.
     */

     // Initialize embedding model
     const embeddings = new CohereEmbeddings({
      apiKey: process.env.COHERE_API_KEY,
      model: "embed-english-v3.0"
    });

    // Initialize the vector store for the user's course material
    const userId = "user_2lu5aqxzH8dTqjm1sJ0oPSTd3iN";  // Replace with actual userId
    const courseId = "cm12559sz0001komzb9ke7ymo"; // Replace with actual courseId
    const vectorStore = await Chroma.fromExistingCollection(embeddings, {
      collectionName: `${userId}_${courseId}`,
    });

    // Embed the user's question
    const queryEmbedding = await embeddings.embedQuery(currentMessageContent);

    // Search the vector store for relevant chunks
    const searchResults = await vectorStore.similaritySearchVectorWithScore(queryEmbedding, 10);

    // Extract the most relevant chunks to form the context
    let context = searchResults
      .filter(([document, score]) => score > 0.2)  // Filter based on relevance score
      .map(([document]) => document.pageContent)
      .join("\n\n");
    console.log("Context1:", context);
    if (context.length === 0) {
      context = "No relevant material found in your uploaded documents.";
      console.log("Context2:", context);
    }
    console.log("Context3:", context);
    
    const outputParser = new HttpResponseOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      context,
      input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
