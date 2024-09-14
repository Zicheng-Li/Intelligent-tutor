import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure you have set up Prisma client properly

export async function POST(request: NextRequest) {
  try {
    const { userId, code, description } = await request.json();

    // Validate the input
    if (!userId || !code || !description) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Create a new class and link it with the user
    const newClass = await prisma.class.create({
      data: {
        name: code,
        description,
        userId,
      },
    });

    console.log('Class created:', newClass);

    return NextResponse.json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
