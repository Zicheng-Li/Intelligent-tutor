import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { quizId } = await req.json();

    // Fetch all the questions for the given quizId along with their answers
    const quizQuestions = await prisma.quizQuestion.findMany({
      where: {
        quizId: quizId,
      },
      include: {
        answers: true, // Include the related answers
      },
    });

    // Build the JSON structure
    const formattedQuestions = quizQuestions.map((quizQuestion) => {
      return {
        question: quizQuestion.question,
        answers: quizQuestion.answers.map((answer) => answer.answer),
        correct_answer: quizQuestion.correctAnswer, // Assuming correctAnswer is 1-based index
      };
    });

    // Return the formatted JSON
    return NextResponse.json(formattedQuestions, { status: 200 });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
