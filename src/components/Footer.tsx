import React from 'react';
import { Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Cpu className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                ResumeScan AI
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Optimized Resume Building & Scanning
              </p>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center max-w-md">
            ResumeScan AI uses local heuristic semantic intelligence to help candidates check formatting compliance and key-phrase match density. Fully private and free.
          </p>

          {/* Socials & Contact */}
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="p-2 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="#" 
              className="p-2 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a 
              href="mailto:contact@resumescanai.com" 
              className="p-2 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              aria-label="Email"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </a>
          </div>

        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} ResumeScan AI. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Contact Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
