"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Globe, Briefcase, Code, Terminal, Server, Shield, Layers, Database } from "lucide-react";

export default function ResumePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center pb-32">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[60%] bg-blue-900/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[10%] left-[-20%] w-[40%] h-[50%] bg-purple-900/20 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl px-6 pt-12">
        <Link href="/">
          <button className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12">
            <ArrowLeft size={16} />
            <span className="font-medium text-sm">Back to Platform</span>
          </button>
        </Link>

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Header Section */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
              <Code size={14} className="text-blue-400" />
              <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Lead Architect / Developer</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Naseefu Rahman 
              <br/>
              <span className="text-white/40 font-semibold text-3xl md:text-5xl">Karumannil Hajiyarpalli</span>
            </h1>
            
            <p className="text-xl text-blue-300/80 mb-8 font-medium">Product Engineer | Java Spring Boot Developer</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <ContactPill icon={<MapPin size={16} />} text="Malappuram, Kerala 676519" />
              <ContactPill icon={<Phone size={16} />} text="7994529046" />
              <ContactPill icon={<Mail size={16} />} text="naseefrahman90@gmail.com" />
              <ContactPill icon={<Globe size={16} />} text="linkedin/in/naseefu" link="https://linkedin.com/in/naseefu-rahman-karumannil" />
              <ContactPill icon={<Code size={16} />} text="github/naseefu" link="https://github.com/naseefu" />
              <ContactPill icon={<Globe size={16} />} text="portfolio/naseefu" link="#" />
            </div>
          </motion.div>

          <hr className="border-white/10 mb-16" />

          {/* Professional Experience */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="text-purple-400" size={24} />
              <h2 className="text-2xl font-bold">Experience</h2>
            </div>
            
            <div className="relative pl-8 border-l border-white/10 space-y-12">
              <div className="relative">
                <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full bg-black border-2 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">Tata Consultancy Services (TCS)</h3>
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-white/5 text-white/60 w-fit mt-2 md:mt-0">Jan 2025 – Present</span>
                </div>
                <h4 className="text-lg text-purple-300/80 mb-4 font-medium">Product Engineer / Java Spring Boot Developer</h4>
                <p className="text-white/60 leading-relaxed font-light">
                  Architecting and engineering enterprise-grade backend infrastructure and modern scalable applications using the Java ecosystem. Integrating robust messaging systems and implementing cloud-native patterns for high availability and performance.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Technical Skills */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-8">
              <Terminal className="text-blue-400" size={24} />
              <h2 className="text-2xl font-bold">Core Expertise</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SkillCard title="Backend Engineering" icon={<Server className="text-emerald-400" size={20} />} skills={["Java", "Spring Boot", "Spring MVC", "JPA/Hibernate"]} />
              <SkillCard title="Messaging & Stream" icon={<Layers className="text-blue-400" size={20} />} skills={["Apache Kafka", "ActiveMQ", "IBM MQ"]} />
              <SkillCard title="Database Systems" icon={<Database className="text-yellow-400" size={20} />} skills={["MySQL", "PostgreSQL", "MongoDB"]} />
              <SkillCard title="Security" icon={<Shield className="text-pink-400" size={20} />} skills={["JWT Authentication", "Keycloak IAM"]} />
              <SkillCard title="Cloud Native" icon={<Globe className="text-indigo-400" size={20} />} skills={["Spring Eureka", "API Gateway", "Resilience4j"]} />
              <SkillCard title="DevOps & Tooling" icon={<Code className="text-purple-400" size={20} />} skills={["Docker", "Git", "Maven"]} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function ContactPill({ icon, text, link }: { icon: React.ReactNode, text: string, link?: string }) {
  const content = (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
      <span className="text-white/50">{icon}</span>
      <span>{text}</span>
    </div>
  );

  return link ? <a href={link} target="_blank" rel="noopener noreferrer">{content}</a> : content;
}

function SkillCard({ title, skills, icon }: { title: string, skills: string[], icon: React.ReactNode }) {
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="font-semibold text-white/90">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className="px-2.5 py-1 text-xs font-medium bg-black/50 border border-white/10 rounded uppercase tracking-wider text-white/70">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
