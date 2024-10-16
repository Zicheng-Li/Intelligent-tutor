import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";

import { Chroma } from "@langchain/community/vectorstores/chroma";
import { CohereEmbeddings } from "@langchain/cohere"; // Import CohereEmbeddings
import { prisma } from "@/lib/prisma";
import { auth } from '@clerk/nextjs/server'


async function getClassId(userId: string, name: string) {
  const classData = await prisma.class.findFirst({
    where: {
      userId: userId,
      name: name,
    },
    select: {
      id: true,
    },
  });
  return classData ? classData.id : null;
}

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

    const referer = req.headers.get('referer');
    const origin = req.headers.get('origin');

    console.log('Referer:', referer); // Logs the full URL of the page that made the request
    console.log('Origin:', origin);   // Logs the origin of the request (protocol, domain, port)
    let route = null
    if (referer) {
      // Parse the referer URL to extract the path (route)
      const url = new URL(referer);
      route = url.pathname; // This will give you the route (e.g., "/123" or "/page/abc")

      if (route.startsWith('/')) {
        route = route.slice(1);
      }
      console.log('Route:', route);
    } else {
      console.log('No Referer header found');
    }

    

    if (!body) {
      return NextResponse.json({ error: "No body received" }, { status: 400 });
    }
    const messages = body.messages ?? [];
    const courseName = route
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    const {userId} = auth()
    
    
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
    
    const classId  = await getClassId(userId, courseName as string)

    const collectionName = `${userId}_${classId}`

    console.log("userId:", userId);
    console.log("classId:", classId);
    console.log("coursename: ", courseName)
    console.log("collectionName:", collectionName);
 
    const vectorStore = await Chroma.fromExistingCollection(embeddings, {
      collectionName: collectionName,
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
    console.error('Error in /api/chat:', e); // Log full error object
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
