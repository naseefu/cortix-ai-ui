"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { chatApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export function ChatInput({ 
  chatId, 
  selectedDocument 
}: { 
  chatId: string | null; 
  selectedDocument: string | null;
}) {
  const [input, setInput] = useState("");
  const { addMessage, loadSessions, setActiveChatId, isTyping, setIsTyping } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    
    // Reset height immediately
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    addMessage({ role: "user", content: userMessage });
    setIsTyping(true);

    try {
      const res = await chatApi.sendMessage({
        chatId,
        message: userMessage,
        documentName: selectedDocument,
      });

      if (res.status === "success") {
        addMessage({ role: "ai", content: res.data.content });
        // Retrieve and set the assigned chatId if this was a new anonymous chat
        if (res.data.chatId) {
          setActiveChatId(res.data.chatId);
        }
        // Always attempt to refresh sessions list to keep sidebar synchronized
        await loadSessions();
      }
    } catch (error) {
      console.error("Failed to send message", error);
      addMessage({ role: "ai", content: "Sorry, I encountered an error. Please try again." });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative group rounded-2xl border bg-card/80 backdrop-blur-md shadow-lg transition-all focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Send a message..."
        className="w-full max-h-[200px] min-h-[56px] resize-none bg-transparent py-4 pl-4 pr-14 outline-none scrollbar-hide text-sm"
        disabled={isTyping}
        rows={1}
      />
      
      <div className="absolute right-2 bottom-2">
        <button
          disabled={!input.trim() || isTyping}
          onClick={handleSend}
          className={cn(
            "p-2 rounded-xl transition-all flex items-center justify-center",
            input.trim() && !isTyping
              ? "bg-primary text-primary-foreground hover:opacity-90 shadow-md"
              : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
          )}
        >
          {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
}
