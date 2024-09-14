// app/api/get-class-files/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { classId, userId } = body;

    // Validate input
    if (!classId || !userId) {
      return NextResponse.json(
        { message: 'Missing classId or userId' },
        { status: 400 }
      );
    }

    // Verify that the class exists and belongs to the user
    const classItem = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classItem) {
      return NextResponse.json(
        { message: 'Class not found' },
        { status: 404 }
      );
    }

    if (classItem.userId !== userId) {
      return NextResponse.json(
        { message: 'Unauthorized access to this class' },
        { status: 403 }
      );
    }

    // Fetch files associated with the class
    const files = await prisma.file.findMany({
      where: { classId: classId },
      select: { id: true, name: true },
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error fetching class files:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
