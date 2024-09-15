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

async function fetchQuestions(topic: string, userId: string, classId: string) {
    const response = await fetch('http://127.0.0.1:5000/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, userId, classId }), // Send topic, userId, and classId in the request body
    });
    if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
    
      return response.json();
}

export async function POST(req: NextRequest) {
  try {
    const { courseCode, textForGeneration } = await req.json();
    const { userId } = auth()
    // Find the class by courseCode
    const classObj = await prisma.class.findUnique({
      where: {
        code: courseCode,
        userId: userId
      },
    });

    if (!classObj) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // Create the Quiz
    let displayName = `Quiz for ${classObj.name}`;
    let increment = 1;

    // Check if a quiz with this name already exists and increment if necessary
    let existingQuiz = await prisma.quiz.findFirst({
      where: {
        classId: classObj.id,
        displayName: {
          startsWith: displayName, // Find quizzes with similar names
        },
      },
      orderBy: {
        displayName: 'desc', // Get the most recent one (if numbered)
      },
    });

    if (existingQuiz) {
      const match = existingQuiz.displayName.match(/(\d+)$/); // Check if it ends with a number
      if (match) {
        increment = parseInt(match[1], 10) + 1; // Increment the number
      } else {
        increment = 2; // If the first match doesn't have a number, append 2
      }
      displayName = `${displayName} ${increment}`;
    }

    const quiz = await prisma.quiz.create({
        data: {
          displayName,
          textForGeneration,
          classId: classObj.id,
        },
      });

    
      const classId = await getClassId(userId, courseCode)

      const questions = await fetchQuestions(textForGeneration, userId, classId);

      for (const questionData of questions) {
        const { question, answers, correct_answer } = questionData;
  
        // Create the QuizQuestion entry
        const quizQuestion = await prisma.quizQuestion.create({
          data: {
            quizId: quiz.id,
            question,
            correctAnswer: correct_answer,
          },
        });
  
        // Insert answers for each question
        for (const answer of answers) {
          await prisma.answer.create({
            data: {
              questionId: quizQuestion.id,
              answer,
            },
          });
        }
      }

    
    

    return NextResponse.json({ quizId: quiz.id }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
