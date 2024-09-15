import pdfParse from 'pdf-parse/lib/pdf-parse';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CohereEmbeddings } from "@langchain/cohere"
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('pdf') as Blob;
  const {userId} = auth()
  const courseCode = formData.get('courseCode') as string;
  const uploadedFileName = formData.get('uploadedFileName') as string;

  if (!file || !userId || !courseCode || !uploadedFileName) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Convert Blob to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(arrayBuffer);
 

    // Parse PDF
    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const chunks = await splitter.splitText(extractedText);

    // Verify that the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Find or create the Class based on courseCode and userId
    let classItem = await prisma.class.findFirst({
      where: {
        name: courseCode,
        userId: userId,
      },
    });

    if (!classItem) {
      // If the class doesn't exist, create it
      classItem = await prisma.class.create({
        data: {
          name: courseCode,
          description: `Auto-generated class for ${courseCode}`,
          userId: userId,
        },
      });
    }

    // Create a new File record associated with the Class
    const fileRecord = await prisma.file.create({
      data: {
        name: uploadedFileName,
        class: {
          connect: { id: classItem.id },
        },
      },
    });

    // Create Chunk records associated with the File
    const embeddings = new CohereEmbeddings({
      apiKey: process.env.COHERE_API_KEY,
      model: "embed-english-v3.0",
    });

    const vectorStore = new Chroma(embeddings, {
      collectionName: `${userId}_${classItem.id}`,
      url: "http://localhost:8000", // Optional, will default to this value
      collectionMetadata: {
        "hnsw:space": "cosine",
      }, 
    });

    const documents = chunks.map((chunk: string, index: number) => ({
      pageContent: chunk,
      metadata: {
        source: `${uploadedFileName}`, // You can replace with actual source
        chunkIndex: index, // Adding index for easier tracking
      },
    }));

    const documentIds = chunks.map((_, index: number) => `${fileRecord.id}_${index + 1}`);


    const chunkData = chunks.map((chunkText: string, index: number) => ({
      index: index,
      content: chunkText,
      fileId: fileRecord.id,
    }));

    await prisma.chunk.createMany({
      data: chunkData,
    });

    await vectorStore.addDocuments(documents, {
      ids: documentIds,
    });

    return NextResponse.json({ message: 'File and chunks saved successfully' });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ message: 'Error processing file' }, { status: 500 });
  }
}
