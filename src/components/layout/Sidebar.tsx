"use client";

import React, { useRef, useState } from "react";
import { format } from "date-fns";
import { 
  MessageSquare, 
  Plus, 
  FileText, 
  UploadCloud, 
  File, 
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
    chats, 
    activeChatId, 
    createNewChat, 
    setActiveChat, 
    documents, 
    addDocument,
    setDocumentForChat
  } = useChatStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const activeChat = chats.find(c => c.chatId === activeChatId);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChatId) return;

    try {
      setIsUploading(true);
      const res = await chatApi.uploadFile({ file, chatId: activeChatId });
      addDocument(res.data.fileName);
      setDocumentForChat(activeChatId, res.data.fileName); // auto-select uploaded doc
    } catch (error) {
      console.error("Upload failed", error);
      // Optional: Add toast notification here
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSelectDoc = (docName: string | null) => {
    if (activeChatId) {
      setDocumentForChat(activeChatId, docName);
    }
  };

  return (
    <div className="w-[280px] h-full bg-background border-r flex flex-col pt-4 pb-2 px-3">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
          <Bot size={20} />
        </div>
        <span className="font-semibold text-lg tracking-tight">Cortix AI</span>
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
        {chats.length === 0 && (
          <div className="text-sm text-muted-foreground px-2">No chats yet.</div>
        )}
        {chats.map((chat) => (
          <button
            key={chat.chatId}
            onClick={() => setActiveChat(chat.chatId)}
            className={cn(
              "w-full flex items-center gap-2 px-2 py-2.5 rounded-lg text-sm text-left transition-colors",
              activeChatId === chat.chatId 
                ? "bg-secondary text-secondary-foreground font-medium" 
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            <MessageSquare size={16} className="shrink-0" />
            <span className="truncate flex-1">{chat.title}</span>
            {activeChatId === chat.chatId && (
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

        {/* Global Context (No specific document) */}
        <button
          onClick={() => handleSelectDoc(null)}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-left transition-colors",
            activeChat?.selectedDocument === null 
              ? "bg-primary/10 text-primary font-medium" 
              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          )}
        >
          <Globe size={16} />
          <span className="truncate">All Documents</span>
        </button>

        {/* List mapping */}
        <div className="max-h-[150px] overflow-y-auto scrollbar-hide flex flex-col gap-1 mt-1">
          {documents.map((doc, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectDoc(doc)}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-left transition-colors",
                activeChat?.selectedDocument === doc 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <FileText size={16} className="shrink-0" />
              <span className="truncate">{doc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Button */}
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />
      <Button 
        variant="outline" 
        disabled={!activeChatId || isUploading}
        onClick={handleUploadClick}
        className="w-full justify-start gap-2 mt-auto"
      >
        <UploadCloud size={18} />
        {isUploading ? "Uploading..." : "Upload File"}
      </Button>
      {!activeChatId && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Select a chat to upload a document
        </p>
      )}
    </div>
  );
}
