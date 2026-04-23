"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Plus,
  FileText,
  Globe,
  MoreHorizontal,
  Bot,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { chatApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
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
    <div
      className={cn(
        "h-full bg-[hsl(240,10%,4%)]/40 backdrop-blur-3xl border-r border-white/[0.06] flex flex-col pt-4 pb-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.2)]",
        isCollapsed ? "w-[76px] px-2" : "w-[280px] px-3"
      )}
    >
      {/* Brand & Toggle */}
      <div className={cn("flex items-center mb-6", isCollapsed ? "justify-center" : "justify-between px-2")}>
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity whitespace-nowrap overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <Bot size={18} />
            </div>
            <span className="font-semibold text-white/90 text-[15px] tracking-tight">Cortix AI</span>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all shrink-0",
             isCollapsed && "mt-1 p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20"
          )}
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* New Chat */}
      <Button
        onClick={createNewChat}
        title={isCollapsed ? "New Chat" : undefined}
        className={cn(
          "mb-6 shadow-sm font-medium transition-all",
          isCollapsed
            ? "w-11 h-11 p-0 justify-center mx-auto rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white overflow-hidden"
            : "w-full justify-start gap-2 bg-indigo-600 hover:bg-indigo-500 text-white"
        )}
      >
        <Plus size={isCollapsed ? 20 : 18} className="shrink-0" />
        {!isCollapsed && <span>New Chat</span>}
      </Button>

      {/* Chat History */}
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto mb-4 scrollbar-hide">
        {!isCollapsed ? (
          <div className="text-[10px] font-semibold text-white/30 px-2 mb-2 uppercase tracking-wider">
            Recent Chats
          </div>
        ) : (
          <div className="h-px bg-white/[0.06] mx-2 mb-2" />
        )}
        
        {sessions.length === 0 && !isCollapsed && (
          <div className="text-xs text-white/30 px-2 text-center py-4 bg-white/[0.02] rounded-lg mx-2 border border-white/[0.04]">
            No chats yet
          </div>
        )}

        {sessions.map((session) => {
          const isActive = activeChatId === session.chatId;
          return (
            <button
              key={session.chatId}
              onClick={() => loadChatHistory(session.chatId)}
              title={isCollapsed ? session.chat_name : undefined}
              className={cn(
                "flex items-center gap-2 rounded-lg text-sm text-left transition-colors whitespace-nowrap overflow-hidden group",
                isCollapsed ? "w-11 h-11 justify-center mx-auto" : "w-full px-2.5 py-2.5",
                isActive
                  ? isCollapsed 
                    ? "bg-white/[0.1] text-white"
                    : "bg-white/[0.08] text-white font-medium"
                  : "text-white/50 hover:bg-white/[0.04] hover:text-white/90"
              )}
            >
              <MessageSquare size={16} className={cn("shrink-0", isActive && !isCollapsed ? "text-indigo-400" : "")} />
              {!isCollapsed && <span className="truncate flex-1 text-[13px]">{session.chat_name}</span>}
              {!isCollapsed && isActive && (
                <MoreHorizontal size={14} className="shrink-0 text-white/30" />
              )}
            </button>
          );
        })}
      </div>

      <div className="h-px bg-white/[0.06] my-2 mx-2" />

      {/* Document Knowledge Base */}
      <div className="flex flex-col gap-1 mb-2">
        {!isCollapsed && (
          <div className="text-[10px] font-semibold text-white/30 px-2 py-2 uppercase tracking-wider flex justify-between items-center">
            <span>Knowledge Base</span>
          </div>
        )}

        {/* Global Context */}
        <button
          onClick={() => handleSelectDoc(null)}
          title={isCollapsed ? "All Documents" : undefined}
          className={cn(
            "flex items-center gap-2 rounded-lg text-sm text-left transition-colors whitespace-nowrap overflow-hidden",
            isCollapsed ? "w-11 h-11 justify-center mx-auto" : "w-full px-2.5 py-2",
            activeDocument === null
              ? isCollapsed 
                ? "bg-blue-500/20 text-blue-400"
                : "bg-blue-500/10 text-blue-400 font-medium border border-blue-500/20"
              : "text-white/50 hover:bg-white/[0.04] hover:text-white/90 border border-transparent"
          )}
        >
          <Globe size={16} className="shrink-0" />
          {!isCollapsed && <span className="truncate text-[13px]">All Documents</span>}
        </button>

        {/* Selected Document List */}
        <div className="max-h-[150px] overflow-y-auto scrollbar-hide flex flex-col gap-1 mt-1 font-medium">
          {documents.map((doc, idx) => {
            const isActive = activeDocument === doc;
            return (
              <button
                key={idx}
                onClick={() => handleSelectDoc(doc)}
                title={isCollapsed ? doc : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-lg text-sm text-left transition-colors whitespace-nowrap overflow-hidden group",
                  isCollapsed ? "w-11 h-11 justify-center mx-auto" : "w-full px-2.5 py-2",
                  isActive
                    ? isCollapsed
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/90 border border-transparent"
                )}
              >
                <FileText size={16} className={cn("shrink-0", isActive && !isCollapsed ? "text-emerald-400" : "")} />
                {!isCollapsed && <span className="truncate text-[12px] opacity-90">{doc}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
