"use client";

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, ArrowRight, BookOpen, Compass, ChevronRight, HelpCircle, Briefcase, Plus, Search } from 'lucide-react';
import { analyzeResumeText, compareResumeWithJobDescription, AtsAnalysisResult, JobMatchResult, ACTION_VERBS, COMMON_SKILLS } from '@/utils/atsAlgorithm';

export default function AtsChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  
  // Results
  const [analysis, setAnalysis] = useState<AtsAnalysisResult | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [matchingLoading, setMatchingLoading] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'breakdown' | 'job_match' | 'improvements'>('breakdown');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (selectedFile: File) => {
    const validExtensions = ['.pdf', '.docx'];
    const filename = selectedFile.name.toLowerCase();
    const isValid = validExtensions.some(ext => filename.endsWith(ext));

    if (!isValid) {
      setError('Unsupported file type. Please upload a PDF or DOCX file.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setLoading(true);
    setAnalysis(null);
    setMatchResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse file.');
      }

      setExtractedText(data.text);
      
      // Perform local ATS analysis
      const result = analyzeResumeText(data.text);
      setAnalysis(result);
      
      // If job description is already pasted, trigger matching instantly
      if (jobDescription.trim()) {
        const match = compareResumeWithJobDescription(data.text, jobDescription);
        setMatchResult(match);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while uploading and parsing your file.');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = () => {
    if (!extractedText) return;
    if (!jobDescription.trim()) {
      alert('Please paste a job description first.');
      return;
    }
    setMatchingLoading(true);
    setTimeout(() => {
      const match = compareResumeWithJobDescription(extractedText, jobDescription);
      setMatchResult(match);
      setMatchingLoading(false);
      setActiveTab('job_match');
    }, 400);
  };

  const resetScanner = () => {
    setFile(null);
    setError(null);
    setExtractedText('');
    setAnalysis(null);
    setMatchResult(null);
  };

  // Helper colors
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50';
      case 'B': return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200/50';
      case 'C': return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200/50';
      default: return 'text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-200/50';
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'stroke-emerald-500 dark:stroke-emerald-400';
    if (score >= 70) return 'stroke-indigo-500 dark:stroke-indigo-400';
    if (score >= 50) return 'stroke-amber-500 dark:stroke-amber-400';
    return 'stroke-rose-500 dark:stroke-rose-450';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 flex-1">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          ATS Score & Keyword Scanner
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base max-w-xl mx-auto">
          Scan your existing resume document to check compliance and benchmark keyword overlap against specific role descriptions.
        </p>
      </div>

      {!analysis && (
        <div className="max-w-3xl mx-auto">
          {/* File Upload Box */}
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-10 sm:p-14 text-center cursor-pointer bg-white dark:bg-slate-900/40 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 shadow-sm relative group"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              accept=".pdf,.docx"
              className="hidden" 
            />
            
            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Analyzing Resume...</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Extracting semantic layers and computing sub-scores
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform duration-200">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-950 dark:text-white">
                    Drag and drop your resume file here
                  </h4>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    Supports text-based PDF or DOCX files (Max 5MB)
                  </p>
                </div>
                <button 
                  type="button" 
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md cursor-pointer transition-colors"
                >
                  Choose File
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-5 p-4 rounded-xl border border-rose-200 dark:border-rose-950/30 bg-rose-50/50 dark:bg-rose-950/15 flex items-start gap-3 text-rose-700 dark:text-rose-400">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Parsing Error</p>
                <p className="text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Quick FAQ / Guidance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 text-left">
            <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs">
              <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                <HelpCircle className="w-4.5 h-4.5 text-indigo-500" />
                Why does parsing fail?
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Our parser requires standard text streams. Scanned PDFs, image-based portfolios, or double-layered columns can sometimes prevent clean parsing. Ensure your PDF has selectable text.
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs">
              <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                <BookOpen className="w-4.5 h-4.5 text-indigo-500" />
                How is my score calculated?
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Scores are divided into metrics matching industry standards: Contact Info (10%), Profile Summary (15%), Skills lists (20%), bulleted Work Experience with metrics (25%), Education (10%), and Formatting safety (20%).
              </p>
            </div>
          </div>

        </div>
      )}

      {analysis && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Active File Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <FileText className="w-5.5 h-5.5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate max-w-xs sm:max-w-md">
                  {file?.name || 'Parsed Document'}
                </p>
                <p className="text-[11px] text-slate-450 dark:text-slate-400">
                  {analysis.wordCount} words detected • ATS Ready
                </p>
              </div>
            </div>
            
            <button
              onClick={resetScanner}
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-350 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 rounded-xl transition-all cursor-pointer text-center"
            >
              Analyze New Resume
            </button>
          </div>

          {/* Results Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Summary and Score Ring */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Score Dashboard Card */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center shadow-sm relative overflow-hidden">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  ATS Score Grade
                </span>
                
                {/* Circular Score representation */}
                <div className="relative w-40 h-40 mx-auto mt-4 mb-4 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="80" 
                      cy="80" 
                      r="68" 
                      className="stroke-slate-100 dark:stroke-slate-850" 
                      strokeWidth="10" 
                      fill="transparent" 
                    />
                    <circle 
                      cx="80" 
                      cy="80" 
                      r="68" 
                      className={`transition-all duration-1000 ${getScoreColorClass(analysis.score)}`}
                      strokeWidth="10" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * 68}
                      strokeDashoffset={2 * Math.PI * 68 * (1 - analysis.score / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4.5xl font-extrabold text-slate-900 dark:text-white">
                      {analysis.score}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                      score / 100
                    </span>
                  </div>
                </div>

                {/* Grade Badge */}
                <div className="flex items-center justify-center gap-3">
                  <div className={`px-4 py-1.5 rounded-full border text-xs font-bold ${getGradeColor(analysis.grade)}`}>
                    Grade {analysis.grade}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    {analysis.score >= 80 ? 'Highly Competitive' : analysis.score >= 70 ? 'Satisfactory' : 'Needs Optimization'}
                  </span>
                </div>

                {/* Verb count indicator */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-left">
                  <div className="text-center">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">Action Verbs</span>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5">{analysis.actionVerbsCount}</p>
                  </div>
                  <div className="text-center border-l border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">Format Risk</span>
                    <p className="text-lg font-bold text-emerald-500 mt-0.5">Low</p>
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses Checklist */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
                  Quick Diagnostic
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                      Strengths ({analysis.strengths.length})
                    </h4>
                    {analysis.strengths.length > 0 ? (
                      <ul className="space-y-2">
                        {analysis.strengths.map((str, i) => (
                          <li key={i} className="text-xs text-slate-650 dark:text-slate-450 flex items-start gap-2">
                            <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No significant layout strengths detected yet.</p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-150 dark:border-slate-800">
                    <h4 className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                      Weaknesses & Gaps ({analysis.weaknesses.length})
                    </h4>
                    {analysis.weaknesses.length > 0 ? (
                      <ul className="space-y-2">
                        {analysis.weaknesses.map((weak, i) => (
                          <li key={i} className="text-xs text-slate-650 dark:text-slate-450 flex items-start gap-2">
                            <span className="text-rose-500 font-bold mt-0.5">✗</span>
                            <span>{weak}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> High compliance! No major weaknesses.
                      </p>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Interactive Tab Area */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Tab Navigation Menu */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-xs">
                <button
                  onClick={() => setActiveTab('breakdown')}
                  className={`flex-1 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'breakdown'
                      ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-505 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Section Breakdown
                </button>
                <button
                  onClick={() => setActiveTab('job_match')}
                  className={`flex-1 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'job_match'
                      ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-505 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Job Matcher
                </button>
                <button
                  onClick={() => setActiveTab('improvements')}
                  className={`flex-1 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'improvements'
                      ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-505 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Improvement Engine
                </button>
              </div>

              {/* Tab Content 1: Section Breakdown */}
              {activeTab === 'breakdown' && (
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Section-by-Section ATS Audit
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                      Heuristic Scan
                    </span>
                  </div>

                  <div className="space-y-6">
                    {/* Iterate over sections */}
                    {[
                      { name: 'Contact Information', key: 'contact', icon: '📞' },
                      { name: 'Summary & Objective', key: 'summary', icon: '📝' },
                      { name: 'Core Skills', key: 'skills', icon: '🛠️' },
                      { name: 'Professional Experience', key: 'experience', icon: '💼' },
                      { name: 'Education History', key: 'education', icon: '🎓' },
                      { name: 'Formatting & Layout', key: 'formatting', icon: '📐' }
                    ].map((sec) => {
                      const secData = analysis.sections[sec.key as keyof typeof analysis.sections];
                      const pct = Math.round((secData.score / secData.max) * 100);
                      
                      return (
                        <div key={sec.key} className="space-y-2 border-b border-slate-100 dark:border-slate-850 pb-5 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="flex items-center gap-2 text-slate-850 dark:text-slate-200">
                              <span className="text-sm">{sec.icon}</span>
                              {sec.name}
                            </span>
                            <span className="text-slate-400 font-bold">
                              {secData.score} / {secData.max} ({pct}%)
                            </span>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-indigo-500' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>

                          {/* Details details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-1">
                            {secData.details.map((detail, idx) => {
                              const isPositive = detail.startsWith('✓');
                              return (
                                <div key={idx} className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                                  <span className={isPositive ? 'text-emerald-500 font-bold' : 'text-rose-550 dark:text-rose-400 font-semibold'}>
                                    {isPositive ? '✓' : '•'}
                                  </span>
                                  <span className="text-slate-500 dark:text-slate-400">
                                    {detail.substring(2)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* Tab Content 2: Job Matcher */}
              {activeTab === 'job_match' && (
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-indigo-500" />
                      Job Description keyword Matcher
                    </h3>
                  </div>

                  {!matchResult ? (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-550 dark:text-slate-400">
                        Paste the target job posting details below. The parser will extract keywords and cross-reference them against your resume text to compute match percentage and show missing tags.
                      </p>
                      
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the complete job posting text / role requirements here..."
                        rows={6}
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-850 p-4 text-xs bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                      />

                      <button
                        onClick={handleCompare}
                        disabled={matchingLoading || !jobDescription.trim()}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 dark:disabled:text-slate-650 text-xs font-semibold shadow-md cursor-pointer transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        {matchingLoading ? 'Analyzing Overlap...' : 'Calculate Job Match Score'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Match Score Display */}
                      <div className="p-5 rounded-2xl border border-indigo-100 dark:border-indigo-950/20 bg-indigo-50/25 dark:bg-indigo-950/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="space-y-1.5 text-center sm:text-left">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Job Match Score</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Measures your text similarity density against extracted keywords.
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-800 flex items-center justify-center relative bg-white dark:bg-slate-900 shrink-0">
                            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                              {matchResult.matchScore}%
                            </span>
                          </div>
                          
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-350">
                            {matchResult.matchScore >= 80 ? 'Excellent Match' : matchResult.matchScore >= 60 ? 'Moderate Fit' : 'Low Relevance'}
                          </span>
                        </div>
                      </div>

                      {/* Missing Keywords Tag Cloud */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                          Missing Keywords / Skills ({matchResult.missingKeywords.length})
                        </h4>
                        
                        {matchResult.missingKeywords.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {matchResult.missingKeywords.map((tag, i) => (
                              <span 
                                key={i} 
                                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-950/35 text-rose-650 dark:text-rose-400 flex items-center gap-1.5"
                              >
                                <Plus className="w-3 h-3 cursor-pointer" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No missing keywords! You match all main requirements.</p>
                        )}
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                          Tip: We highly recommend incorporating these missing terms in your summary or skills section.
                        </p>
                      </div>

                      {/* Matched Keywords */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          Matched Keywords ({matchResult.matchedKeywords.length})
                        </h4>
                        
                        {matchResult.matchedKeywords.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {matchResult.matchedKeywords.map((tag, i) => (
                              <span 
                                key={i} 
                                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 text-emerald-650 dark:text-emerald-400 flex items-center gap-1.5"
                              >
                                <span className="text-[10px] font-bold text-emerald-500">✓</span>
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No matched keywords. Consider adding terms related to the listing.</p>
                        )}
                      </div>

                      {/* Recalculate or paste another JD */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <button
                          onClick={() => {
                            setMatchResult(null);
                          }}
                          className="px-4 py-2 text-xs font-semibold text-indigo-650 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-50/50 rounded-xl transition-all cursor-pointer"
                        >
                          Modify Job Description
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* Tab Content 3: Improvements Engine */}
              {activeTab === 'improvements' && (
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                      ATS Optimizer suggestions
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                      Actionable Swaps
                    </span>
                  </div>

                  {/* General Tips */}
                  <div className="space-y-5">
                    
                    {/* Word Suggestion engine */}
                    <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-250 flex items-center gap-1.5">
                        <span className="text-indigo-500 font-extrabold">&bull;</span>
                        Strengthen Action Verbs (Top Swaps)
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        To pass scoring scans, exchange weak phrasing for strong action verbs. Ensure you place them at the start of your experience bullet points.
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900">
                          <span className="text-rose-500 line-through">Helped with</span>
                          <span className="mx-2 text-slate-450">&rarr;</span>
                          <span className="text-emerald-500 font-bold">Spearheaded / Coordinated</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900">
                          <span className="text-rose-500 line-through">Responsible for</span>
                          <span className="mx-2 text-slate-450">&rarr;</span>
                          <span className="text-emerald-500 font-bold">Executed / Managed</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900">
                          <span className="text-rose-500 line-through">Worked on</span>
                          <span className="mx-2 text-slate-450">&rarr;</span>
                          <span className="text-emerald-500 font-bold">Designed / Engineered</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900">
                          <span className="text-rose-500 line-through">Added features</span>
                          <span className="mx-2 text-slate-450">&rarr;</span>
                          <span className="text-emerald-500 font-bold">Integrated / Launched</span>
                        </div>
                      </div>
                    </div>

                    {/* Pre-generated improved summaries */}
                    <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-250 flex items-center gap-1.5">
                        <span className="text-indigo-500 font-extrabold">&bull;</span>
                        ATS Professional Summary Templates
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        An ATS-friendly summary should follow: <span className="font-semibold text-slate-650 dark:text-slate-350">[Profession Title]</span> + <span className="font-semibold text-slate-650 dark:text-slate-350">[Years of experience]</span> + <span className="font-semibold text-slate-650 dark:text-slate-350">[Key achievement/impact]</span> + <span className="font-semibold text-slate-650 dark:text-slate-350">[Core skills stack]</span>.
                      </p>
                      
                      <div className="space-y-3 pt-1 text-[11px]">
                        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 space-y-1">
                          <p className="font-semibold text-indigo-600 dark:text-indigo-400">Technical Role Template:</p>
                          <p className="text-slate-500 dark:text-slate-400 leading-relaxed italic">
                            "Results-driven Software Engineer with 4+ years of experience specializing in high-scale web applications. Spearheaded backend migrations to microservices architecture, reducing latency by 35%. Expert in React, Node.js, TypeScript, and AWS cloud environments."
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 space-y-1">
                          <p className="font-semibold text-indigo-600 dark:text-indigo-400">Management & Business Template:</p>
                          <p className="text-slate-500 dark:text-slate-400 leading-relaxed italic">
                            "Accomplished Project Manager with a proven record of coordinating cross-functional engineering teams. Managed $2M portfolio budget, streamlining execution to deliver 92% of project deadlines ahead of schedule. Core skills: Agile methodologies, Scrum compliance, risk mapping, and stakeholder relations."
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Layout Formatting rules */}
                    <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-250 flex items-center gap-1.5">
                        <span className="text-indigo-500 font-extrabold">&bull;</span>
                        ATS Formatting Safeguards
                      </h4>
                      
                      <ul className="space-y-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-500 font-bold mt-0.5">•</span>
                          <span><strong>Avoid graphics:</strong> Do not include photos, progress sliders, charts, or images. Scanners parse them as illegible gibberish, reducing score.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-500 font-bold mt-0.5">•</span>
                          <span><strong>Stick to single column:</strong> Double column layouts often cause reading engines to merge lines horizontally, making sentences unreadable.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-500 font-bold mt-0.5">•</span>
                          <span><strong>Standard Headings:</strong> Use basic heading names like "Work Experience", "Education", and "Skills" instead of creative variants like "What I've Done" or "Academia".</span>
                        </li>
                      </ul>
                    </div>

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
