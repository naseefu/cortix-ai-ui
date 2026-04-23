"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  Plus, 
  FileText, 
  Globe, 
  MoreHorizontal,
  Bot
} from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { chatApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { 
    sessions, 
    activeChatId, 
    createNewChat, 
    loadChatHistory, 
    documents, 
    setDocuments,
    setDocumentForChat,
    loadSessions,
    activeDocument,
  } = useChatStore();
  
  useEffect(() => {
    async function fetchDocs() {
      try {
        const res = await chatApi.getDocuments();
        if (res && res.documents) {
          setDocuments(res.documents.map((d: any) => d.name));
        }
      } catch (error) {
        console.error("Failed to load documents", error);
      }
    }
    fetchDocs();
    loadSessions();
  }, [setDocuments, loadSessions]);

  const handleSelectDoc = (docName: string | null) => {
    setDocumentForChat(docName);
  };

  return (
    <div className="w-[280px] h-full bg-background border-r flex flex-col pt-4 pb-2 px-3">
      {/* Brand */}
      <div className="flex items-center justify-between px-2 mb-6">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <Bot size={20} />
          </div>
          <span className="font-semibold text-lg tracking-tight">Cortix AI</span>
        </Link>
      </div>

      {/* New Chat */}
      <Button 
        onClick={createNewChat} 
        className="w-full justify-start gap-2 mb-6 shadow-sm font-medium"
      >
        <Plus size={18} />
        New Chat
      </Button>

      {/* Chat History */}
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto mb-4 scrollbar-hide">
        <div className="text-xs font-semibold text-muted-foreground px-2 mb-2 uppercase tracking-wider">
          Recent Chats
        </div>
        {sessions.length === 0 && (
          <div className="text-sm text-muted-foreground px-2">No chats yet.</div>
        )}
        {sessions.map((session) => (
          <button
            key={session.chatId}
            onClick={() => loadChatHistory(session.chatId)}
            className={cn(
              "w-full flex items-center gap-2 px-2 py-2.5 rounded-lg text-sm text-left transition-colors",
              activeChatId === session.chatId 
                ? "bg-secondary text-secondary-foreground font-medium" 
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            <MessageSquare size={16} className="shrink-0" />
            <span className="truncate flex-1">{session.chat_name}</span>
            {activeChatId === session.chatId && (
              <MoreHorizontal size={14} className="shrink-0 text-muted-foreground" />
            )}
          </button>
        ))}
      </div>

      <div className="h-px bg-border my-2" />

      {/* Document Knowledge Base */}
      <div className="flex flex-col gap-1 mb-2">
        <div className="text-xs font-semibold text-muted-foreground px-2 py-2 uppercase tracking-wider flex justify-between items-center">
          <span>Knowledge Base</span>
        </div>

        {/* Global Context */}
        <button
          onClick={() => handleSelectDoc(null)}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-left transition-colors",
            activeDocument === null 
              ? "bg-primary/10 text-primary font-medium" 
              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          )}
        >
          <Globe size={16} />
          <span className="truncate">All Documents</span>
        </button>

        {/* List mapping */}
        <div className="max-h-[150px] overflow-y-auto scrollbar-hide flex flex-col gap-1 mt-1 font-medium">
          {documents.map((doc, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectDoc(doc)}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-left transition-colors",
                activeDocument === doc 
                  ? "bg-blue-900/40 text-blue-400" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <FileText size={16} className="shrink-0" />
              <span className="truncate text-xs">{doc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
