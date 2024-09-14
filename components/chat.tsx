"use client";
import {
  ActionIcon,
  ChatInputActionBar,
  ChatInputArea,
  ChatSendButton,
  TokenTag,
  ActionsBar,
  ChatList,
  ChatListProps,
  StoryBook,
  useControls,
  useCreateStore,
} from "@lobehub/ui";
import { data } from "../data/chatData";
import { ChatHeader, ChatHeaderProps } from "@lobehub/ui";
import { Eraser, PanelLeftClose } from "lucide-react";
export default function Chat({setExpanded} : { setExpanded: React.Dispatch<React.SetStateAction<boolean>> }) {

  const handleUnexpand = () =>{
    setExpanded((prev)=>!prev);
  }
  
  return (
    <div className="flex flex-col relative h-full items-center justify-center bg-gray-100 p-4 w-full ">
      {/* Header Section */}
      <div className="w-full flex justify-center mb-10 bg-white  shadow-md">
        <ChatHeader
          
          left={
            <div className="flex items-center">
              <ActionIcon icon={PanelLeftClose} onClick={handleUnexpand} />
              <p className="text-lg font-bold ml-2">
                Chat with your personal tutor
              </p>
            </div>
          }
        />
      </div>

      {/* Chat List Section */}
      <div className="h-3/4 pt-4 relative w-full max-w-3xl bg-white mt-10 rounded-lg shadow-md overflow-y-auto">
        <ChatList
          data={data}
          renderMessages={{
            default: ({ id, editableContent }) => (
              <div
                id={id}
                className="bg-blue-100 p-2 rounded-lg mb-2 max-w-fit"
              >
                {editableContent}
              </div>
            ),
          }}
          style={{ width: "100%", maxHeight: "100%" }}
        />
      </div>

      {/* Chat Input Section */}
      <div className="w-full mt-3 h-[200px] max-w-3xl relative bg-white p-4 rounded-lg shadow-md">
        <ChatInputArea
          placeholder="Type your message here..."
          bottomAddons={<ChatSendButton />}
          topAddons={
            <ChatInputActionBar
              leftAddons={
                <>
                  <ActionIcon icon={Eraser} />
                  <TokenTag maxValue={5000} value={1000} />
                </>
              }
            />
          }
          className="w-full"
        />
      </div>
    </div>
  );
}
