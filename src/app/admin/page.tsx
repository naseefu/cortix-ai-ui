"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  Database,
  Zap,
  Layers,
  Box,
  Loader2,
  Trash2,
  BarChart2,
  RefreshCw,
  TrendingUp,
  Hash,
  Search,
  Bot,
  Files,
  Activity,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { chatApi } from "@/lib/api";

type LocalDoc = { id: string; name: string };
type FaqItem  = { query: string; count: number };

// ── Animation variants ────────────────────────────────────────────────────────
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18 } },
};

export default function AdminPage() {
  const [documents, setDocuments]     = useState<LocalDoc[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver]       = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [faqs, setFaqs]               = useState<FaqItem[]>([]);
  const [totalUnique, setTotalUnique] = useState(0);
  const [faqLoading, setFaqLoading]   = useState(true);
  const [faqError, setFaqError]       = useState(false);
  const [faqSearch, setFaqSearch]     = useState("");

  const [systemHealth, setSystemHealth] = useState<"loading" | "online" | "offline">("loading");
  const [monitoringLogs, setMonitoringLogs] = useState<any[]>([]);
  const [monitoringLoading, setMonitoringLoading] = useState(true);

  const fetchDocs = useCallback(async () => {
    try {
      const res = await chatApi.getDocuments();
      if (res?.documents) setDocuments(res.documents);
    } catch (e) { console.error(e); }
  }, []);

  const fetchFaqs = useCallback(async () => {
    setFaqLoading(true);
    setFaqError(false);
    try {
      const data = await chatApi.getFaqAnalytics();
      setFaqs(data.faqs ?? []);
      setTotalUnique(data.total_unique ?? 0);
    } catch { setFaqError(true); }
    finally  { setFaqLoading(false); }
  }, []);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await chatApi.checkHealth();
      if (res && res.status === "healthy") {
        setSystemHealth("online");
      } else {
        setSystemHealth("offline");
      }
    } catch {
      setSystemHealth("offline");
    }
  }, []);

  const fetchMonitoring = useCallback(async () => {
    setMonitoringLoading(true);
    try {
      const res = await chatApi.getMonitoringChats();
      setMonitoringLogs(res.logs ?? []);
    } catch {
      // silent fail
    } finally {
      setMonitoringLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchDocs(); 
    fetchFaqs(); 
    fetchHealth(); 
    fetchMonitoring();
  }, [fetchDocs, fetchFaqs, fetchHealth, fetchMonitoring]);

  const handleUploadClick = () => fileInputRef.current?.click();

  const processFile = async (file: File) => {
    try {
      setIsUploading(true);
      await chatApi.uploadFile({ file, chatId: null });
      await fetchDocs();
    } catch (e) { console.error("Upload failed", e); }
    finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Permanently delete this document from the vector store?")) return;
    try { await chatApi.deleteDocument(docId); await fetchDocs(); }
    catch (e) { console.error(e); }
  };

  const filteredFaqs = faqs.filter(f =>
    f.query.toLowerCase().includes(faqSearch.toLowerCase())
  );
  const maxCount     = faqs[0]?.count ?? 1;
  const totalQueries = faqs.reduce((a, b) => a + b.count, 0);

  // ── KPI data ──────────────────────────────────────────────────────────────────
  const kpis = [
    {
      label:   "Documents",
      value:   documents.length,
      sub:     "in vector store",
      icon:    <Files size={18} />,
      color:   "blue",
      accent:  "from-blue-500 to-indigo-500",
      bg:      "bg-blue-500/10",
      border:  "border-blue-500/20",
      text:    "text-blue-400",
    },
    {
      label:   "Total Queries",
      value:   totalQueries.toLocaleString(),
      sub:     "across all sessions",
      icon:    <Activity size={18} />,
      color:   "violet",
      accent:  "from-violet-500 to-fuchsia-500",
      bg:      "bg-violet-500/10",
      border:  "border-violet-500/20",
      text:    "text-violet-400",
    },
    {
      label:   "Unique Questions",
      value:   totalUnique,
      sub:     "tracked by analytics",
      icon:    <Hash size={18} />,
      color:   "fuchsia",
      accent:  "from-fuchsia-500 to-pink-500",
      bg:      "bg-fuchsia-500/10",
      border:  "border-fuchsia-500/20",
      text:    "text-fuchsia-400",
    },
    {
      label:   "AI Engine",
      value:   systemHealth === "loading" ? "Checking..." : systemHealth === "online" ? "Online" : "Offline",
      sub:     "Groq + Llama models",
      icon:    <Bot size={18} />,
      color:   systemHealth === "online" ? "emerald" : systemHealth === "offline" ? "red" : "amber",
      accent:  systemHealth === "online" ? "from-emerald-500 to-teal-500" : systemHealth === "offline" ? "from-red-500 to-rose-500" : "from-amber-500 to-yellow-500",
      bg:      systemHealth === "online" ? "bg-emerald-500/10" : systemHealth === "offline" ? "bg-red-500/10" : "bg-amber-500/10",
      border:  systemHealth === "online" ? "border-emerald-500/20" : systemHealth === "offline" ? "border-red-500/20" : "border-amber-500/20",
      text:    systemHealth === "online" ? "text-emerald-400" : systemHealth === "offline" ? "text-red-400" : "text-amber-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(240,10%,4%)] text-white relative flex flex-col">

      {/* ── Ambient background ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[-5%] w-[45%] h-[45%] bg-blue-900/10 rounded-full blur-[150px]" />
        <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] bg-violet-900/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[25%] w-[40%] h-[40%] bg-indigo-900/5 rounded-full blur-[140px]" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* ── Top navigation bar ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 w-full border-b border-white/[0.06] bg-[hsl(240,10%,4%)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-3">
            <Link href="/chat">
              <button className="h-8 w-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] transition-colors text-white/60 hover:text-white">
                <ArrowLeft size={15} />
              </button>
            </Link>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-white/35">Cortix AI</span>
              <ChevronRight size={13} className="text-white/20" />
              <span className="text-white/80 font-medium">Admin Console</span>
            </div>
          </div>

          {/* Right: status pills */}
          <div className="flex items-center gap-3">
            {systemHealth === "online" ? (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                All systems operational
              </div>
            ) : systemHealth === "offline" ? (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[11px] font-medium text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                System Offline
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-medium text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Checking health...
              </div>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] font-medium text-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              v1.0 · Cortix Engine
            </div>
          </div>
        </div>
      </div>

      {/* ── Page content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-8">

        {/* Page title */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <h1 className="text-3xl font-bold tracking-tight text-white/95 mb-1">
            Infrastructure Console
          </h1>
          <p className="text-sm text-white/40">
            Monitor document ingestion, query analytics, and AI pipeline services.
          </p>
        </motion.div>

        {/* ── KPI Stat Cards ────────────────────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {kpis.map((kpi, i) => (
            <motion.div key={i} variants={fadeUp}
              className="relative rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 overflow-hidden hover:bg-white/[0.06] transition-colors group"
            >
              {/* Accent line */}
              <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r ${kpi.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-xl ${kpi.bg} border ${kpi.border}`}>
                  <span className={kpi.text}>{kpi.icon}</span>
                </div>
                <CheckCircle2 size={13} className="text-white/15" />
              </div>
              <div className="text-2xl font-bold tracking-tight text-white/95 mb-0.5 tabular-nums">
                {kpi.value}
              </div>
              <div className="text-[11px] font-medium text-white/50">{kpi.label}</div>
              <div className="text-[10px] text-white/25 mt-0.5">{kpi.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Main 3-col grid ───────────────────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* ── Knowledge DB (2/3 width) ─────────────────────────────────── */}
          <motion.div variants={fadeUp} className="lg:col-span-2 flex flex-col gap-6">

            {/* Table panel */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden relative shadow-xl shadow-black/30">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-blue-500/60 via-indigo-500/40 to-transparent" />

              {/* Table header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Database size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white/90">Knowledge Vector Store</h2>
                    <p className="text-[11px] text-white/35 mt-0.5">Qdrant · ChromaDB integration</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-semibold text-blue-400 tabular-nums">
                    {documents.length} doc{documents.length !== 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={fetchDocs}
                    className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all"
                    title="Refresh"
                  >
                    <RefreshCw size={13} />
                  </button>
                </div>
              </div>

              {/* Table body */}
              {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-white/30">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-4">
                    <Box size={28} className="opacity-30" />
                  </div>
                  <p className="text-sm font-medium mb-1">No documents ingested</p>
                  <p className="text-xs text-white/20">Upload a PDF or DOCX to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.05]">
                        <th className="px-5 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider">#</th>
                        <th className="px-5 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider">Document</th>
                        <th className="px-5 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider hidden sm:table-cell">Vector ID</th>
                        <th className="px-5 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc, i) => (
                        <motion.tr
                          key={doc.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="group border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors"
                        >
                          <td className="px-5 py-3.5 text-xs text-white/20 tabular-nums font-medium w-8">
                            {String(i + 1).padStart(2, "0")}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/15 shrink-0">
                                <FileText size={13} className="text-blue-400/80" />
                              </div>
                              <span className="text-sm font-medium text-white/85 truncate max-w-[200px]">
                                {doc.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 hidden sm:table-cell">
                            <span className="font-mono text-[10px] text-white/25 bg-white/[0.04] px-2 py-0.5 rounded">
                              {doc.id}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400 whitespace-nowrap">
                                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                Indexed
                              </span>
                              <button
                                onClick={() => handleDelete(doc.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Service status cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* FlashRank */}
              <div className="relative rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 overflow-hidden group hover:border-amber-500/20 hover:bg-white/[0.05] transition-all">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-amber-500/50 to-orange-500/30" />
                <div className="flex items-start justify-between mb-5">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Zap size={16} className="text-amber-400" />
                  </div>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="text-base font-bold tracking-tight text-white/90 mb-0.5">FlashRank</div>
                <div className="text-xs text-white/40 mb-3">Cross-Encoder Reranker</div>
                {/* Uptime bar */}
                <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full w-[98%] bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" />
                </div>
                <p className="text-[10px] text-white/25 mt-2">Re-ranks retrieved chunks for relevance before generation</p>
              </div>

              {/* In-Memory Cache */}
              <div className="relative rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 overflow-hidden group hover:border-cyan-500/20 hover:bg-white/[0.05] transition-all">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-cyan-500/50 to-teal-500/30" />
                <div className="flex items-start justify-between mb-5">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <Layers size={16} className="text-cyan-400" />
                  </div>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="text-base font-bold tracking-tight text-white/90 mb-0.5">In-Memory Cache</div>
                <div className="text-xs text-white/40 mb-3">Semantic Query Cache</div>
                <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full" />
                </div>
                <p className="text-[10px] text-white/25 mt-2">Caches queries in-process to reduce LLM calls &amp; cost</p>
              </div>
            </div>
          </motion.div>

          {/* ── Upload sidebar (1/3 width) ───────────────────────────────── */}
          <motion.div variants={fadeUp} className="flex flex-col gap-4">

            {/* Upload panel */}
            <div className="relative rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden shadow-xl shadow-black/20">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-emerald-500/60 to-cyan-500/30" />

              <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <UploadCloud size={15} className="text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white/90">Ingest Document</h3>
                </div>
                <p className="text-[11px] text-white/35 leading-relaxed">
                  Upload into Qdrant for instant vector embedding and RAG indexing.
                </p>
              </div>

              <div className="p-4">
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc,.txt"
                />

                <button
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-10 transition-all outline-none ${
                    dragOver
                      ? "border-emerald-400/60 bg-emerald-500/[0.07] scale-[0.99]"
                      : "border-white/[0.1] hover:border-emerald-500/40 hover:bg-emerald-500/[0.04]"
                  }`}
                >
                  {isUploading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
                      <Loader2 size={28} className="text-emerald-400" />
                    </motion.div>
                  ) : (
                    <div className={`p-3 rounded-xl border transition-colors ${
                      dragOver
                        ? "bg-emerald-500/20 border-emerald-500/30"
                        : "bg-white/[0.04] border-white/[0.08]"
                    }`}>
                      <UploadCloud size={22} className={dragOver ? "text-emerald-400" : "text-white/30"} />
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-xs font-semibold text-white/70 mb-1">
                      {isUploading ? "Vectorizing…" : dragOver ? "Drop to upload" : "Click or drag & drop"}
                    </p>
                    {!isUploading && (
                      <p className="text-[10px] text-white/30">PDF, DOCX, TXT · max 50 MB</p>
                    )}
                  </div>
                </button>

                {/* Format pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {["PDF", "DOCX", "TXT"].map(f => (
                    <span key={f} className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] border border-white/[0.08] text-white/30">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick info panel */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Pipeline Config</h4>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Vector DB",    value: "Chroma DB",    dot: "bg-blue-400" },
                  { label: "Embeddings",   value: "OpenAI",       dot: "bg-indigo-400" },
                  { label: "LLM",          value: "OpenAI",       dot: "bg-violet-400" },
                  { label: "Reranker",     value: "FlashRank",    dot: "bg-amber-400" },
                  { label: "Cache",        value: "In-Memory",    dot: "bg-cyan-400" },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-[11px] text-white/35">{row.label}</span>
                    <span className={`flex items-center gap-1.5 text-[11px] font-medium text-white/70`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${row.dot}`} />
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── FAQ Analytics ─────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden relative shadow-xl shadow-black/20"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-violet-500/70 via-fuchsia-500/50 to-pink-500/30" />

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <BarChart2 size={16} className="text-violet-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white/90">Query Analytics — Frequently Asked</h2>
                <p className="text-[11px] text-white/35 mt-0.5">
                  {faqLoading
                    ? "Fetching data…"
                    : `${totalUnique} unique question${totalUnique !== 1 ? "s" : ""} · ${totalQueries.toLocaleString()} total queries`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <input
                  value={faqSearch}
                  onChange={e => setFaqSearch(e.target.value)}
                  placeholder="Filter…"
                  className="pl-7 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] text-white/75 placeholder:text-white/20 outline-none focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/15 w-36 transition-all"
                />
              </div>
              <button
                onClick={fetchFaqs}
                disabled={faqLoading}
                className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/40 hover:text-white/80 transition-all"
                title="Refresh"
              >
                <RefreshCw size={13} className={faqLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-4">

            {/* Skeleton */}
            {faqLoading && (
              <div className="flex flex-col gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-7 h-3 bg-white/[0.07] rounded" />
                    <div className="flex-1 h-3 bg-white/[0.07] rounded" style={{ maxWidth: `${75 - i * 12}%` }} />
                    <div className="w-12 h-3 bg-white/[0.07] rounded" />
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {!faqLoading && faqError && (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-white/35">
                <AlertCircle size={28} className="opacity-30" />
                <p className="text-xs">Failed to fetch analytics data.</p>
                <button onClick={fetchFaqs} className="text-[11px] text-violet-400 underline underline-offset-2 hover:text-violet-300">
                  Retry
                </button>
              </div>
            )}

            {/* Empty */}
            {!faqLoading && !faqError && filteredFaqs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-white/30">
                <Hash size={26} className="opacity-20" />
                <p className="text-xs">{faqSearch ? "No questions match." : "No query data yet."}</p>
              </div>
            )}

            {/* Rows */}
            {!faqLoading && !faqError && filteredFaqs.length > 0 && (
              <div className="flex flex-col">
                <AnimatePresence initial={false}>
                  {filteredFaqs.map((faq, i) => {
                    const pct   = Math.max(3, (faq.count / maxCount) * 100);
                    const isTop = i === 0 && !faqSearch;
                    return (
                      <motion.div
                        key={faq.query}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-4 py-3 border-b border-white/[0.04] last:border-0 group/row hover:bg-white/[0.02] rounded-lg px-1 -mx-1 transition-colors"
                      >
                        {/* Rank */}
                        <span className={`w-7 text-center text-[11px] font-bold tabular-nums shrink-0 ${
                          isTop   ? "text-amber-400"
                          : i < 3 ? "text-white/40"
                          :         "text-white/18"
                        }`}>
                          #{i + 1}
                        </span>

                        {/* Query + bar */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white/80 truncate mb-1.5 group-hover/row:text-white transition-colors">
                            {faq.query}
                          </p>
                          <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${
                                isTop
                                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                  : "bg-gradient-to-r from-violet-400/50 to-fuchsia-400/50"
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.035 }}
                            />
                          </div>
                        </div>

                        {/* Count */}
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tabular-nums shrink-0 ${
                          isTop
                            ? "bg-violet-500/15 border border-violet-500/20 text-violet-300"
                            : "bg-white/[0.04] border border-white/[0.07] text-white/40"
                        }`}>
                          <TrendingUp size={9} className={isTop ? "text-violet-400" : "text-white/25"} />
                          {faq.count}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          {!faqLoading && !faqError && faqs.length > 0 && (
            <div className="px-6 py-2.5 border-t border-white/[0.05] bg-white/[0.015] flex items-center justify-between">
              <span className="text-[10px] text-white/25">
                Showing {filteredFaqs.length} of {faqs.length}
              </span>
              <span className="text-[10px] text-white/25">
                Σ {totalQueries.toLocaleString()} total queries
              </span>
            </div>
          )}
        </motion.div>

        {/* ── System Latency Logs ─────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden relative shadow-xl shadow-black/20"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-blue-500/70 via-indigo-500/50 to-violet-500/30" />

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Activity size={16} className="text-blue-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white/90">System Latency Logs</h2>
                <p className="text-[11px] text-white/35 mt-0.5">
                  Real-time monitoring of AI Engine response times.
                </p>
              </div>
            </div>

            <button
              onClick={fetchMonitoring}
              disabled={monitoringLoading}
              className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/40 hover:text-white/80 transition-all"
              title="Refresh Logs"
            >
              <RefreshCw size={13} className={monitoringLoading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Body */}
          <div className="p-0 overflow-x-auto">
            {monitoringLoading ? (
              <div className="px-6 py-8 flex items-center justify-center">
                <Loader2 size={24} className="text-white/20 animate-spin" />
              </div>
            ) : monitoringLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-white/30">
                <Activity size={26} className="opacity-20" />
                <p className="text-xs">No response logs recorded.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-6 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-wider">Session ID</th>
                    <th className="px-6 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-wider">User Query</th>
                    <th className="px-6 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-wider text-right">Response Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {monitoringLogs.map((log, i) => {
                    const dt = new Date(log.timestamp * 1000);
                    const isFast = log.response_time_ms < 1000;
                    const isSlow = log.response_time_ms > 2000;
                    
                    return (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-3 whitespace-nowrap">
                          <span className="text-xs text-white/40 bg-white/[0.04] px-2 py-0.5 rounded font-mono">
                            {dt.toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <span className="text-[10px] text-white/30 font-mono">
                            {log.chatId.split('-')[0]}...
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-xs font-medium text-white/75 truncate block max-w-[300px]">
                            {log.question}
                          </span>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-right">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums border ${
                            isFast ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                            isSlow ? "bg-red-500/10 border-red-500/20 text-red-400" :
                            "bg-amber-500/10 border-amber-500/20 text-amber-400"
                          }`}>
                            {log.response_time_ms.toFixed(1)} ms
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
