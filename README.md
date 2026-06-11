# ResumeScan AI — ATS Resume Checker & Builder

ResumeScan AI is a modern, lightweight, private, and free web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). Users can build an ATS-optimized resume from scratch or upload an existing PDF/DOCX file to receive a heuristic ATS score and detailed feedback against job descriptions.

## 🚀 Key Features

1. **SaaS-Style Landing Page**
   - Clean, modern layout supporting dark and light themes.
   - Distinct Call-to-Actions (CTAs) for building a resume or checking an ATS score.

2. **Heuristic ATS Score Checker**
   - Support for drag-and-drop or file upload of PDF and DOCX documents.
   - Text parsing done fully in Next.js Serverless API routes (zero client-side file reading limitations).
   - Job description keyword comparison highlighting missing core skills and soft skills.
   - Dynamic ATS score gauge with breakdown metrics (structure, formatting, keyword density).

3. **ATS-Optimized Resume Builder**
   - Single-page form covering all vital sections (Contact, Summary, Experience, Education, Projects, Certifications).
   - Real-time side-by-side print preview reflecting true physical paper page boundaries.
   - Instantly downloadable PDF generated directly in the browser via `jsPDF`.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with custom HSL color tokens)
- **Icons**: Lucide Icons
- **Document Parsing**: `pdf-parse` (PDF) and `mammoth` (DOCX)
- **PDF Export**: `jsPDF`

## ⚙️ Local Development Setup

To run this application locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MohitGupta0001/ats-resume-checker.git
   cd ats-resume-checker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🔒 Privacy First

ResumeScan AI does not require user accounts, signup, or logins. All resume creation and PDF exports happen purely client-side. Uploaded files for ATS scanning are parsed in memory on the server and are never persisted to any database or storage.
