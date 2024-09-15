import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma'; // Adjust this import based on your project structure
import { ChromaClient } from 'chromadb'; // Adjust based on your setup

export async function DELETE() {
  const chromaClient = new ChromaClient(); // Initialize the Chroma client

  try {
    // Step 1: Delete Chroma DB collections
    

    // Step 2: Delete Prisma data in the correct order
    

    return NextResponse.json({ message: 'All data and collections deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting data or collections:', error);
    return NextResponse.json({ message: 'Failed to delete data or collections', error: error.message }, { status: 500 });
  }
}
