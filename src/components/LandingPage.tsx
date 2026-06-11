"use client";

import React from 'react';
import { FileText, Compass, Sparkles, CheckCircle2, Shield, Zap, RefreshCw, Cpu, Award } from 'lucide-react';

interface LandingPageProps {
  setView: (view: string) => void;
}

export default function LandingPage({ setView }: LandingPageProps) {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#090d16] overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-violet-500/10 dark:bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free & No Sign-up Required</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
            Create ATS-Friendly Resumes and <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 dark:from-indigo-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
              Check ATS Score Free
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2.5xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-350 leading-relaxed mb-10">
            Audit your resume against applicant tracking systems (ATS). Build an optimized professional resume from scratch or parse your existing PDF/DOCX to get instant analysis, suggestions, and job matching scores.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4.5 max-w-md mx-auto">
            <button
              onClick={() => setView('builder')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-98 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <FileText className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              Build Resume
            </button>
            <button
              onClick={() => setView('checker')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-md active:scale-98 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              Check ATS Score
            </button>
          </div>

          {/* Micro Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-500" />
              <span>Fully Secure & Private</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Instant Local Analysis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-emerald-500" />
              <span>Unlimited Scans & Re-exports</span>
            </div>
          </div>

        </div>
      </section>

      {/* Visual Demo Card Mockup */}
      <section className="px-4 pb-20 md:pb-28">
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 sm:p-8 shadow-2xl relative overflow-hidden glass-panel">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 dark:bg-violet-600/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Mock ATS Score */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-[10px] font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-2">
                ATS Engine Preview
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Understand How Recruiter Software Rates You
              </h3>
              
              <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle 
                    cx="80" 
                    cy="80" 
                    r="68" 
                    className="stroke-slate-100 dark:stroke-slate-800" 
                    strokeWidth="12" 
                    fill="transparent" 
                  />
                  <circle 
                    cx="80" 
                    cy="80" 
                    r="68" 
                    className="stroke-indigo-600 dark:stroke-indigo-500 transition-all duration-1000" 
                    strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 68}
                    strokeDashoffset={2 * Math.PI * 68 * (1 - 0.82)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">82</span>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Score / 100</span>
                </div>
              </div>

              <div className="px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                Grade B+ • Very Strong
              </div>
            </div>

            {/* Right Column: Strengths & Suggestions Mock */}
            <div className="md:col-span-7 space-y-5 text-left w-full border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8">
              
              <div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Key Strengths
                </h4>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <p className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span> Contact details complete & parseable
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span> Standard structural headings found
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span> Rich skills density detected
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-500 animate-bounce" />
                  Critical Recommendations
                </h4>
                <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="p-2.5 rounded-lg bg-indigo-50/40 dark:bg-indigo-950/15 border border-indigo-100/30">
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-0.5">Add Quantifiable Results</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">Rewrite bullet points using metrics. (e.g. "Increased conversion rate by 22%")</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-50/40 dark:bg-indigo-950/15 border border-indigo-100/30">
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-0.5">Missing Technical Keywords</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">Missing: React, TypeScript, and Docker (based on standard job matching templates).</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="bg-slate-100/50 dark:bg-[#070a10] border-t border-b border-slate-200/50 dark:border-slate-800/40 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3.5xl font-extrabold text-slate-900 dark:text-white mt-2">
              Everything You Need to Beat the Resume Filters
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-3">
              Most companies use automated scrapers. ResumeScan AI uses the same rules to ensure your resume renders and parses flawlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                ATS-Friendly Builder
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed mb-4 flex-1">
                Fill in details inside a simple form and view a real-time, clean, single-column resume preview. Strictly formatted to bypass layout parsing errors.
              </p>
              <button 
                onClick={() => setView('builder')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1.5 group/btn cursor-pointer"
              >
                Launch Builder
                <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
              </button>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                0-100 ATS Score Checker
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed mb-4 flex-1">
                Upload your PDF or DOCX file. Our engine analyzes headings, contacts, action verbs, quantitative metrics, and format styles to grade it.
              </p>
              <button 
                onClick={() => setView('checker')}
                className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-500 flex items-center gap-1.5 group/btn cursor-pointer"
              >
                Scan Resume
                <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
              </button>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Job Description Matcher
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed mb-4 flex-1">
                Paste the job description. The engine will extract critical keywords, measure your overlap score, and highlight missing skills you must append.
              </p>
              <button 
                onClick={() => setView('checker')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1.5 group/btn cursor-pointer"
              >
                Match Job Posting
                <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
              </button>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
