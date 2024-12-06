"use client";

import { useState } from "react";
import SideChat from "@/components/chat/sideChat";
import ActionButtons from "@/components/chat/actionButtons";

export default function Home() {
  const [isSideChatVisible, setIsSideChatVisible] = useState(false);

  const toggleSideChat = () => {
    setIsSideChatVisible(!isSideChatVisible);
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="w-full">
          text
        </div>
      </div>

      <div
        className={`fixed w-96 top-4 bottom-20 bg-white shadow-lg rounded-md transition-all duration-300
           ease-in-out ${isSideChatVisible ? "translate-x-0 right-4" : "translate-x-full right-0"}`}
      >
        <SideChat />
      </div>
      <div className="fixed bottom-0 right-0 w-full bg-zinc-800">
        <ActionButtons toggleSideChat={toggleSideChat} />
      </div>
    </div>
  );
}
