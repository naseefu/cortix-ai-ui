"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bot, User, FileText, Download } from "lucide-react";
import { useChatStore, Message } from "@/store/useChatStore";
import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";
import ReactMarkdown from "react-markdown";

export function ChatArea() {
  const { activeChatId, activeMessages, activeDocument, isTyping } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages, isTyping]);

  return (
    <div className="flex-1 flex flex-col h-full relative bg-background/50">
      <div className="absolute top-0 inset-x-0 h-14 border-b bg-background/80 backdrop-blur-md z-10 flex items-center justify-between px-6">
        <div className="text-sm font-medium">
          {activeDocument ? (
            <span className="flex items-center gap-2 text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Querying context: {activeDocument}
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
          {activeMessages.length === 0 && (
            <div className="h-full flex items-center justify-center text-muted-foreground mt-32">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-2">How can I help you?</h2>
                <p>Send a message or select a context document to get started.</p>
              </div>
            </div>
          )}

          {activeMessages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 w-full text-sm flex-row"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-primary text-primary-foreground">
                <Bot size={16} />
              </div>

              <div className="px-5 py-4 rounded-2xl max-w-[80%] leading-relaxed shadow-sm flex items-center gap-2 bg-card border text-card-foreground rounded-tl-sm">
                <span className="text-muted-foreground font-medium">Thinking</span>
                <span className="flex gap-1 items-center h-4 ml-1">
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-primary/70 rounded-full block" />
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary/85 rounded-full block" />
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full block" />
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-10">
        <div className="max-w-3xl mx-auto w-full">
          <ChatInput chatId={activeChatId} selectedDocument={activeDocument} />
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  const extractPdfData = (text: string) => {
    const regex = /\[?VIEW_PDF:(.*?)(\]|$)/;
    const match = text.match(regex);

    if (match) {
      const V_PDF_URL = match[1].trim();
      const V_CLEAN_TEXT = text.replace(match[0], '').trim();
      return { V_CLEAN_TEXT, V_PDF_URL };
    }
    return { V_CLEAN_TEXT: text, V_PDF_URL: null };
  };

  const { V_CLEAN_TEXT, V_PDF_URL } = extractPdfData(message.content);

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
        "px-5 py-4 rounded-2xl max-w-[80%] leading-relaxed shadow-sm flex flex-col",
        isUser
          ? "bg-secondary text-secondary-foreground rounded-tr-sm"
          : "bg-card border text-card-foreground rounded-tl-sm"
      )}>

        <div className="markdown-container w-full break-words">
          <ReactMarkdown>{V_CLEAN_TEXT}</ReactMarkdown>
        </div>

        {V_PDF_URL && (
          <div className="pdf-attachment-wrapper">
            <a
              href={V_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="pdf-glass-card"
            >
              <div className="pdf-icon-wrapper">
                <FileText size={20} />
              </div>
              <div className="pdf-details">
                <span className="pdf-title">Document Summary.pdf</span>
                <span className="pdf-subtitle">Click to view or download</span>
              </div>
              <Download size={16} className="pdf-download-icon" />
            </a>
          </div>
        )}
      </div>

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

        /* Glassmorphism Document Card (Pure CSS) */
        .pdf-attachment-wrapper {
          margin-top: 16px;
          border-top: 1px solid rgba(150, 150, 150, 0.2);
          padding-top: 16px;
          width: 100%;
        }

        .pdf-glass-card {
          display: flex;
          align-items: center;
          text-decoration: none;
          background: rgba(120, 120, 120, 0.1);
          border: 1px solid rgba(150, 150, 150, 0.2);
          border-radius: 8px;
          padding: 12px 16px;
          transition: all 0.2s ease-in-out;
          color: inherit;
        }

        .pdf-glass-card:hover {
          background: rgba(120, 120, 120, 0.15);
          border-color: rgba(150, 150, 150, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .pdf-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(150, 150, 150, 0.2);
          padding: 10px;
          border-radius: 6px;
          margin-right: 14px;
        }

        .pdf-details {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .pdf-title {
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 2px;
        }

        .pdf-subtitle {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .pdf-download-icon {
          opacity: 0.5;
          transition: opacity 0.2s ease;
        }

        .pdf-glass-card:hover .pdf-download-icon {
          opacity: 1;
        }
      `}} />
    </motion.div>
  );
}