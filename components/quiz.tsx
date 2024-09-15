"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import QuizPage from "./quziPage";
import { usePathname } from "next/navigation";

interface Quiz {
  id: string;
  displayName: string;
}

export default function Quiz({ classId }: { classId: string }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const path = usePathname();
  const cleanedPath = path.startsWith('/') ? path.substring(1) : path;
  const handleQuizClick = (quizId: string) => {
    setSelectedQuizId(quizId); // Set the selected quizId
  };

  console.log(cleanedPath)

  // Fetch quizzes from the API
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getQuizNameId", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseName : cleanedPath  }), // Send the classId to the backend
        });

        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }

        const data: Quiz[] = await response.json();
        setQuizzes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [classId]);

  return (
    <div className="bg-gray-100 flex flex-col h-full p-4 gap-3 pt-6 justify-between">
      <div className="flex flex-col gap-5">
        <p className="text-2xl font-medium">Quizzes</p>

        <ScrollArea className="w-full rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Quizzes history
            </h4>

            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : quizzes.length === 0 ? (
              <p>No quizzes found.</p>
            ) : (
              quizzes.map((quiz) => (
                <div key={quiz.id} className="text-sm cursor-pointer"
                onClick={() => handleQuizClick(quiz.id)}>
                  {quiz.displayName}
                  <Separator className="my-2" />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="grid w-full max-w-sm items-center gap-4 mb-9">
        <Label htmlFor="picture">Generate a new quiz</Label>
        <QuizPage quizId={selectedQuizId} />
      </div>
    </div>
  );
}
