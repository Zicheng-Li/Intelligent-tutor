import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import QuizPage from "./quziPage";

export default function Quiz() {
    return (

        <div className="bg-gray-100 flex flex-col h-full p-4 gap-3 pt-6 justify-between">
        <div className="flex flex-col gap-5">
          <p className="text-2xl font-medium">Quizes</p>

          <ScrollArea className="w-full  rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">Quizes history</h4>

              <div className="text-sm">Quiz 1</div>
              <Separator className="my-2" />
              <div className="text-sm">Quiz 2</div>
              <Separator className="my-2" />
              <div className="text-sm">Quiz 3</div>
              <Separator className="my-2" />
              <div className="text-sm">Quiz 4</div>
              <Separator className="my-2" />
              <div className="text-sm">Quiz 5</div>
              <Separator className="my-2" />
            </div>
          </ScrollArea>
        </div>

        <div className="grid w-full max-w-sm items-center gap-4 mb-9">
          <Label htmlFor="picture">Generate a new quiz</Label>
          <Textarea placeholder="What topic would you like your quiz based on?" className="w-full" />
          <QuizPage />

          
        </div>
      </div>
    )



}