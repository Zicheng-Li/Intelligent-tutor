"use client";

import { useEffect } from "react";
import Classroom from "@/components/classroom";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const authenticateUser = async () => {
      if (user) {
        try {
          // Fetch user details
          const userEmail = user.emailAddresses[0]?.emailAddress;

          // Fetch API route to ensure user is created or updated in the database
          await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/authenticateUser`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                
                email: userEmail
              }),
            }
          );
        } catch (error) {
          console.error("Error during user creation or update:", error);
        }
      }
    };

    if (user) {
      authenticateUser();
    }
  }, [user]);

  return (
    <div className="flex w-full">
      <Classroom />
    </div>
  );
}
