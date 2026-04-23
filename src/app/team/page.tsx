"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Users, Terminal, Server, Layers, Database, Sparkles, BrainCircuit } from "lucide-react";

export default function TeamPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 70 } 
    }
  };

  const team = [
    { name: "Anish T", role: "Team Manager", icon: <Users size={24} className="text-emerald-400" /> },
    { name: "Naseefu Karumannil", role: "Backend Developer", icon: <Server size={24} className="text-blue-400" /> },
    { name: "Mohammed Saleekh", role: "Backend Developer", icon: <Terminal size={24} className="text-purple-400" /> },
    { name: "Vinu Ouseph", role: "Backend Developer", icon: <Database size={24} className="text-yellow-400" /> },
    { name: "Alyn Feby", role: "UI Developer", icon: <Layers size={24} className="text-pink-400" /> }
  ];

  const techStack = [
    { name: "OpenAI LLM", category: "Intelligence", color: "from-emerald-400/20 to-emerald-600/20", borderColor: "border-emerald-500/30" },
    { name: "OpenAI Embedding", category: "Vectorization", color: "from-blue-400/20 to-blue-600/20", borderColor: "border-blue-500/30" },
    { name: "FastAPI", category: "Backend Runtime", color: "from-teal-400/20 to-teal-600/20", borderColor: "border-teal-500/30" },
    { name: "ChromaDB", category: "Vector Database", color: "from-orange-400/20 to-orange-600/20", borderColor: "border-orange-500/30" },
    { name: "In-Memory DB", category: "Semantic Cache", color: "from-red-400/20 to-red-600/20", borderColor: "border-red-500/30" },
    { name: "NextJS 15", category: "Frontend Framework", color: "from-gray-400/20 to-gray-600/20", borderColor: "border-gray-500/30" },
    { name: "Framer Motion", category: "Micro-Animations", color: "from-purple-400/20 to-purple-600/20", borderColor: "border-purple-500/30" },
    { name: "Tailwind CSS", category: "Styling Engine", color: "from-cyan-400/20 to-cyan-600/20", borderColor: "border-cyan-500/30" }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-24">
        {/* Nav */}
        <Link href="/">
          <button className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-16">
            <ArrowLeft size={16} />
            Back to Launchpad
          </button>
        </Link>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20 text-center lg:text-left flex flex-col lg:flex-row justify-between items-center gap-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-6">
              <Sparkles size={14} /> Tata Consultancy Services
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-4 drop-shadow-2xl">
              FS Architecture <br className="hidden lg:block"/> & Technology
            </h1>
            <p className="text-xl text-white/50 max-w-2xl font-light">
              The engineering core behind Cortix AI. We build highly scalable, intelligent RAG architectures operating at the edge of performance.
            </p>
          </div>
          <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-blue-600/30 to-purple-600/30 flex items-center justify-center border border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.2)]">
            <BrainCircuit size={64} className="text-white/80" />
          </div>
        </motion.div>

        {/* Team Grid */}
        <div className="mb-24">
          <h2 className="text-2xl font-semibold mb-8 text-white/80 border-b border-white/10 pb-4">The Engineers</h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {team.map((member, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-crosshair overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300">
                      {member.name}
                    </h3>
                    <p className="text-white/50 text-sm font-medium">{member.role}</p>
                  </div>
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 group-hover:scale-110 transition-transform duration-300">
                    {member.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Tech Stack */}
        <div>
          <h2 className="text-2xl font-semibold mb-8 text-white/80 border-b border-white/10 pb-4">The Architecture Stack</h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {techStack.map((tech, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className={`p-5 rounded-2xl bg-gradient-to-br ${tech.color} border ${tech.borderColor} backdrop-blur-md relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-0"></div>
                <div className="relative z-10 text-center flex flex-col items-center justify-center h-full">
                  <h4 className="font-bold text-white mb-1 tracking-tight">{tech.name}</h4>
                  <p className="text-xs text-white/60 uppercase tracking-wider">{tech.category}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
