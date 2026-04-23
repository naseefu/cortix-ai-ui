"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, CornerDownLeft, ChevronDown, Cpu, Check } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { chatApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const MAX_CHARS = 4000;

interface ModelOption {
  displayName: string;
  actualName: string;
}

export function ChatInput({
  chatId,
  selectedDocument,
}: {
  chatId: string | null;
  selectedDocument: string | null;
}) {
  const [input, setInput] = useState("");
  const {
    addMessage,
    loadSessions,
    setActiveChatId,
    isTyping,
    setIsTyping,
    selectedModel,
    setSelectedModel,
  } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // ── Model selector state ────────────────────────────────────────────────────
  const [models, setModels] = useState<ModelOption[]>([]);
  const [modelOpen, setModelOpen] = useState(false);
  const modelRef = useRef<HTMLDivElement>(null);

  // Load models from public/models.json once
  useEffect(() => {
    fetch("/models.json")
      .then((r) => r.json())
      .then((data: ModelOption[]) => {
        setModels(data);
        if (data.length > 0 && !selectedModel) {
          setSelectedModel(data[0].actualName);
        }
      })
      .catch(() => console.error("Failed to load models.json"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
        setModelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeModel = models.find((m) => m.actualName === selectedModel) ?? models[0];

  // ── Auto-resize textarea ────────────────────────────────────────────────────
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  }, [input]);

  // ── Send logic ──────────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    addMessage({ role: "user", content: userMessage });
    setIsTyping(true);

    try {
      const res = await chatApi.sendMessage({
        chatId,
        message: userMessage,
        documentName: selectedDocument,
        model: activeModel?.actualName,
      });

      if (res.status === "success") {
        addMessage({ role: "ai", content: res.data.content, isNew: true });
        if (res.data.chatId) setActiveChatId(res.data.chatId);
        await loadSessions();
      }
    } catch (error) {
      console.error("Failed to send message", error);
      addMessage({
        role: "ai",
        content: "Sorry, I encountered an error. Please try again.",
      });
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

  const canSend = input.trim().length > 0 && !isTyping;
  const charCount = input.length;
  const nearLimit = charCount > MAX_CHARS * 0.85;

  return (
    <div
      className={cn(
        "relative rounded-2xl border transition-all duration-200",
        "bg-white/[0.04] backdrop-blur-xl",
        isFocused
          ? "border-white/[0.18] shadow-[0_0_0_2px_rgba(99,102,241,0.18)] ring-1 ring-indigo-500/20"
          : "border-white/[0.09] shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
      )}
    >
      {/* Document context pill */}
      {selectedDocument && (
        <div className="flex items-center gap-1.5 px-4 pt-3">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-medium">
            <span className="w-1 h-1 rounded-full bg-blue-400" />
            {selectedDocument}
          </span>
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          if (e.target.value.length <= MAX_CHARS) setInput(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={
          selectedDocument
            ? `Ask about "${selectedDocument}"…`
            : "Message Cortix AI…"
        }
        className={cn(
          "w-full resize-none bg-transparent outline-none",
          "min-h-[52px] max-h-[180px]",
          "py-4 pl-4 pr-[52px]",
          "text-sm text-white/90 placeholder:text-white/25",
          "scrollbar-hide leading-relaxed"
        )}
        disabled={isTyping}
        rows={1}
      />

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-3 pb-2.5 gap-2">

        {/* Left: model selector */}
        <div ref={modelRef} className="relative">
          <button
            onClick={() => setModelOpen((o) => !o)}
            disabled={models.length === 0}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all select-none",
              "bg-white/[0.05] border border-white/[0.08] text-white/55",
              "hover:bg-white/[0.09] hover:text-white/80 hover:border-white/[0.15]",
              modelOpen && "bg-white/[0.09] border-indigo-500/30 text-white/80"
            )}
          >
            <Cpu size={11} className="text-indigo-400 shrink-0" />
            <span className="max-w-[120px] truncate">
              {activeModel?.displayName ?? "Select model"}
            </span>
            <ChevronDown
              size={10}
              className={cn("shrink-0 transition-transform", modelOpen && "rotate-180")}
            />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {modelOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full mb-2 left-0 z-50 w-64 rounded-xl bg-[hsl(240,10%,8%)] border border-white/[0.1] shadow-2xl shadow-black/60 overflow-hidden"
              >
                <div className="px-3 py-2 border-b border-white/[0.07]">
                  <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider">
                    Select Model
                  </p>
                </div>
                <div className="p-1.5 flex flex-col gap-0.5">
                  {models.map((m) => {
                    const isActive = m.actualName === selectedModel;
                    return (
                      <button
                        key={m.actualName}
                        onClick={() => {
                          setSelectedModel(m.actualName);
                          setModelOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all",
                          isActive
                            ? "bg-indigo-500/15 border border-indigo-500/20"
                            : "hover:bg-white/[0.06] border border-transparent"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-xs font-semibold truncate",
                            isActive ? "text-indigo-300" : "text-white/80"
                          )}>
                            {m.displayName}
                          </p>
                          <p className="text-[10px] text-white/30 font-mono truncate mt-0.5">
                            {m.actualName}
                          </p>
                        </div>
                        {isActive && (
                          <Check size={13} className="text-indigo-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: char count + keyboard hint + send */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1 text-[10px] text-white/20">
            <CornerDownLeft size={10} />
            send
          </span>

          {charCount > 0 && (
            <span
              className={cn(
                "text-[10px] tabular-nums transition-colors",
                nearLimit ? "text-amber-400/80" : "text-white/20"
              )}
            >
              {charCount}/{MAX_CHARS}
            </span>
          )}

          <button
            disabled={!canSend}
            onClick={handleSend}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200",
              canSend
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40 hover:scale-105 active:scale-95"
                : "bg-white/[0.05] text-white/20 cursor-not-allowed"
            )}
          >
            {isTyping ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
