// File: app/api/get-class-files/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Reuse the logic from getClassId
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, courseName } = body;

    // Validate input
    if (!courseName || !userId) {
      return NextResponse.json(
        { message: 'Missing courseName or userId' },
        { status: 400 }
      );
    }

    // Call the helper function to get the class ID
    const classId = await getClassId(userId, courseName);

    // Verify that the class exists
    if (!classId) {
      return NextResponse.json(
        { message: 'Class not found' },
        { status: 404 }
      );
    }

    // Fetch files associated with the class
    const files = await prisma.file.findMany({
      where: { classId: classId },
      select: { name: true },
    });

    return NextResponse.json({ files }, { status: 200 });
  } catch (error) {
    console.error('Error fetching class files:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
