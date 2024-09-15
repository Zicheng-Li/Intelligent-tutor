import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

export async function POST(req: NextRequest) {
  try {

    const {courseName} = await req.json()
    
    const { userId } = auth()

    const classId = await getClassId(userId, courseName)

    // Fetch the quizzes based on classId
    const quizzes = await prisma.quiz.findMany({
      where: {
        classId: classId,
      },
      select: {
        id: true,
        displayName: true,
      },
    });

    if (!quizzes || quizzes.length === 0) {
      return NextResponse.json({ error: 'No quizzes found for the given classId' }, { status: 404 });
    }

    return NextResponse.json(quizzes, { status: 200 });

  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
