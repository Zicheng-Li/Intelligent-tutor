// File: app/api/getClassId/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    const { courseName } = await request.json();

    // Validate input
    if (!userId || !courseName) {
      return NextResponse.json({ error: 'Missing userId or name' }, { status: 400 });
    }

    // Fetch the class with the given userId and name
    const classData = await prisma.class.findFirst({
      where: {
        userId: userId,
        name: courseName,
      },
      select: {
        id: true,
      },
    });

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json({ classId: classData.id }, { status: 200 });
  } catch (error) {
    console.error('Error fetching class ID:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
