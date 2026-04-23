"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, UploadCloud, FileText, Database, Shield, Server, Box, Loader2, Trash2 } from "lucide-react";
import { chatApi } from "@/lib/api";

type LocalDoc = { id: string; name: string };

export default function AdminPage() {
  const [documents, setDocuments] = useState<LocalDoc[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocs = async () => {
    try {
      const res = await chatApi.getDocuments();
      if (res && res.documents) {
        setDocuments(res.documents);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await chatApi.uploadFile({ file, chatId: null });
      // Refresh the view so the admin can see their recently uploaded file
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
    } catch (error) {
      console.error("Failed to delete document", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col p-8">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/30 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col flex-1">
        
        {/* Navbar */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link href="/chat">
              <button className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <ArrowLeft size={18} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Cortix AI Console</h1>
              <p className="text-sm text-white/50">Infrastructure & Data Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium">System Online</span>
            </div>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Monitor (Left & Center) */}
          <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col overflow-hidden relative shadow-2xl shadow-blue-500/10">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              
              <div className="flex items-center gap-3 mb-6">
                <Database className="text-blue-400" />
                <h2 className="text-lg font-semibold">Knowledge Graph Database</h2>
              </div>

              <div className="flex-1 w-full border border-white/5 rounded-xl bg-black/40 overflow-hidden">
                {documents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground w-full">
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
                            <td className="px-6 py-4 text-right flex items-center justify-end gap-3 h-full min-h-[56px]">
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold whitespace-nowrap">
                                Synchronized
                              </span>
                              <button 
                                onClick={() => handleDelete(doc.id)} 
                                className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors group/btn"
                                title="Delete Document"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            
            {/* System Status Cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <Shield className="text-emerald-400 mb-3" />
                <div className="text-2xl font-bold tracking-tight mb-1">Active</div>
                <div className="text-sm text-white/50">Multi-Tenant Isolation</div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <Server className="text-purple-400 mb-3" />
                <div className="text-2xl font-bold tracking-tight mb-1">0.8ms</div>
                <div className="text-sm text-white/50">Kafka Latency</div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar Upload (Right) */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group shadow-2xl shadow-emerald-500/5">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <h3 className="text-xl font-semibold mb-2">Ingest Data</h3>
              <p className="text-sm text-white/50 mb-6 leading-relaxed">Upload PDFs or DOCX files into the Qdrant cluster for instant vectorization across all LLMs.</p>

              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
              />
              
              <button 
                onClick={handleUploadClick}
                disabled={isUploading}
                className="w-full h-56 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-4 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all outline-none"
              >
                {isUploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                  >
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
      </div>
    </div>
  );
}
