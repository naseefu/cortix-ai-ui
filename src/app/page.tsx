"use client";

import React, { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { useChatStore } from "@/store/useChatStore";

export default function Home() {
  const { chats, createNewChat } = useChatStore();

  // Create an initial chat if there are none when the app loads
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <ChatArea />
    </main>
  );
}
