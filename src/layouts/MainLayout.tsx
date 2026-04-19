import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Activity, Cpu, Database, Home } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function MainLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
  ];

  return (
    <div className="flex h-screen w-full flex-col font-sans bg-[#080808] text-[#f0f0f0] overflow-hidden">
      {/* Global Top Navbar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#2b2b2b] bg-[#101010]/80 backdrop-blur-md px-6 z-50">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#0c0c0c] border border-[#2b2b2b]">
              <Activity className="h-4 w-4 text-[#00ff66]" />
            </div>
            <h1 className="font-mono text-lg font-bold tracking-tight text-[#f0f0f0]">YOLOv11 Dashboard</h1>
          </Link>
          
          <nav className="hidden md:flex ml-4 gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-1.5 text-sm font-mono transition-colors rounded-md",
                    isActive ? "text-[#00ff66]" : "text-[#777] hover:text-[#f0f0f0] hover:bg-[#161616]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 border border-[#00ff66]/30 bg-[#00ff66]/10 rounded-md"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs text-[#909090]">
          <div className="flex items-center gap-2 bg-[#161616] px-3 py-1.5 rounded-full border border-[#2b2b2b]">
            <Cpu className="h-3.5 w-3.5 text-[#00ff66]" />
            <span>YOLOv11-N</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
