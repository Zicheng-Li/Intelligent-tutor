"use client";
import FilesUpload from "@/components/filesupload";
import { ChatWindow } from "../../components/chat/ChatWindow";
import Quiz from "@/components/quiz";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import QuizPage from "@/components/quziPage";

export default function Page({ params }: { params: { classId: string } }) {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded flex flex-col items-center w-full h-full">
      <h2 className="text-2xl">👨‍🏫 Your own Intelligent Tutor</h2>
      <p className="text-lg">
        Ask any question about the course and get instant help.
      </p>
    </div>
  );
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel
        className="max-w-[18rem] min-w-[12rem]"
        defaultSize={18}
        order={1}
      >
        <div className="h-full p-4 bg-gray-100">
          <FilesUpload courseId={params.classId} />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel className="flex-grow" defaultSize={64} order={2}>
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={64} order={1}>
            <div className="h-full bg-white shadow-lg">
              <div className="p-4  bg-gray-100 h-full">
              <ChatWindow
              endpoint="api/chat"
              emoji="👨‍🏫"
              titleText="Your own Intelligent Tutor"
              placeholder="Type your question here..."
              emptyStateComponent={InfoCard}
              courseName={params.classId}
            />
                {/* <QuizPage /> */}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            className="max-w-[18rem] min-w-[12rem]"
            defaultSize={20}
            order={2}
          >
            <Quiz />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
