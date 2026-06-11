"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import LandingPage from '@/components/LandingPage';
import ResumeBuilder from '@/components/ResumeBuilder';
import AtsChecker from '@/components/AtsChecker';
import Footer from '@/components/Footer';

export default function Home() {
  const [view, setView] = useState<string>('landing');

  return (
    <div className="flex flex-col min-h-screen bg-slate-55 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar currentView={view} setView={setView} />
      
      <main className="flex-grow flex flex-col">
        {view === 'landing' && <LandingPage setView={setView} />}
        {view === 'builder' && <ResumeBuilder />}
        {view === 'checker' && <AtsChecker />}
      </main>

      <Footer />
    </div>
  );
}
