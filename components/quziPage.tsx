"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { Loader } from "./loader";
import { usePathname } from "next/navigation";

// Define the type for the quiz data
interface QuizItem {
  question: string;
  answers: string[];
  correct_answer: number;
}

export default function QuizPage( { quizId }: { quizId: string }) {
  const [topic, setTopic] = useState("");
  const [quizData, setQuizData] = useState<QuizItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number | null;
  }>({});
  const [answerFeedback, setAnswerFeedback] = useState<{
    [key: number]: boolean | null;
  }>({});
  const path = usePathname();
  const cleanedPath = path.startsWith('/') ? path.substring(1) : path;

  console.log(cleanedPath)

   // Fetch quiz questions when the quizId changes
   useEffect(() => {
    const fetchQuizQuestions = async () => {
      if (!quizId) return; // Return if no quizId is provided
      setIsLoading(true);

      try {
        const response = await fetch("/api/retrieveQuiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizId, // Use the quizId passed from the Quiz component
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setQuizData(data);
          setIsDialogOpen(true);
        } else {
          console.log("Failed to fetch quiz questions");
        }
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      } finally {
        setIsLoading(false);
        
      }
    };

    fetchQuizQuestions();
  }, [quizId]);
  
  
  
  const handleNewQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generateQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          textForGeneration: topic,
          courseCode : cleanedPath
        }),
      });
      if (response.ok) {
        const { quizId } = await response.json();
        console.log("Quiz created with ID:", quizId);

      // Step 2: Fetch the quiz questions using the quizId
        const quizQuestionsResponse = await fetch("/api/retrieveQuiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizId: quizId, // Send the quizId to fetch the questions
          }),
        });

        const data = await quizQuestionsResponse.json();
        console.log(data);
        setQuizData(data);
        setIsDialogOpen(true);
      } else {
        console.log("Failed to fetch questions");
      }
    } catch (error) {
      console.error("Error during fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers((prevSelected) => ({
      ...prevSelected,
      [questionIndex]: answerIndex,
    }));
    setAnswerFeedback((prevFeedback) => ({
      ...prevFeedback,
      [questionIndex]: null, // Reset feedback for this question when an answer is selected
    }));
  };

  const handleCheckAnswer = (questionIndex: number) => {
    const selectedAnswerIndex = selectedAnswers[questionIndex];
  
    if (selectedAnswerIndex !== null && selectedAnswerIndex !== undefined) {
      const selectedAnswerText = quizData[questionIndex].answers[selectedAnswerIndex];
      const correctAnswer = quizData[questionIndex].correct_answer;
      const correctAnswerText = String(correctAnswer);
      setAnswerFeedback((prevFeedback) => ({
        ...prevFeedback,
        [questionIndex]: selectedAnswerText === correctAnswerText, // Compare the selected text with the correct answer
      }));
    }
  };
  

  const getAnswerBackgroundColor = (questionIndex: number, answerIndex: number) => {
    const selectedAnswer = selectedAnswers[questionIndex];
    
    // Ensure selectedAnswer is not null or undefined before using it as an index
    if (selectedAnswer !== null && selectedAnswer !== undefined) {
      const selectedAnswerText = quizData[questionIndex].answers[selectedAnswer];
      const correctAnswer = quizData[questionIndex].correct_answer;
      const correctAnswerText = String(correctAnswer);
    
      // Only apply background colors after "Check Answer" has been clicked
      if (answerFeedback[questionIndex] !== null) {
        // Correct answer, always green
        if (quizData[questionIndex].answers[answerIndex] === correctAnswerText) {
          return "bg-green-500";
        }
        // Incorrect selected answer, red background for the wrong selected answer
        if (selectedAnswerText !== correctAnswerText) {
          return "bg-red-500";
        }
      }
    }
  
    // No color change before checking the answer
    return "bg-white";
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Textarea
          placeholder="What topic would you like your quiz based on?"
          className="w-full"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <Button variant="outline" onClick={() => handleNewQuiz()}>
          Generate Quiz
        </Button>
      </div>

      {isLoading && <Loader />}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-w-[660px] max-h-[600px] p-4">
          <DialogHeader>
            <DialogTitle>Quiz</DialogTitle>
          </DialogHeader>
          <Carousel className="w-full max-w-[500px] mx-auto">
            <CarouselContent>
              {quizData.length > 0 ? (
                quizData.map((item, index) => (
                  <CarouselItem key={index}>
                    <div className="p-4">
                      <Card className="shadow-lg">
                        <CardContent className="flex flex-col gap-4 aspect-square items-center justify-center p-6">
                          <p className="text-center text-lg font-medium">
                            {item.question}
                          </p>
                          <ToggleGroup
                            type="single"
                            className="flex flex-col gap-2 w-full"
                            value={selectedAnswers[index]?.toString() ?? ""}
                            onValueChange={(value) =>
                              handleSelectAnswer(index, parseInt(value))
                            }
                          >
                            {item.answers.map((answer, answerIndex) => (
                              <ToggleGroupItem
                                key={answerIndex}
                                value={answerIndex.toString()}
                                aria-label={`Answer ${answerIndex}`}
                                className={`border border-black rounded p-4 w-full text-center  focus:bg-sky-300 ${getAnswerBackgroundColor(
                                  index,
                                  answerIndex
                                )}`}
                              >
                                <p>{answer}</p>
                              </ToggleGroupItem>
                            ))}
                          </ToggleGroup>
                          <Button
                            className="mt-4 w-full bg-black text-white hover:bg-gray-800"
                            onClick={() => handleCheckAnswer(index)}
                          >
                            Check Answer
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <p>No questions available</p>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  );
}
