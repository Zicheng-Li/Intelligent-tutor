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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
export default function QuizPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const handleCheckAnswer = () => {
    // Your logic here
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Generate Quiz</Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-[660px] max-h-[600px] p-4">
        <DialogHeader>
          <DialogTitle>Quiz</DialogTitle>
        </DialogHeader>
        <Carousel className="w-full max-w-[500px] mx-auto">
          <CarouselContent>
            <CarouselItem>
              <div className="p-4">
                <Card className="shadow-lg">
                  <CardContent className="flex flex-col gap-4 aspect-square items-center justify-center p-6">
                    <p className="text-center text-lg font-medium">
                      Images without dimensions and web fonts are common causes
                      of layout shift.
                    </p>
                    <ToggleGroup
                      type="single"
                      className="flex flex-col gap-2 w-full"
                    >
                      <ToggleGroupItem
                        value="a"
                        aria-label="Toggle bold"
                        className="border border-gray-300 rounded p-4 w-full text-center hover:bg-gray-100"
                      >
                        <p>this is a </p>
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="b"
                        aria-label="Toggle italic"
                        className="border border-gray-300 rounded p-4 w-full text-center hover:bg-gray-100"
                      >
                        <p>this is b </p>
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="c"
                        aria-label="Toggle underline"
                        className="border border-gray-300 rounded p-4 w-full text-center hover:bg-gray-100"
                      >
                        <p>this is c </p>
                      </ToggleGroupItem>
                    </ToggleGroup>
                    <Button className="mt-4 w-full bg-black text-white hover:bg-gray-800">
                      Check Answer
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-4">
                <Card className="shadow-lg">
                  <CardContent className="flex flex-col gap-4 aspect-square items-center justify-center p-8">
                    <p className="text-center text-lg font-medium">
                      Images without dimensions and web fonts are common causes
                      of layout shift.
                    </p>
                    <ToggleGroup
                      type="single"
                      className="flex flex-col gap-2 w-full"
                    >
                      <ToggleGroupItem
                        value="a"
                        aria-label="Toggle bold"
                        className="border border-gray-300 rounded p-4 w-full text-center hover:bg-gray-100"
                      >
                        <p>this is a </p>
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="b"
                        aria-label="Toggle italic"
                        className="border border-gray-300 rounded p-4 w-full text-center hover:bg-gray-100"
                      >
                        <p>this is b </p>
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="c"
                        aria-label="Toggle underline"
                        className="border border-gray-300 rounded p-4 w-full text-center hover:bg-gray-100"
                      >
                        <p>this is c </p>
                      </ToggleGroupItem>
                    </ToggleGroup>
                    <Button className="mt-4 w-full bg-black text-white hover:bg-gray-800">
                      Check Answer
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
