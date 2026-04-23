"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Bot, Database, Zap, Server, Code2, Layers, FileText, Users } from "lucide-react";

export default function LandingPage() {
  // Stagger variants for the features list
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/40 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/30 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-indigo-900/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none z-0"></div>

      {/* Navigation */}
      <nav className="relative z-10 w-full flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bot size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white/90">Cortix AI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/team" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
            FS Architecture
          </Link>
          <Link href="/chat">
            <button className="px-5 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all backdrop-blur-md text-white">
              Launch App
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-w-5xl mx-auto text-center pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-xs font-medium text-white/80 uppercase tracking-widest">Cortix AI Engine v1.0 Live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
        >
          Enterprise AI,
          <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500"> Seamlessly Integrated.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mb-12 font-light leading-relaxed"
        >
          Deploy context-aware AI models over your private corporate data. Advanced document semantics, query rewriting, and intelligent reranking powered by OpenAI & Chroma DB.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/chat">
            <button className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
              <span className="relative z-10">Launch Workspace</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </Link>
          <Link href="/team">
            <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 font-medium rounded-full transition-all text-white backdrop-blur-md flex items-center gap-2 hover:border-white/20">
              <Users size={18} className="text-white/70" />
              Meet the Team
            </button>
          </Link>
        </motion.div>
      </main>

      {/* Feature Grids */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 max-w-6xl mx-auto px-6 pb-40 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Database className="text-blue-400" />}
            title="Semantic RAG"
            description="Deep understanding of documents via Chroma DB vector search and robust OpenAI embeddings."
          />
          <FeatureCard 
            icon={<Zap className="text-yellow-400" />}
            title="FastAPI Backend"
            description="High-performance asynchronous Python architecture for lightning-fast concurrent requests."
          />
          <FeatureCard 
            icon={<Code2 className="text-emerald-400" />}
            title="Query Rewriting"
            description="Intelligently synthesizes and expands user prompts to optimize dense vector retrieval."
          />
          <FeatureCard 
            icon={<Server className="text-pink-400" />}
            title="Semantic Cache"
            description="Caches semantically similar queries to drastically reduce OpenAI API costs and network latency."
          />
          <FeatureCard 
            icon={<Layers className="text-purple-400" />}
            title="Deep Reranking"
            description="Re-evaluates cross-encoder similarity contexts to surface only the most accurate document chunks."
          />
          <FeatureCard 
            icon={<Bot className="text-indigo-400" />}
            title="OpenAI Intelligence"
            description="Leverages the latest state-of-the-art OpenAI foundational models for precise summarization."
          />
        </div>
      </motion.section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
      }}
      className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
    >
      <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white/90 mb-2">{title}</h3>
      <p className="text-white/50 leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}
