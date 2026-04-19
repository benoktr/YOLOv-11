import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Zap, ArrowRight, ScanLine } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#080808]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00ff66]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#00ff66]/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjMTExIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDQwaDQwbS00MCAwVjBIMHoiLz48L2c+PC9zdmc+')] opacity-50" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0c0c0c] border border-[#2b2b2b] shadow-[0_0_40px_rgba(0,255,102,0.2)] mb-8"
          >
            <ScanLine className="h-8 w-8 text-[#00ff66]" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-sans font-bold tracking-tighter text-white mb-6 uppercase"
          >
            High-Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff66] to-[#00b347]">Disease Detection</span><br/> in Greenhouse Vegetables using YOLOv11
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[#909090] font-mono max-w-2xl mb-10 leading-relaxed"
          >
            Deploy lightweight YOLOv11 architectures for real-time greenhouse disease detection.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link 
              to="/dashboard" 
              className="group relative flex items-center justify-center gap-2 bg-[#00ff66] text-[#000] px-8 py-4 rounded-lg font-mono font-bold tracking-wide transition-all hover:bg-[#00e65c] hover:scale-105 shadow-[0_0_20px_rgba(0,255,102,0.3)]"
            >
               Enter Inference Engine
               <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#0c0c0c] border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: Zap, 
              title: "Ultra-Fast Inference", 
              desc: "Optimized bounding box projections via simulated native edge capabilities down to 45ms."
            },
            { 
              icon: ShieldCheck, 
              title: "Preventative Telemetry", 
              desc: "Instant contextual generation of agro-botanical prevention tips alongside detection."
            },
            { 
              icon: Activity, 
              title: "High-Confidence Scanning", 
              desc: "Deep visual feature extraction mimics the highly-rated mAP 50-95 capability of YOLOv11."
            }
          ].map((feat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              key={i} 
              className="bg-[#161616] p-8 rounded-xl border border-[#2b2b2b] hover:border-[#00ff66]/50 transition-colors group"
            >
              <div className="h-12 w-12 rounded-lg bg-[#202020] border border-[#333] flex items-center justify-center mb-6 group-hover:bg-[#00ff66]/10 group-hover:border-[#00ff66]/30 transition-colors">
                 <feat.icon className="h-6 w-6 text-[#777] group-hover:text-[#00ff66] transition-colors" />
              </div>
              <h3 className="text-xl font-bold font-sans text-white mb-3 tracking-tight">{feat.title}</h3>
              <p className="text-[#909090] font-mono text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
