"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { useChatStore, Message } from "@/store/useChatStore";
import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";
import ReactMarkdown from "react-markdown";

export function ChatArea() {
  const { chats, activeChatId } = useChatStore();
  const activeChat = chats.find(c => c.chatId === activeChatId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat?.messages]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background/50 text-muted-foreground flex-col gap-4">
        <Bot size={48} className="opacity-20" />
        <p>Select or create a chat to begin</p>
      </div>
    );
  }

  const { messages, selectedDocument } = activeChat;

  return (
    <div className="flex-1 flex flex-col h-full relative bg-background/50">
      <div className="absolute top-0 inset-x-0 h-14 border-b bg-background/80 backdrop-blur-md z-10 flex items-center justify-between px-6">
        <div className="text-sm font-medium">
          {selectedDocument ? (
            <span className="flex items-center gap-2 text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Querying context: {selectedDocument}
            </span>
          ) : (
            <span className="text-muted-foreground">General Knowledge</span>
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-20 pb-32 px-6 scroll-smooth scrollbar-hide"
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-muted-foreground mt-32">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-2">How can I help you?</h2>
                <p>Send a message or upload a document to get started.</p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-10">
        <div className="max-w-3xl mx-auto w-full">
          <ChatInput chatId={activeChat.chatId} selectedDocument={selectedDocument} />
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-4 w-full text-sm",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
        isUser ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
      )}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div className={cn(
        "px-5 py-4 rounded-2xl max-w-[80%] leading-relaxed shadow-sm",
        isUser
          ? "bg-secondary text-secondary-foreground rounded-tr-sm"
          : "bg-card border text-card-foreground rounded-tl-sm"
      )}>
        <div className="markdown-container">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>

      {/* Pure CSS for spacing between markdown elements */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .markdown-container p {
          margin-bottom: 1rem;
        }
        .markdown-container p:last-child {
          margin-bottom: 0;
        }
        .markdown-container ul, .markdown-container ol {
          margin-bottom: 1rem;
          padding-left: 1.25rem;
          list-style-type: disc;
        }
        .markdown-container li {
          margin-bottom: 0.5rem;
        }
        .markdown-container strong {
          font-weight: 700;
          color: inherit;
        }
        .markdown-container h1, .markdown-container h2, .markdown-container h3 {
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
      `}} />
    </motion.div>
  );
}