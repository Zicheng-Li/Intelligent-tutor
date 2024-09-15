"use client";
import { useState } from "react";
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

// Define the type for the quiz data
interface QuizItem {
  question: string;
  answers: string[];
  correct_answer: number;
}

export default function QuizPage() {
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

  const handleNewQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
        }),
      });
      if (response.ok) {
        const data = await response.json();
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
    const selectedAnswer = selectedAnswers[questionIndex];
    const correctAnswer = quizData[questionIndex].correct_answer;
    if (selectedAnswer !== null) {
      setAnswerFeedback((prevFeedback) => ({
        ...prevFeedback,
        [questionIndex]: selectedAnswer === correctAnswer, // True if correct, false if incorrect
      }));
    }
  };

  const getAnswerBackgroundColor = (questionIndex: number, answerIndex: number) => {
    const selectedAnswer = selectedAnswers[questionIndex];
    const correctAnswer = quizData[questionIndex].correct_answer;
    
    // Only apply background colors after "Check Answer" has been clicked
    if (answerFeedback[questionIndex] !== null) {
      // Correct answer, always green
      if (answerIndex === correctAnswer) {
        return "bg-green-500";
      }
      // Incorrect selected answer, red background for the wrong selected answer
      if (selectedAnswer === answerIndex) {
        return "bg-red-500";
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
                                className={`border border-gray-300 rounded p-4 w-full text-center hover:bg-gray-100 ${getAnswerBackgroundColor(
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
