"use client";
import FilesUpload from "@/components/filesupload";
import { ChatWindow } from "../../components/chat/ChatWindow";
import Quiz from "@/components/quiz";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Page({ params }: { params: { classId: string } }) {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded flex flex-col items-center w-full h-full">
      <h2 className="text-2xl">👨‍🏫 Your own Intelligent Tutor</h2>
      <p className="text-lg">Ask any question about the course and get instant help.</p>
    </div>
  );

  return (
<ResizablePanelGroup direction="horizontal" className="h-full">
  {/* First Panel for File Upload */}
  <ResizablePanel className="max-w-[18rem] min-w-[12rem]" defaultSize={18} order={1}>
    <div className="h-full p-4 bg-gray-100">
      <FilesUpload />
    </div>
  </ResizablePanel >

  {/* Handle between File Upload and Chat/Quiz */}
  <ResizableHandle withHandle />

  {/* Second Panel Group for Chat and Quiz */}
  <ResizablePanel className="flex-grow" defaultSize={64} order={2}>
    <ResizablePanelGroup direction="horizontal" className="h-full">
      
      {/* Chat Window Panel */}
      <ResizablePanel defaultSize={64} order={1}>
        <div className="h-full bg-white shadow-lg">
          <div className="p-4  bg-gray-100 overflow-auto h-full">
            <ChatWindow
              endpoint="api/chat"
              emoji="👨‍🏫"
              titleText="Your own Intelligent Tutor"
              placeholder="Type your question here..."
              emptyStateComponent={InfoCard}
            />
          </div>
        </div>
      </ResizablePanel>
      
      {/* Handle between Chat and Quiz */}
      <ResizableHandle withHandle/>
      
      {/* Quiz Panel */}
      <ResizablePanel className="max-w-[18rem] min-w-[12rem]" defaultSize={20} order={2}>
        <Quiz />
      </ResizablePanel>
    </ResizablePanelGroup>
  </ResizablePanel>
</ResizablePanelGroup>




  );
}
