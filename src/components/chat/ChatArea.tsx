"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  User,
  FileText,
  Download,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  Sparkles,
  BookOpen,
  Code2,
  Lightbulb,
  Search,
} from "lucide-react";
import { useChatStore, Message } from "@/store/useChatStore";
import { chatApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";
import ReactMarkdown from "react-markdown";

// ─── Suggested prompts for the empty state ────────────────────────────────────
const SUGGESTED_PROMPTS = [
  {
    icon: <Search size={16} />,
    label: "Search & Summarise",
    text: "Summarise the key points from the selected document.",
  },
  {
    icon: <BookOpen size={16} />,
    label: "Explain Concepts",
    text: "Explain the main concepts in the document in simple terms.",
  },
  {
    icon: <Code2 size={16} />,
    label: "Extract Data",
    text: "List all important figures, dates, or statistics mentioned.",
  },
  {
    icon: <Lightbulb size={16} />,
    label: "Get Insights",
    text: "What are the most actionable insights from this content?",
  },
];

// ─── Main ChatArea ─────────────────────────────────────────────────────────────
export function ChatArea() {
  const {
    activeChatId,
    activeMessages,
    activeDocument,
    isTyping,
    addMessage,
    setIsTyping,
    setActiveChatId,
    loadSessions,
    selectedModel,
  } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = useCallback((smooth = true) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "instant",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, isTyping, scrollToBottom]);

  // Show scroll-to-bottom FAB when user scrolls up
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollBtn(distFromBottom > 120);
    };
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const handleSuggestedPrompt = async (text: string) => {
    if (isTyping) return;

    addMessage({ role: "user", content: text });
    setIsTyping(true);

    try {
      const res = await chatApi.sendMessage({
        chatId: activeChatId,
        message: text,
        documentName: activeDocument,
        model: selectedModel ?? undefined,
      });

      if (res.status === "success") {
        addMessage({ role: "ai", content: res.data.content, isNew: true });
        if (res.data.chatId) setActiveChatId(res.data.chatId);
        await loadSessions();
      }
    } catch (error) {
      console.error("Suggested prompt send failed", error);
      addMessage({
        role: "ai",
        content: "Sorry, I encountered an error. Please try again.",
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="absolute top-0 inset-x-0 z-20 h-14 flex items-center justify-between px-5 border-b border-white/[0.06] bg-[hsl(240,10%,4%)]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {/* Model badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-medium text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Cortix AI
          </div>

          {/* Context breadcrumb */}
          {activeDocument ? (
            <motion.div
              key={activeDocument}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400"
            >
              <FileText size={11} />
              <span className="max-w-[160px] truncate">{activeDocument}</span>
            </motion.div>
          ) : (
            <span className="text-xs text-white/30 flex items-center gap-1.5">
              <Sparkles size={11} className="text-white/25" />
              General knowledge
            </span>
          )}
        </div>

        {/* Right: message count */}
        {activeMessages.length > 0 && (
          <span className="text-xs text-white/25 tabular-nums">
            {activeMessages.length} message{activeMessages.length !== 1 ? "s" : ""}
          </span>
        )}
      </header>

      {/* ── Message list ──────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-20 pb-52 px-4 scroll-smooth scrollbar-hide"
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-1">

          {/* Empty state */}
          {activeMessages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center justify-center mt-24 mb-12 text-center"
            >
              {/* Glow orb */}
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl scale-150" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/80 to-indigo-700/80 border border-white/10 flex items-center justify-center shadow-xl shadow-blue-900/30">
                  <Bot size={28} className="text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-white/90 mb-2 tracking-tight">
                How can I help you today?
              </h2>
              <p className="text-sm text-white/40 max-w-sm leading-relaxed mb-10">
                {activeDocument
                  ? `Querying "${activeDocument}". Ask anything about this document.`
                  : "Ask me anything. Select a document in the sidebar to query your knowledge base."}
              </p>

              {/* Suggested prompts grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                {SUGGESTED_PROMPTS.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    onClick={() => handleSuggestedPrompt(s.text)}
                    className="group flex items-start gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] hover:border-white/[0.14] transition-all text-left"
                  >
                    <span className="mt-0.5 p-1.5 rounded-lg bg-white/[0.06] text-white/60 group-hover:text-white/90 transition-colors">
                      {s.icon}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-white/80 mb-0.5">
                        {s.label}
                      </p>
                      <p className="text-xs text-white/40 leading-relaxed">
                        {s.text}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          {activeMessages.map((msg, i) => (
            <ChatMessage
              key={i}
              message={msg}
              isLastInGroup={
                i === activeMessages.length - 1 ||
                activeMessages[i + 1]?.role !== msg.role
              }
              onStreamUpdate={() => scrollToBottom(false)}
            />
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex gap-3 mt-2 mb-1"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md shadow-blue-900/40">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.05] border border-white/[0.08] flex items-center gap-2">
                  <span className="text-xs text-white/50 font-medium">Thinking</span>
                  <span className="flex gap-1 items-end h-3 ml-0.5">
                    {[0, 0.18, 0.36].map((delay, j) => (
                      <motion.span
                        key={j}
                        animate={{ scaleY: [1, 1.8, 1] }}
                        transition={{ repeat: Infinity, duration: 0.9, delay }}
                        className="w-[3px] h-2 bg-blue-400/70 rounded-full block origin-bottom"
                      />
                    ))}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* ── Scroll-to-bottom FAB ──────────────────────────────────────── */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-[140px] left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur text-xs text-white/70 hover:text-white hover:bg-white/[0.14] transition-all shadow-lg"
          >
            <ChevronDown size={14} />
            Scroll to bottom
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Input bar ────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 inset-x-0 z-10 px-4 pb-5 pt-12 bg-gradient-to-t from-[hsl(240,10%,4%)]/90 via-[hsl(240,10%,4%)]/60 to-transparent backdrop-blur-[2px]">
        <div className="max-w-3xl mx-auto w-full">
          <ChatInput chatId={activeChatId} selectedDocument={activeDocument} />
        </div>
        <p className="text-center text-[10px] text-white/20 mt-2">
          Cortix AI can make mistakes. Always verify important information.
        </p>
      </div>
    </div>
  );
}

// ─── Individual message ────────────────────────────────────────────────────────
function ChatMessage({
  message,
  isLastInGroup,
  onStreamUpdate,
}: {
  message: Message;
  isLastInGroup: boolean;
  onStreamUpdate?: () => void;
}) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  // Streaming logic for new AI messages
  const content = message.content;
  const isNewAi = message.role === "ai" && message.isNew;
  const streamCompleted = useRef(!isNewAi);
  const [displayedText, setDisplayedText] = useState(isNewAi ? "" : content);

  useEffect(() => {
    if (!isNewAi || streamCompleted.current) {
      setDisplayedText(content);
      return;
    }

    let i = 0;
    const tokens = content.split(/(\s+)/); // split by whitespace keeping delimiters

    const interval = setInterval(() => {
      if (i >= tokens.length) {
        setDisplayedText(content);
        streamCompleted.current = true;
        clearInterval(interval);
        if (onStreamUpdate) onStreamUpdate(); // final scroll
      } else {
        setDisplayedText(tokens.slice(0, i + 1).join(""));
        i++;
        // scroll to follow text without smooth locking
        if (onStreamUpdate) onStreamUpdate();
      }
    }, 30); // 30ms per word token

    return () => clearInterval(interval);
  }, [content, isNewAi]);

  const extractPdfData = (text: string) => {
    const match = text.match(/\[?VIEW_PDF:(.*?)(\]|$)/);
    if (match) {
      return {
        V_CLEAN_TEXT: text.replace(match[0], "").trim(),
        V_PDF_URL: match[1].trim(),
      };
    }
    return { V_CLEAN_TEXT: text, V_PDF_URL: null };
  };

  const { V_CLEAN_TEXT, V_PDF_URL } = extractPdfData(displayedText);

  const handleCopy = () => {
    navigator.clipboard.writeText(V_CLEAN_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "group flex gap-3 w-full",
        isUser ? "flex-row-reverse" : "flex-row",
        isLastInGroup ? "mb-4" : "mb-0.5"
      )}
    >
      {/* Avatar – only shown on last bubble in a group */}
      <div className="flex flex-col justify-end shrink-0">
        {isLastInGroup ? (
          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center shadow-md",
              isUser
                ? "bg-white/[0.1] border border-white/[0.12]"
                : "bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-900/40"
            )}
          >
            {isUser ? (
              <User size={13} className="text-white/80" />
            ) : (
              <Bot size={13} className="text-white" />
            )}
          </div>
        ) : (
          <div className="w-7" />
        )}
      </div>

      {/* Bubble + actions */}
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[78%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "relative px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-white/[0.08] border border-white/[0.1] text-white/90 rounded-2xl rounded-tr-sm"
              : "bg-white/[0.04] border border-white/[0.07] text-white/85 rounded-2xl rounded-tl-sm"
          )}
        >
          {/* Main text */}
          <div className={cn("break-words", !isUser && "markdown-content")}>
            {isUser ? (
              <p className="whitespace-pre-wrap">{V_CLEAN_TEXT}</p>
            ) : (
              <ReactMarkdown>{V_CLEAN_TEXT}</ReactMarkdown>
            )}
          </div>

          {/* PDF attachment */}
          {V_PDF_URL && (
            <div className="mt-4 pt-3 border-t border-white/[0.08]">
              <a
                href={V_PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.09] hover:border-white/[0.18] transition-all group/pdf"
              >
                <div className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/20">
                  <FileText size={16} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/85 truncate">
                    Document Summary.pdf
                  </p>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    Click to view or download
                  </p>
                </div>
                <Download
                  size={14}
                  className="text-white/30 group-hover/pdf:text-white/70 transition-colors shrink-0"
                />
              </a>
            </div>
          )}
        </div>

        {/* Action row – visible on hover */}
        <div
          className={cn(
            "flex items-center gap-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150",
            isUser ? "flex-row-reverse" : "flex-row"
          )}
        >
          <ActionButton
            onClick={handleCopy}
            title="Copy message"
            icon={
              copied ? (
                <Check size={12} className="text-emerald-400" />
              ) : (
                <Copy size={12} />
              )
            }
            label={copied ? "Copied!" : "Copy"}
          />
          {!isUser && (
            <ActionButton
              onClick={() => {}}
              title="Regenerate response"
              icon={<RefreshCw size={12} />}
              label="Regenerate"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Small action button ───────────────────────────────────────────────────────
function ActionButton({
  onClick,
  icon,
  label,
  title,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-white/35 hover:text-white/70 hover:bg-white/[0.06] transition-all font-medium"
    >
      {icon}
      {label}
    </button>
  );
}