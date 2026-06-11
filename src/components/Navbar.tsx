"use client";

import React from 'react';
import { FileText, Cpu, Compass } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
}

export default function Navbar({ currentView, setView }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => setView('landing')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 dark:shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Cpu className="w-5.5 h-5.5 group-hover:rotate-12 transition-transform" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-400 rounded-full border border-white dark:border-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              ResumeScan
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              AI ATS Engine
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => setView('landing')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              currentView === 'landing' 
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
            }`}
          >
            Home
          </button>
          
          <button
            onClick={() => setView('builder')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
              currentView === 'builder' 
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
            }`}
          >
            <FileText className="w-4 h-4" />
            Resume Builder
          </button>

          <button
            onClick={() => setView('checker')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
              currentView === 'checker' || currentView === 'results'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
            }`}
          >
            <Compass className="w-4 h-4" />
            ATS Score Checker
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          <button
            onClick={() => setView(currentView === 'builder' ? 'checker' : 'builder')}
            className="hidden sm:inline-flex items-center justify-center px-4.5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
          >
            {currentView === 'builder' ? 'Scan Resume' : 'Build Resume'}
          </button>
        </div>

      </div>
    </header>
  );
}
