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
} from "lucide-react";
import { chatApi } from "@/lib/api";

type LocalDoc = { id: string; name: string };
type FaqItem  = { query: string; count: number };

export default function AdminPage() {
  // ── Documents state ─────────────────────────────────────────────────────────
  const [documents, setDocuments]     = useState<LocalDoc[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── FAQ analytics state ──────────────────────────────────────────────────────
  const [faqs, setFaqs]               = useState<FaqItem[]>([]);
  const [totalUnique, setTotalUnique] = useState<number>(0);
  const [faqLoading, setFaqLoading]   = useState(true);
  const [faqError, setFaqError]       = useState(false);
  const [faqSearch, setFaqSearch]     = useState("");

  // ── Fetch helpers ────────────────────────────────────────────────────────────
  const fetchDocs = async () => {
    try {
      const res = await chatApi.getDocuments();
      if (res?.documents) setDocuments(res.documents);
    } catch (e) { console.error(e); }
  };

  const fetchFaqs = useCallback(async () => {
    setFaqLoading(true);
    setFaqError(false);
    try {
      const data = await chatApi.getFaqAnalytics();
      setFaqs(data.faqs ?? []);
      setTotalUnique(data.total_unique ?? 0);
    } catch {
      setFaqError(true);
    } finally {
      setFaqLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
    fetchFaqs();
  }, [fetchFaqs]);

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      await chatApi.uploadFile({ file, chatId: null });
      await fetchDocs();
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Are you sure you want to completely delete this document from the Vector node?")) return;
    try {
      await chatApi.deleteDocument(docId);
      await fetchDocs();
    } catch (error) { console.error("Failed to delete document", error); }
  };

  // ── Derived ───────────────────────────────────────────────────────────────────
  const filteredFaqs = faqs.filter(f =>
    f.query.toLowerCase().includes(faqSearch.toLowerCase())
  );
  const maxCount = faqs[0]?.count ?? 1; // faqs arrive sorted desc from API

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col p-8">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/30 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-10">

        {/* ── Navbar ────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/chat">
              <button className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <ArrowLeft size={18} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Cortix AI Console</h1>
              <p className="text-sm text-white/50">Infrastructure &amp; Data Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">System Online</span>
          </div>
        </div>

        {/* ── Top grid: Knowledge DB + Upload ───────────────────────────────── */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Knowledge DB */}
          <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col overflow-hidden relative shadow-2xl shadow-blue-500/10">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
              <div className="flex items-center gap-3 mb-6">
                <Database className="text-blue-400" />
                <h2 className="text-lg font-semibold">Knowledge Graph Database</h2>
              </div>
              <div className="flex-1 w-full border border-white/5 rounded-xl bg-black/40 overflow-hidden">
                {documents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-white/40">
                    <Box size={32} className="mb-3 opacity-20" />
                    <p>No documents deployed to Cortix node yet.</p>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                          <th className="px-6 py-4 font-medium text-white/60">Document Name</th>
                          <th className="px-6 py-4 font-medium text-white/60">System UUID</th>
                          <th className="px-6 py-4 font-medium text-white/60 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {documents.map((doc, i) => (
                          <motion.tr
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group hover:bg-white/5 transition-colors"
                          >
                            <td className="px-6 py-4 font-medium text-blue-100 flex items-center gap-3">
                              <FileText size={16} className="text-blue-500/60" />
                              {doc.name}
                            </td>
                            <td className="px-6 py-4 text-white/30 font-mono text-xs">{doc.id}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-3">
                                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold whitespace-nowrap">
                                  Synchronized
                                </span>
                                <button
                                  onClick={() => handleDelete(doc.id)}
                                  className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                  title="Delete Document"
                                >
                                  <Trash2 size={16} />
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
            </div>

            {/* System status mini cards */}
            <div className="grid grid-cols-2 gap-6">
              {/* FlashRank Reranker */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-amber-500/50 to-orange-500/50" />
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Zap size={16} className="text-amber-400" />
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="text-xl font-bold tracking-tight mb-1">FlashRank</div>
                <div className="text-sm text-white/50">Cross-Encoder Reranker</div>
                <div className="mt-3 text-[11px] text-white/30 leading-relaxed">
                  Re-scores retrieved chunks for maximum relevance before generation.
                </div>
              </div>

              {/* In-Memory Semantic Cache */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-cyan-500/50 to-teal-500/50" />
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <Layers size={16} className="text-cyan-400" />
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="text-xl font-bold tracking-tight mb-1">In-Memory Cache</div>
                <div className="text-sm text-white/50">Semantic Query Cache</div>
                <div className="mt-3 text-[11px] text-white/30 leading-relaxed">
                  Caches semantically similar queries in-process to cut LLM costs &amp; latency.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upload */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group shadow-2xl shadow-emerald-500/5">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl font-semibold mb-2">Ingest Data</h3>
              <p className="text-sm text-white/50 mb-6 leading-relaxed">
                Upload PDFs or DOCX files into the Qdrant cluster for instant vectorization across all LLMs.
              </p>
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="w-full h-56 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-4 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all outline-none"
              >
                {isUploading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
                    <Loader2 size={36} className="text-emerald-400" />
                  </motion.div>
                ) : (
                  <UploadCloud size={36} className="text-white/40 group-hover:text-emerald-400 transition-colors" />
                )}
                <div className="text-center">
                  <span className="font-semibold text-sm block mb-1">
                    {isUploading ? "Vectorizing Content..." : "Click to select a file"}
                  </span>
                  <span className="text-xs text-white/40">PDF, DOCX up to 50MB</span>
                </div>
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* ── FAQ Analytics Section ─────────────────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden relative shadow-2xl shadow-violet-500/10"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-7 pb-5 border-b border-white/[0.07]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <BarChart2 size={20} className="text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold leading-tight">Frequently Asked Questions</h2>
                <p className="text-xs text-white/40 mt-0.5">
                  {faqLoading ? "Loading…" : `${totalUnique} unique question${totalUnique !== 1 ? "s" : ""} tracked across all sessions`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                <input
                  value={faqSearch}
                  onChange={e => setFaqSearch(e.target.value)}
                  placeholder="Filter questions…"
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.09] text-xs text-white/80 placeholder:text-white/25 outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 w-48 transition-all"
                />
              </div>

              {/* Refresh */}
              <button
                onClick={fetchFaqs}
                disabled={faqLoading}
                className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.09] hover:bg-white/[0.1] text-white/50 hover:text-white transition-all"
                title="Refresh"
              >
                <RefreshCw size={14} className={faqLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {/* Loading skeleton */}
            {faqLoading && (
              <div className="flex flex-col gap-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-6 h-4 bg-white/10 rounded" />
                    <div className="flex-1 h-4 bg-white/10 rounded" style={{ maxWidth: `${70 - i * 10}%` }} />
                    <div className="w-10 h-4 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {!faqLoading && faqError && (
              <div className="flex flex-col items-center justify-center py-12 text-white/40 gap-3">
                <TrendingUp size={32} className="opacity-20" />
                <p className="text-sm">Failed to load analytics data.</p>
                <button
                  onClick={fetchFaqs}
                  className="text-xs text-violet-400 hover:text-violet-300 underline underline-offset-2"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty */}
            {!faqLoading && !faqError && filteredFaqs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-white/40 gap-3">
                <Hash size={32} className="opacity-20" />
                <p className="text-sm">
                  {faqSearch ? "No questions match your filter." : "No queries recorded yet."}
                </p>
              </div>
            )}

            {/* FAQ rows */}
            {!faqLoading && !faqError && filteredFaqs.length > 0 && (
              <div className="flex flex-col divide-y divide-white/[0.05]">
                <AnimatePresence initial={false}>
                  {filteredFaqs.map((faq, i) => {
                    const barPct = Math.max(4, (faq.count / maxCount) * 100);
                    const isTop = i === 0 && !faqSearch;

                    return (
                      <motion.div
                        key={faq.query}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.035 }}
                        className="flex items-center gap-4 py-3.5 group/row"
                      >
                        {/* Rank */}
                        <span className={`w-6 text-center text-xs font-bold tabular-nums shrink-0 ${
                          isTop ? "text-amber-400" : i === 1 ? "text-white/50" : i === 2 ? "text-white/35" : "text-white/20"
                        }`}>
                          #{i + 1}
                        </span>

                        {/* Query text + bar */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/85 truncate mb-1.5 group-hover/row:text-white transition-colors">
                            {faq.query}
                          </p>
                          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${
                                isTop
                                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                  : "bg-gradient-to-r from-violet-500/60 to-fuchsia-500/60"
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${barPct}%` }}
                              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.04 }}
                            />
                          </div>
                        </div>

                        {/* Count badge */}
                        <div className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold tabular-nums ${
                          isTop
                            ? "bg-violet-500/15 border border-violet-500/25 text-violet-300"
                            : "bg-white/[0.05] border border-white/[0.08] text-white/50"
                        }`}>
                          <TrendingUp size={10} className={isTop ? "text-violet-400" : "text-white/30"} />
                          {faq.count}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer summary */}
          {!faqLoading && !faqError && faqs.length > 0 && (
            <div className="px-6 py-3 border-t border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
              <span className="text-xs text-white/30">
                Showing {filteredFaqs.length} of {faqs.length} questions
              </span>
              <span className="text-xs text-white/30">
                Total queries: <span className="text-white/55 font-medium">
                  {faqs.reduce((a, b) => a + b.count, 0).toLocaleString()}
                </span>
              </span>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
