"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, Bot, Database, Zap, Server, Code2, 
  Layers, FileText, Users, ShieldCheck, Activity, 
  Cpu, Lock, Search, Network 
} from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="relative min-h-screen bg-[hsl(240,10%,4%)] overflow-hidden flex flex-col text-white">
      {/* ── Dynamic Ambient Background ─────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/30 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] bg-violet-900/20 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────────────── */}
      <nav className="relative z-20 w-full flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10">
            <Bot size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white/95">Cortix AI</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/team" className="text-sm font-medium text-white/50 hover:text-white transition-colors">
            Architecture Team
          </Link>
          <Link href="/chat">
            <button className="px-5 py-2.5 text-sm font-semibold bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 rounded-full transition-all backdrop-blur-md text-white hover:border-white/20">
              Launch App
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 max-w-5xl mx-auto text-center pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]"></span>
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">Cortix Pipeline v1.0 Live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-white/95"
        >
          Enterprise Knowledge,
          <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400"> Instantly Accessible.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mb-12 leading-relaxed"
        >
          Deploy context-aware AI models over your private corporate data. Featuring semantic caching, query rewriting, and cross-encoder reranking powered by Chroma DB and OpenAI.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/chat">
            <button className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
              <span className="relative z-10">Launch Workspace</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/team">
            <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 font-medium rounded-full transition-all text-white backdrop-blur-md flex items-center gap-2 hover:border-white/20">
              <Users size={18} className="text-white/60" />
              Meet the Team
            </button>
          </Link>
        </motion.div>
      </main>

      {/* ── Enterprise Metrics Bar ────────────────────────────────────────────── */}
      <motion.section 
        variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        className="relative z-10 max-w-6xl mx-auto px-6 mb-32 w-full"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05] border border-white/[0.08] rounded-3xl overflow-hidden backdrop-blur-sm">
          {[
            { value: "< 50ms", label: "Cache Hit Latency" },
            { value: "100%", label: "Data Encryption" },
            { value: "0 shot", label: "Query Expansion" },
            { value: "Infinite", label: "Context Window" },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp} className="bg-[hsl(240,10%,4%)] p-8 text-center flex flex-col justify-center">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50 mb-2">{stat.value}</div>
              <div className="text-xs font-semibold tracking-wider text-white/40 uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Pipeline Architecture ─────────────────────────────────────────────── */}
      <motion.section 
        variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 max-w-6xl mx-auto px-6 mb-32 w-full"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white/95 mb-4">Advanced RAG Pipeline</h2>
          <p className="text-white/50 max-w-2xl mx-auto">Cortix employs a multi-stage retrieval augmented generation process to ensure hallucination-free, highly relevant answers.</p>
        </div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-[50%] left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/0 via-indigo-500/50 to-purple-500/0 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {/* Step 1 */}
            <PipelineCard 
              step="01" icon={<Search className="text-blue-400" />} title="Semantic Routing" 
              desc="Queries are intercepted by a router that checks the In-Memory cache for exact semantic matches."
            />
            {/* Step 2 */}
            <PipelineCard 
              step="02" icon={<Network className="text-indigo-400" />} title="Query Rewriting" 
              desc="Raw prompts are expanded and optimized for dense vector retrieval across your documents."
            />
            {/* Step 3 */}
            <PipelineCard 
              step="03" icon={<Layers className="text-violet-400" />} title="Vector Search" 
              desc="Chroma DB rapidly surfacing nearest-neighbor context chunks using OpenAI embeddings."
            />
            {/* Step 4 */}
            <PipelineCard 
              step="04" icon={<Zap className="text-fuchsia-400" />} title="Flash Reranking" 
              desc="A Cross-Encoder model re-scores the retrieved chunks to guarantee maximum injection relevance."
            />
          </div>
        </div>
      </motion.section>

      {/* ── Feature Grids ─────────────────────────────────────────────────────── */}
      <motion.section 
        variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 max-w-6xl mx-auto px-6 w-full"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white/95 mb-4">Core Infrastructure</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Database className="text-blue-400" />} title="Chroma DB Vector Store"
            description="High-performance, in-memory vector database for storing and querying OpenAI document embeddings."
          />
          <FeatureCard 
            icon={<Cpu className="text-indigo-400" />} title="FastAPI Backend"
            description="Highly concurrent asynchronous Python architecture handling thousands of LLM requests effortlessly."
          />
          <FeatureCard 
            icon={<Activity className="text-violet-400" />} title="In-Memory Cache"
            description="Caches semantically similar queries directly in-process to drastically reduce OpenAI API costs."
          />
          <FeatureCard 
            icon={<Code2 className="text-emerald-400" />} title="Prompt Engineering"
            description="Sophisticated system prompts that strictly constrain the AI to answer only from provided context."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-amber-400" />} title="Enterprise Security"
            description="Complete data isolation, private document embedding, and no telemetric leakages to public loops."
          />
          <FeatureCard 
            icon={<Bot className="text-pink-400" />} title="OpenAI Intelligence"
            description="Leverages GPT-based foundational models for precise, natural-language synthesis of document facts."
          />
        </div>
      </motion.section>

      {/* ── Call to Action ──────────────────────────────────────────────────────── */}
      <motion.section 
        variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 w-full px-6 py-32 border-t border-white/[0.04] bg-white/[0.01]"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight text-white/95 mb-6">
            Ready to upgrade your knowledge retrieval?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">
            Experience the power of semantic caching, intelligent reranking, and private document extraction with the Cortix AI Engine today.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/chat">
              <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                Launch Workspace
              </button>
            </Link>
            <Link href="/admin">
              <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 font-medium rounded-full transition-all text-white backdrop-blur-md hover:border-white/20">
                Go to Admin Console
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Footer ──────────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 w-full mt-auto border-t border-white/[0.06] bg-black/40 pt-16 pb-8 px-6 text-center md:text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Bot size={18} className="text-indigo-400" />
            <span className="font-semibold text-white/80 tracking-tight">Cortix AI Enterprise</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" /> Private by Design
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" /> High Performance
            </span>
            <span className="flex items-center gap-1.5">
              <Database size={14} className="text-blue-400" /> Distributed Architecture
            </span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 flex flex-col items-center sm:flex-row sm:justify-between text-xs text-white/25">
          <p>© 2026 Cortix Intelligence. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">Powered by <Zap size={10} className="text-amber-400" /> FastAPI &amp; Next.js</p>
        </div>
      </footer>
    </div>
  );
}

// ── Components ───────────────────────────────────────────────────────────────

function PipelineCard({ step, icon, title, desc }: { step: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90 } }
      }}
      className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-3xl backdrop-blur-md relative overflow-hidden group hover:bg-white/[0.06] transition-colors"
    >
      <div className="absolute -top-4 -right-4 text-white/[0.02] text-8xl font-black italic pointer-events-none group-hover:scale-110 transition-transform">
        {step}
      </div>
      <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative z-10 shadow-lg group-hover:glow transition-all">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white/90 mb-2 relative z-10">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed relative z-10">{desc}</p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
      }}
      className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 group"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="h-10 w-10 rounded-xl bg-white/[0.05] flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform shrink-0">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-white/90">{title}</h3>
      </div>
      <p className="text-white/40 leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}
