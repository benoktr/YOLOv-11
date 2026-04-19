import React from 'react';
import { motion } from 'motion/react';
import { Database, TrendingUp, Cpu, Server, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Models() {
  const models = [
    {
      name: "YOLOv11-N",
      type: "Nano",
      params: "2.5M",
      flops: "6.5G",
      map50_95: "39.5",
      latency: "1.2ms",
      status: "Active (Simulated)",
      color: "#00ff66"
    },
    {
      name: "YOLOv11-S",
      type: "Small",
      params: "9.4M",
      flops: "24.5G",
      map50_95: "47.0",
      latency: "2.4ms",
      status: "Available via Upgrades",
      color: "#777777"
    },
    {
      name: "YOLOv11-M",
      type: "Medium",
      params: "20.1M",
      flops: "58.6G",
      map50_95: "51.1",
      latency: "4.7ms",
      status: "Available via Upgrades",
      color: "#777777"
    },
    {
      name: "YOLOv11-L",
      type: "Large",
      params: "25.3M",
      flops: "86.9G",
      map50_95: "52.7",
      latency: "5.8ms",
      status: "Available via Upgrades",
      color: "#777777"
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#080808] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-sans font-bold text-white tracking-tighter mb-4">Neural Architectures</h1>
          <p className="text-[#909090] font-mono text-sm max-w-2xl leading-relaxed">
            Comparison of available YOLOv11 model layers optimized for edge TPU inference or cloud hardware accelerators. Nano is currently loaded for the lowest latency feedback loop.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {models.map((model, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={cn(
                "bg-[#101010] border rounded-xl overflow-hidden flex flex-col",
                model.name === "YOLOv11-N" ? "border-[#00ff66]/40 shadow-[0_4px_30px_rgba(0,255,102,0.05)]" : "border-[#2b2b2b]"
              )}
            >
              <div className="p-6 border-b border-[#2b2b2b] flex justify-between items-start bg-[#161616]">
                 <div>
                   <h2 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
                     {model.name}
                     {model.name === "YOLOv11-N" && <Zap className="h-5 w-5 text-[#00ff66] fill-[#00ff66]/20" />}
                   </h2>
                   <p className="text-[#777] font-mono text-xs mt-1 uppercase tracking-widest">{model.status}</p>
                 </div>
                 <div className={cn("px-3 py-1 rounded font-mono text-xs border uppercase", 
                    model.name === "YOLOv11-N" ? "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/30" : "bg-[#202020] text-[#777] border-[#333]"
                 )}>
                   {model.type} Class
                 </div>
              </div>

              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-sm">
                 <div className="flex flex-col gap-1">
                    <span className="text-[#777] text-xs flex items-center gap-1"><Database className="h-3 w-3" /> Params</span>
                    <span className="text-[#f0f0f0] text-lg">{model.params}</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[#777] text-xs flex items-center gap-1"><Cpu className="h-3 w-3" /> FLOPs</span>
                    <span className="text-[#f0f0f0] text-lg">{model.flops}</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[#777] text-xs flex items-center gap-1"><TrendingUp className="h-3 w-3" /> mAP 50-95</span>
                    <span className="text-[#f0f0f0] text-lg">{model.map50_95}</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[#777] text-xs flex items-center gap-1"><Server className="h-3 w-3" /> T4 Latency</span>
                    <span className="text-[#f0f0f0] text-lg">{model.latency}</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
