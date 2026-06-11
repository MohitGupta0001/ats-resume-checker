"use client";

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { 
  FileText, Download, Plus, Trash2, ArrowLeftRight, User, Briefcase, GraduationCap, Code2, PlusCircle, CheckCircle, Lightbulb 
} from 'lucide-react';

interface WorkExperience {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string; // Bullet descriptions
}

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
}

interface Project {
  title: string;
  link: string;
  description: string;
}

interface ResumeData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: string;
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  certifications: string;
}

const INITIAL_RESUME_DATA: ResumeData = {
  fullName: "Alexander Wright",
  jobTitle: "Senior Software Engineer",
  email: "alexander.wright@email.com",
  phone: "+1 (555) 019-2834",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/alexwright",
  github: "github.com/alexwright",
  summary: "Results-driven Software Engineer with 6+ years of experience building high-scale web platforms. Spearheaded backend API migration to Next.js API microservices, reducing data payload size by 40% and increasing client load speeds. Expert in frontend architectures, data modeling, React components, and Node.js microservices.",
  skills: "JavaScript, TypeScript, React, Next.js, Node.js, Express, Python, SQL, PostgreSQL, AWS (S3, EC2), Docker, CI/CD, Git, System Design",
  experience: [
    {
      company: "Innovate Tech Labs",
      role: "Lead Software Architect",
      location: "San Francisco, CA",
      startDate: "2023-03",
      endDate: "Present",
      description: "• Spearheaded design and integration of real-time analytics streaming engine using Node.js and Redis, boosting throughput by 55%.\n• Managed a team of 5 engineers to deliver next-generation React components following optimal state-management principles.\n• Optimized database query structures in PostgreSQL, cutting execution latency by 120ms."
    },
    {
      company: "Quantum SaaS Products",
      role: "Full Stack Engineer",
      location: "Oakland, CA",
      startDate: "2020-06",
      endDate: "2023-02",
      description: "• Developed responsive UI panels utilizing React and Tailwind CSS, increasing user session times by 18%.\n• Designed and maintained RESTful APIs with Express, supporting over 200,000 monthly active users.\n• Configured automated GitHub Actions pipelines, reducing team deployment time by 15 minutes."
    }
  ],
  education: [
    {
      institution: "State Tech University",
      degree: "B.S.",
      fieldOfStudy: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2016-09",
      endDate: "2020-05"
    }
  ],
  projects: [
    {
      title: "SecurePay Gateway",
      link: "github.com/alexwright/securepay",
      description: "Designed a mock payment integration using Node.js and encryption standard protocols, demonstrating PCI-DSS compliance heuristics."
    },
    {
      title: "OmniSearch Indexer",
      link: "github.com/alexwright/omnisearch",
      description: "Engineered a local search indexing library matching word-token frequency weightings, boosting document query speed."
    }
  ],
  certifications: "AWS Certified Solutions Architect, Certified ScrumMaster (CSM)"
};

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [activeFormSection, setActiveFormSection] = useState<'personal' | 'experience' | 'education' | 'projects'>('personal');
  const [isPreviewSplit, setIsPreviewSplit] = useState(true);

  // Handle simple input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // Work Experience array modifiers
  const handleExperienceChange = (index: number, field: keyof WorkExperience, value: string) => {
    setData(prev => {
      const newExp = [...prev.experience];
      newExp[index] = { ...newExp[index], [field]: value };
      return { ...prev, experience: newExp };
    });
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: '', role: '', location: '', startDate: '', endDate: '', description: '• ' }
      ]
    }));
  };

  const removeExperience = (index: number) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Education array modifiers
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    setData(prev => {
      const newEdu = [...prev.education];
      newEdu[index] = { ...newEdu[index], [field]: value };
      return { ...prev, education: newEdu };
    });
  };

  const addEducation = () => {
    setData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: '', degree: '', fieldOfStudy: '', location: '', startDate: '', endDate: '' }
      ]
    }));
  };

  const removeEducation = (index: number) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Projects array modifiers
  const handleProjectChange = (index: number, field: keyof Project, value: string) => {
    setData(prev => {
      const newProj = [...prev.projects];
      newProj[index] = { ...newProj[index], [field]: value };
      return { ...prev, projects: newProj };
    });
  };

  const addProject = () => {
    setData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { title: '', link: '', description: '' }
      ]
    }));
  };

  const removeProject = (index: number) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // PDF Download Action
  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let y = 15;

    // Helper: Add text and track Y height
    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > 280) {
        doc.addPage();
        y = 15; // Reset to top margin
      }
    };

    // 1. HEADER (Name & Title)
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(data.fullName, pageWidth / 2, y, { align: 'center' });
    y += 6;

    if (data.jobTitle) {
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(70, 70, 70);
      doc.text(data.jobTitle, pageWidth / 2, y, { align: 'center' });
      y += 5;
    }

    // Contact details bar
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const contacts = [
      data.email,
      data.phone,
      data.location,
      data.linkedin,
      data.github
    ].filter(Boolean);
    const contactLine = contacts.join('  |  ');
    doc.text(contactLine, pageWidth / 2, y, { align: 'center' });
    y += 8;

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // 2. PROFESSIONAL SUMMARY
    if (data.summary) {
      checkPageBreak(25);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(0, 0, 0);
      doc.text('PROFESSIONAL SUMMARY', margin, y);
      y += 4;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      const summaryLines = doc.splitTextToSize(data.summary, contentWidth);
      doc.text(summaryLines, margin, y);
      y += (summaryLines.length * 4.2) + 6;
    }

    // Divider
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // 3. CORE SKILLS
    if (data.skills) {
      checkPageBreak(15);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(0, 0, 0);
      doc.text('CORE SKILLS', margin, y);
      y += 4;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      const skillsLines = doc.splitTextToSize(data.skills, contentWidth);
      doc.text(skillsLines, margin, y);
      y += (skillsLines.length * 4.2) + 6;
    }

    // Divider
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // 4. WORK EXPERIENCE
    if (data.experience.length > 0) {
      checkPageBreak(25);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(0, 0, 0);
      doc.text('WORK EXPERIENCE', margin, y);
      y += 5;

      data.experience.forEach((exp) => {
        // Estimate height for experience
        const descLines = doc.splitTextToSize(exp.description || '', contentWidth);
        const estimatedHeight = 15 + (descLines.length * 4.2);
        checkPageBreak(estimatedHeight);

        // Header Row (Company & Location)
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 30, 30);
        doc.text(exp.company || 'Company', margin, y);
        
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(exp.location || '', pageWidth - margin, y, { align: 'right' });
        y += 4.5;

        // Role & Date Row
        doc.setFont('Helvetica', 'oblique');
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text(exp.role || 'Role', margin, y);

        const dateStr = `${exp.startDate || ''} - ${exp.endDate || ''}`;
        doc.text(dateStr, pageWidth - margin, y, { align: 'right' });
        y += 5;

        // Description
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        doc.text(descLines, margin, y);
        y += (descLines.length * 4.2) + 5;
      });
    }

    // Divider
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // 5. EDUCATION
    if (data.education.length > 0) {
      checkPageBreak(25);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(0, 0, 0);
      doc.text('EDUCATION', margin, y);
      y += 5;

      data.education.forEach((edu) => {
        checkPageBreak(12);

        // Institution & Location
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 30, 30);
        doc.text(edu.institution || 'Institution', margin, y);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(edu.location || '', pageWidth - margin, y, { align: 'right' });
        y += 4.5;

        // Degree Details
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        const degreeString = `${edu.degree || ''} in ${edu.fieldOfStudy || ''}`;
        doc.text(degreeString, margin, y);

        const eduDates = `${edu.startDate || ''} - ${edu.endDate || ''}`;
        doc.text(eduDates, pageWidth - margin, y, { align: 'right' });
        y += 6;
      });
    }

    // 6. PROJECTS (if available)
    if (data.projects.length > 0) {
      // Divider
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;

      checkPageBreak(25);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(0, 0, 0);
      doc.text('PROJECTS', margin, y);
      y += 5;

      data.projects.forEach((proj) => {
        const descLines = doc.splitTextToSize(proj.description || '', contentWidth);
        const estimatedHeight = 10 + (descLines.length * 4.2);
        checkPageBreak(estimatedHeight);

        // Title & Link
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 30, 30);
        doc.text(proj.title || 'Project Title', margin, y);

        if (proj.link) {
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(79, 70, 229);
          doc.text(proj.link, pageWidth - margin, y, { align: 'right' });
        }
        y += 4.5;

        // Description
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        doc.text(descLines, margin, y);
        y += (descLines.length * 4.2) + 5;
      });
    }

    // 7. CERTIFICATIONS (if available)
    if (data.certifications) {
      // Divider
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;

      checkPageBreak(15);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(0, 0, 0);
      doc.text('CERTIFICATIONS', margin, y);
      y += 4;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      const certLines = doc.splitTextToSize(data.certifications, contentWidth);
      doc.text(certLines, margin, y);
    }

    // Save PDF
    const filename = data.fullName.toLowerCase().replace(/\s+/g, '_') + '_resume.pdf';
    doc.save(filename);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            ATS-Friendly Resume Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build your resume inside a clean form. Standard single-column styles ensure scanners read your text correctly.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsPreviewSplit(!isPreviewSplit)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-250 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-850 shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Toggle Preview Layout
          </button>
          
          <button
            onClick={exportToPDF}
            className="flex-1 sm:flex-none px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            Download ATS PDF
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
        
        {/* Editor Form Panel */}
        <div className={`space-y-6 ${isPreviewSplit ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
          
          {/* Section Selector Tab Nav */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100/60 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40">
            {[
              { id: 'personal', label: 'Contact Details', icon: User },
              { id: 'experience', label: 'Work Experience', icon: Briefcase },
              { id: 'education', label: 'Education Details', icon: GraduationCap },
              { id: 'projects', label: 'Projects & Skills', icon: Code2 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFormSection(tab.id as any)}
                  className={`flex-1 min-w-[120px] py-2.5 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeFormSection === tab.id
                      ? 'bg-white dark:bg-slate-850 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-850/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form Content Body */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
            
            {/* 1. PERSONAL DETAILS SECTION */}
            {activeFormSection === 'personal' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2">
                  Personal Details & Links
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={data.fullName} 
                      onChange={handleInputChange}
                      placeholder="e.g. Alexander Wright"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-xs bg-slate-50/50 dark:bg-slate-950/45 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Target Job Title</label>
                    <input 
                      type="text" 
                      name="jobTitle" 
                      value={data.jobTitle} 
                      onChange={handleInputChange}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-xs bg-slate-50/50 dark:bg-slate-950/45 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={data.email} 
                      onChange={handleInputChange}
                      placeholder="e.g. alex.w@email.com"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-xs bg-slate-50/50 dark:bg-slate-950/45 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Phone Number</label>
                    <input 
                      type="text" 
                      name="phone" 
                      value={data.phone} 
                      onChange={handleInputChange}
                      placeholder="e.g. +1 (555) 019-2834"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-xs bg-slate-50/50 dark:bg-slate-950/45 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Location</label>
                    <input 
                      type="text" 
                      name="location" 
                      value={data.location} 
                      onChange={handleInputChange}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-xs bg-slate-50/50 dark:bg-slate-950/45 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">LinkedIn Profile Link</label>
                    <input 
                      type="text" 
                      name="linkedin" 
                      value={data.linkedin} 
                      onChange={handleInputChange}
                      placeholder="e.g. linkedin.com/in/alex"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-xs bg-slate-50/50 dark:bg-slate-950/45 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">GitHub / Portfolio URL</label>
                    <input 
                      type="text" 
                      name="github" 
                      value={data.github} 
                      onChange={handleInputChange}
                      placeholder="e.g. github.com/alex"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-xs bg-slate-50/50 dark:bg-slate-950/45 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. WORK EXPERIENCE SECTION */}
            {activeFormSection === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    Work Experience History
                  </h3>
                  <button
                    onClick={addExperience}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Job
                  </button>
                </div>

                {data.experience.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-6">No experience added yet. Click 'Add Job' to begin.</p>
                ) : (
                  <div className="space-y-6">
                    {data.experience.map((exp, index) => (
                      <div key={index} className="p-4 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/25 space-y-4 relative">
                        <button
                          onClick={() => removeExperience(index)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <h4 className="text-xs font-bold text-indigo-650 dark:text-indigo-400">
                          Role #{index + 1}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase">Company Name</label>
                            <input 
                              type="text" 
                              value={exp.company} 
                              onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                              placeholder="e.g. Innovate Tech Labs"
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase">Job Role / Title</label>
                            <input 
                              type="text" 
                              value={exp.role} 
                              onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                              placeholder="e.g. Senior Software Architect"
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase">Office Location</label>
                            <input 
                              type="text" 
                              value={exp.location} 
                              onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                              placeholder="e.g. San Francisco, CA"
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none" 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase">Start Date</label>
                              <input 
                                type="text" 
                                value={exp.startDate} 
                                onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                                placeholder="YYYY-MM"
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase">End Date</label>
                              <input 
                                type="text" 
                                value={exp.endDate} 
                                onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                                placeholder="YYYY-MM or Present"
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none" 
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase flex items-center justify-between">
                              <span>Role Accomplishments (Use bullet points: •)</span>
                            </label>
                            <textarea 
                              value={exp.description} 
                              onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                              placeholder="• Spearheaded project development..."
                              rows={3.5}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 font-sans" 
                            />
                            <div className="flex gap-2 items-center text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                              <Lightbulb className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              <span>Tip: Use action verbs and metrics. e.g. "Managed a budget of $50K, delivering goals 3 weeks early."</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. EDUCATION SECTION */}
            {activeFormSection === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    Academic Background
                  </h3>
                  <button
                    onClick={addEducation}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Degree
                  </button>
                </div>

                {data.education.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-6">No academic background added yet.</p>
                ) : (
                  <div className="space-y-6">
                    {data.education.map((edu, index) => (
                      <div key={index} className="p-4 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/25 space-y-4 relative">
                        <button
                          onClick={() => removeEducation(index)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove Education"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <h4 className="text-xs font-bold text-indigo-650 dark:text-indigo-400">
                          Degree #{index + 1}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase">Institution / School</label>
                            <input 
                              type="text" 
                              value={edu.institution} 
                              onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                              placeholder="e.g. State Tech University"
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase">Degree Type</label>
                            <input 
                              type="text" 
                              value={edu.degree} 
                              onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                              placeholder="e.g. B.S., M.S., MBA"
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase">Field of Study / Major</label>
                            <input 
                              type="text" 
                              value={edu.fieldOfStudy} 
                              onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                              placeholder="e.g. Computer Science"
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase">Location</label>
                            <input 
                              type="text" 
                              value={edu.location} 
                              onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                              placeholder="e.g. Berkeley, CA"
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none" 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase">Start Date (Year)</label>
                              <input 
                                type="text" 
                                value={edu.startDate} 
                                onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                                placeholder="YYYY-MM"
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase">End Date (or Expected)</label>
                              <input 
                                type="text" 
                                value={edu.endDate} 
                                onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                                placeholder="YYYY-MM"
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. PROJECTS & SKILLS SECTION */}
            {activeFormSection === 'projects' && (
              <div className="space-y-6">
                
                {/* Profile Summary & Core Skills fields */}
                <div className="space-y-4 border-b border-slate-100 dark:border-slate-850 pb-5">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    Summary & Skills Text Blocks
                  </h3>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-455 dark:text-slate-400 uppercase">
                      Professional Summary
                    </label>
                    <textarea
                      name="summary"
                      value={data.summary}
                      onChange={handleInputChange}
                      placeholder="Write a brief summary highlighting your main skills and impact..."
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-xs bg-slate-50/50 dark:bg-slate-950/45 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-455 dark:text-slate-400 uppercase">
                      Core Skills (separated by commas)
                    </label>
                    <textarea
                      name="skills"
                      value={data.skills}
                      onChange={handleInputChange}
                      placeholder="JavaScript, React, Node.js, SQL..."
                      rows={2.5}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-xs bg-slate-50/50 dark:bg-slate-950/45 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-455 dark:text-slate-400 uppercase">
                      Certifications
                    </label>
                    <input
                      type="text"
                      name="certifications"
                      value={data.certifications}
                      onChange={handleInputChange}
                      placeholder="e.g. AWS Certified Architect, CSM"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-xs bg-slate-50/50 dark:bg-slate-950/45 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Projects lists */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      Portfolio Projects
                    </h3>
                    <button
                      onClick={addProject}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Project
                    </button>
                  </div>

                  {data.projects.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-4">No projects added yet.</p>
                  ) : (
                    <div className="space-y-6">
                      {data.projects.map((proj, index) => (
                        <div key={index} className="p-4 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/25 space-y-4 relative">
                          <button
                            onClick={() => removeProject(index)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors p-1"
                            title="Remove Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <h4 className="text-xs font-bold text-indigo-650 dark:text-indigo-400">
                            Project #{index + 1}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase">Project Title</label>
                              <input 
                                type="text" 
                                value={proj.title} 
                                onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                                placeholder="e.g. SecurePay Gateway"
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase">Link / Repository URL</label>
                              <input 
                                type="text" 
                                value={proj.link} 
                                onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                                placeholder="e.g. github.com/username/project"
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none" 
                              />
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase">Project Description</label>
                              <textarea 
                                value={proj.description} 
                                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                placeholder="Briefly describe what you built, technologies used, and achievements..."
                                rows={2.5}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Live Visual Preview Panel */}
        {isPreviewSplit && (
          <div className="lg:col-span-6 space-y-4 sticky top-22">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400 uppercase tracking-widest">
                ATS Preview (A4 Page View)
              </span>
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                <CheckCircle className="w-4.5 h-4.5" /> Searchable Vector Output
              </span>
            </div>

            {/* Paper Sheet Representation */}
            <div className="w-full border border-slate-250 dark:border-slate-800 bg-white text-slate-900 shadow-lg rounded-3xl p-8 max-h-[700px] overflow-y-auto leading-relaxed text-left font-sans select-none select-text">
              
              {/* Header */}
              <div className="text-center space-y-1 pb-4 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-950 leading-none">{data.fullName || 'Name Placeholder'}</h2>
                {data.jobTitle && <p className="text-sm text-slate-600 font-medium">{data.jobTitle}</p>}
                
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-slate-500 pt-1.5 font-medium">
                  {data.email && <span>{data.email}</span>}
                  {data.phone && <span>• {data.phone}</span>}
                  {data.location && <span>• {data.location}</span>}
                  {data.linkedin && <span>• {data.linkedin}</span>}
                  {data.github && <span>• {data.github}</span>}
                </div>
              </div>

              {/* Summary */}
              {data.summary && (
                <div className="mt-5 space-y-1.5">
                  <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Professional Summary</h3>
                  <p className="text-[10px] text-slate-700 leading-normal whitespace-pre-line">{data.summary}</p>
                </div>
              )}

              {/* Skills */}
              {data.skills && (
                <div className="mt-5 space-y-1.5">
                  <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Core Skills</h3>
                  <p className="text-[10px] text-slate-750 leading-relaxed font-sans">{data.skills}</p>
                </div>
              )}

              {/* Work Experience */}
              {data.experience.length > 0 && (
                <div className="mt-5 space-y-3">
                  <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Work Experience</h3>
                  
                  {data.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-baseline text-[10px] font-bold text-slate-850">
                        <span>{exp.company || 'Company'}</span>
                        <span className="font-normal text-slate-500">{exp.location}</span>
                      </div>
                      <div className="flex justify-between items-baseline text-[9.5px] italic text-slate-650">
                        <span>{exp.role || 'Role'}</span>
                        <span className="font-normal text-slate-500 not-italic">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      {exp.description && (
                        <p className="text-[9.5px] text-slate-700 whitespace-pre-line leading-relaxed font-sans pl-1.5">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {data.education.length > 0 && (
                <div className="mt-5 space-y-3">
                  <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Education</h3>
                  
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline text-[10px] font-bold text-slate-850">
                        <span>{edu.institution || 'Institution'}</span>
                        <span className="font-normal text-slate-500">{edu.location}</span>
                      </div>
                      <div className="flex justify-between items-baseline text-[9.5px] text-slate-650">
                        <span>{edu.degree || 'Degree'} in {edu.fieldOfStudy || 'Field'}</span>
                        <span className="font-normal text-slate-500">{edu.startDate} - {edu.endDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {data.projects.length > 0 && (
                <div className="mt-5 space-y-3">
                  <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Projects</h3>
                  
                  {data.projects.map((proj, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline text-[10px] font-bold text-slate-850">
                        <span>{proj.title || 'Project Title'}</span>
                        {proj.link && <span className="text-[9px] text-indigo-600 font-medium select-all">{proj.link}</span>}
                      </div>
                      {proj.description && <p className="text-[9.5px] text-slate-700 leading-relaxed pl-1.5">{proj.description}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Certifications */}
              {data.certifications && (
                <div className="mt-5 space-y-1.5">
                  <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Certifications</h3>
                  <p className="text-[10px] text-slate-755 leading-relaxed">{data.certifications}</p>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
