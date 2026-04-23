"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatArea } from "@/components/chat/ChatArea";

export default function ChatPage() {
  // Empty state is now natively handled by ChatArea.tsx when activeChatId is null.

  return (
    <main className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <ChatArea />
    </main>
  );
}
