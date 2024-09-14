import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the path based on your project structure

export async function POST(req: NextRequest) {
  try {
    const { userId, email } = await req.json();

    // If userId is not present, the user is not authenticated
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user exists in the database
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // If user doesn't exist, insert them into the database
    if (!user) {
      // Ensure email is provided
      if (!email) {
        return NextResponse.json({ error: "Email not provided" }, { status: 400 });
      }

      await prisma.user.create({
        data: {
          id: userId, // Clerk user ID
          email: email, // Clerk user email
        },
      });
    }

    // Respond with success message
    return NextResponse.json({ message: "User authenticated and ensured in DB" });
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
