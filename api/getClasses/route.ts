import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const userId = new URL(request.url).searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const classes = await prisma.class.findMany({
      where: { userId },
      select: {
        name: true,
        description: true,
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching classes' }, { status: 500 });
  }
}
