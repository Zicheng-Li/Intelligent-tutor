import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'
export async function GET(request: Request) {
  try {
    const {userId} = auth()
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
