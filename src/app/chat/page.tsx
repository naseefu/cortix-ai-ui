"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatArea } from "@/components/chat/ChatArea";

export default function ChatPage() {
  // Empty state is now natively handled by ChatArea.tsx when activeChatId is null.

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[hsl(240,10%,4%)] text-white relative">
      {/* ── Dynamic Ambient Background ─────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-900/15 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-indigo-900/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '5s' }}></div>
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 flex h-full w-full">
        <Sidebar />
        <ChatArea />
      </div>
    </main>
  );
}
