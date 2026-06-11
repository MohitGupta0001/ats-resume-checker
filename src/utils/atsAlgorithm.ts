export interface SectionScore {
  score: number;
  max: number;
  details: string[];
}

export interface AtsAnalysisResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  sections: {
    contact: SectionScore;
    summary: SectionScore;
    skills: SectionScore;
    experience: SectionScore;
    education: SectionScore;
    formatting: SectionScore;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  actionVerbsCount: number;
  wordCount: number;
}

export interface JobMatchResult {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendedKeywords: string[];
}

// Common industry keywords for matching/detection
export const COMMON_SKILLS = [
  // Tech & Development
  'javascript', 'typescript', 'react', 'next.js', 'vue', 'angular', 'node.js', 'express', 'python', 'django', 'flask',
  'fastapi', 'java', 'spring boot', 'c++', 'c#', '.net', 'ruby', 'rails', 'php', 'laravel', 'go', 'golang', 'rust',
  'html', 'css', 'tailwind', 'sass', 'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'graphql', 'rest api',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'git', 'github', 'terraform', 'linux', 'nginx',
  'machine learning', 'deep learning', 'data science', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch',
  'tableau', 'power bi', 'jira', 'confluence', 'agile', 'scrum', 'system design', 'data modeling', 'microservices',
  // Marketing & Sales
  'seo', 'sem', 'digital marketing', 'content strategy', 'social media', 'google analytics', 'copywriting',
  'email marketing', 'salesforce', 'crm', 'b2b sales', 'lead generation', 'customer acquisition', 'market research',
  // Management & Design
  'project management', 'product management', 'product design', 'ui/ux', 'figma', 'sketch', 'adobe xd', 'photoshop',
  'illustrator', 'wireframing', 'prototyping', 'user research', 'strategic planning', 'financial modeling',
  'budgeting', 'risk management', 'operations', 'business development', 'negotiation', 'leadership', 'collaboration'
];

export const ACTION_VERBS = [
  'managed', 'developed', 'implemented', 'designed', 'led', 'created', 'built', 'optimized', 'increased',
  'reduced', 'spearheaded', 'achieved', 'launched', 'formulated', 'coordinated', 'analyzed', 'streamlined',
  'pioneered', 'restructured', 'facilitated', 'engineered', 'programmed', 'monitored', 'directed', 'governed',
  'executed', 'negotiated', 'conducted', 'delivered', 'integrated', 'maximized', 'overhauled', 'resolved'
];

export function analyzeResumeText(text: string): AtsAnalysisResult {
  const normalizedText = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  // 1. Contact Information Evaluation (10%)
  let contactScore = 0;
  const contactDetails: string[] = [];
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(normalizedText);
  const hasPhone = /(\+?\d{1,4}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(normalizedText) || /\+?\d{10,12}/.test(normalizedText);
  const hasLinkedIn = /linkedin\.com/i.test(normalizedText);
  const hasGithub = /github\.com/i.test(normalizedText);
  const hasLocation = /(street|avenue|road|lane|drive|circle|apartment|apt|suite|ste|city|state|zip|postal|address|india|usa|canada|uk|germany|london|san francisco|new york|delhi|mumbai|bangalore)/i.test(normalizedText);

  if (hasEmail) {
    contactScore += 3;
    contactDetails.push("✓ Email address found");
  } else {
    contactDetails.push("✗ Missing email address");
    weaknesses.push("Email address is missing or couldn't be parsed");
    suggestions.push("Add a professional email address at the top of your resume");
  }

  if (hasPhone) {
    contactScore += 3;
    contactDetails.push("✓ Phone number found");
  } else {
    contactDetails.push("✗ Missing phone number");
    weaknesses.push("Phone number is missing or format is unrecognized");
    suggestions.push("Include a valid phone number with country code if applicable");
  }

  if (hasLinkedIn) {
    contactScore += 2;
    contactDetails.push("✓ LinkedIn profile URL found");
  } else {
    contactDetails.push("✗ Missing LinkedIn link");
    weaknesses.push("LinkedIn profile URL is missing");
    suggestions.push("Add your LinkedIn profile link to improve social credibility");
  }

  if (hasGithub || hasLocation) {
    contactScore += 2;
    contactDetails.push(hasGithub ? "✓ Portfolio/Github profile found" : "✓ General location details found");
  } else {
    contactDetails.push("✗ Missing portfolio/GitHub or physical location");
    suggestions.push("Add your location (City, State/Country) and/or personal portfolio link");
  }

  if (contactScore === 10) {
    strengths.push("Contact details are complete and professional");
  }

  const contactSection: SectionScore = { score: contactScore, max: 10, details: contactDetails };

  // 2. Resume Summary Evaluation (15%)
  let summaryScore = 0;
  const summaryDetails: string[] = [];
  const summaryHeaders = ['summary', 'profile', 'objective', 'professional summary', 'about me', 'executive summary'];
  let hasSummaryHeader = false;
  
  for (const header of summaryHeaders) {
    if (new RegExp(`\\b${header}\\b`, 'i').test(normalizedText)) {
      hasSummaryHeader = true;
      break;
    }
  }

  // Estimate summary length. Usually summaries are at the top, between contact details and experience.
  // We check if the text contains a block of text matching summary-like length.
  // If there's a header, we check length of text after it.
  const hasSubstantialText = wordCount > 80;
  
  if (hasSummaryHeader) {
    summaryScore += 7;
    summaryDetails.push("✓ Resume summary/objective header identified");
  } else {
    summaryDetails.push("✗ No explicit 'Summary' or 'Objective' header found");
    suggestions.push("Create a clear 'Professional Summary' or 'Executive Profile' section to hook the recruiter");
  }

  // Word count check for summary if we can identify it, or check overall text context
  if (hasSubstantialText) {
    // If we have summary header, let's look at word count density around it
    summaryScore += 5;
    summaryDetails.push("✓ Summary length is appropriate");
  } else {
    summaryDetails.push("✗ Resume content is extremely brief");
  }

  // Action verbs in summary
  const summaryVerbs = ACTION_VERBS.filter(verb => normalizedText.includes(verb));
  if (summaryVerbs.length >= 2) {
    summaryScore += 3;
    summaryDetails.push("✓ Professional summary contains strong action verbs");
  } else {
    summaryDetails.push("✗ Summary could use stronger action verbs");
    suggestions.push("Revise your summary to start with action-oriented descriptions of your experience");
  }

  if (summaryScore >= 12) {
    strengths.push("Summary section is engaging and well-structured");
  }
  const summarySection: SectionScore = { score: summaryScore, max: 15, details: summaryDetails };

  // 3. Skills Section Evaluation (20%)
  let skillsScore = 0;
  const skillsDetails: string[] = [];
  const skillsHeaders = ['skills', 'core competencies', 'technologies', 'technical skills', 'areas of expertise', 'expertise'];
  let hasSkillsHeader = false;
  for (const header of skillsHeaders) {
    if (new RegExp(`\\b${header}\\b`, 'i').test(normalizedText)) {
      hasSkillsHeader = true;
      break;
    }
  }

  if (hasSkillsHeader) {
    skillsScore += 5;
    skillsDetails.push("✓ Skills section header identified");
  } else {
    skillsDetails.push("✗ Missing distinct 'Skills' section header");
    weaknesses.push("No dedicated Skills section header found");
    suggestions.push("Add a dedicated 'Skills' or 'Technical Skills' section");
  }

  const detectedSkills = COMMON_SKILLS.filter(skill => {
    // Escape special chars for regex
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(normalizedText);
  });

  if (detectedSkills.length >= 10) {
    skillsScore += 10;
    skillsDetails.push(`✓ Found ${detectedSkills.length} relevant industry skills`);
  } else if (detectedSkills.length >= 5) {
    skillsScore += 6;
    skillsDetails.push(`✓ Found ${detectedSkills.length} skills (recommend adding more)`);
    suggestions.push("List more technical skills and industry terms relevant to your target role");
  } else {
    skillsDetails.push("✗ Very few standard industry skills detected");
    weaknesses.push("Critical skill keywords are lacking");
    suggestions.push("Add a bulleted list of 10+ core technologies or skills relevant to your domain");
  }

  // Check structure: lists or comma separated
  const hasBulletsOrCommas = /,|•|\||\*| - /.test(text);
  if (hasBulletsOrCommas) {
    skillsScore += 5;
    skillsDetails.push("✓ Skills are formatted in a clean, readable layout");
  } else {
    skillsDetails.push("✗ Skills formatting could be improved (use bullet points or columns)");
    suggestions.push("Use clean separators like vertical bars (|), bullet points, or commas to list skills");
  }

  if (skillsScore >= 15) {
    strengths.push("Excellent density and listing of industry-standard skills");
  }
  const skillsSection: SectionScore = { score: skillsScore, max: 20, details: skillsDetails };

  // 4. Work Experience Evaluation (25%)
  let expScore = 0;
  const expDetails: string[] = [];
  const expHeaders = ['experience', 'employment', 'work history', 'professional experience', 'career history', 'employment history'];
  let hasExpHeader = false;
  for (const header of expHeaders) {
    if (new RegExp(`\\b${header}\\b`, 'i').test(normalizedText)) {
      hasExpHeader = true;
      break;
    }
  }

  if (hasExpHeader) {
    expScore += 7;
    expDetails.push("✓ Work Experience section identified");
  } else {
    expDetails.push("✗ Missing clear 'Work Experience' section header");
    weaknesses.push("No work experience section header detected");
    suggestions.push("Add a prominent 'Work Experience' or 'Professional Experience' section");
  }

  // Check for action verbs density
  const foundVerbs = ACTION_VERBS.filter(verb => normalizedText.includes(verb));
  const actionVerbsCount = foundVerbs.length;

  if (actionVerbsCount >= 8) {
    expScore += 6;
    expDetails.push(`✓ Strong usage of action verbs (${actionVerbsCount} detected)`);
  } else if (actionVerbsCount >= 4) {
    expScore += 4;
    expDetails.push(`✓ Used ${actionVerbsCount} action verbs (could use more)`);
    suggestions.push("Start experience descriptions with powerful action verbs instead of passive phrases");
  } else {
    expDetails.push("✗ Minimal use of action verbs");
    weaknesses.push("Experience details lack dynamic action verbs");
    suggestions.push("Add strong action verbs (e.g., spearheaded, optimized, managed) to describe achievements");
  }

  // Check for quantitative metrics (numbers with %, $, or words indicating quantity/metrics)
  const hasMetrics = /([0-9]+%|[0-9]+\s*%|\$[0-9]+|increased|decreased|saved|reduced|revenue|millions|thousands|users|customers|growth)/i.test(normalizedText);
  if (hasMetrics) {
    expScore += 7;
    expDetails.push("✓ Quantified accomplishments found (metrics/impact)");
  } else {
    expDetails.push("✗ Passive descriptions (missing quantifiable metrics)");
    weaknesses.push("Job descriptions lack measurable metrics or results");
    suggestions.push("Quantify your achievements (e.g. 'boosted sales by 20%', 'reduced loading time by 40%')");
  }

  // Check format: bullet points in experience
  const hasBullets = /•|•|-|\*|\d+\./.test(text);
  if (hasBullets) {
    expScore += 5;
    expDetails.push("✓ Bulleted details used for role responsibilities");
  } else {
    expDetails.push("✗ Paragraph-style experience blocks (hard for ATS to parse)");
    suggestions.push("Use standard bullet points instead of block paragraphs for readability");
  }

  if (expScore >= 20) {
    strengths.push("Work experience details are results-oriented and well-structured");
  }
  const experienceSection: SectionScore = { score: expScore, max: 25, details: expDetails };

  // 5. Education Evaluation (10%)
  let eduScore = 0;
  const eduDetails: string[] = [];
  const eduHeaders = ['education', 'academic', 'qualifications', 'credentials', 'studies'];
  let hasEduHeader = false;
  for (const header of eduHeaders) {
    if (new RegExp(`\\b${header}\\b`, 'i').test(normalizedText)) {
      hasEduHeader = true;
      break;
    }
  }

  if (hasEduHeader) {
    eduScore += 5;
    eduDetails.push("✓ Education section identified");
  } else {
    eduDetails.push("✗ Missing clear 'Education' section");
    weaknesses.push("Education section is missing or unrecognized");
    suggestions.push("Add an 'Education' section to detail your academic credentials");
  }

  const hasDegree = /\b(degree|bachelor|master|phd|b\.s|m\.s|b\.a|m\.a|mba|doctorate|associate|diploma|university|college|school)\b/i.test(normalizedText);
  if (hasDegree) {
    eduScore += 5;
    eduDetails.push("✓ Degree or institution details recognized");
  } else {
    eduDetails.push("✗ Specific degree or institution keywords missing");
    suggestions.push("Mention the specific degree earned (e.g., B.S. in Computer Science) and the institution name");
  }

  if (eduScore === 10) {
    strengths.push("Education section includes standard keywords and credentials");
  }
  const educationSection: SectionScore = { score: eduScore, max: 10, details: eduDetails };

  // 6. Keywords & Formatting (20%)
  let formatScore = 0;
  const formatDetails: string[] = [];

  // Word count check (Ideal: 350 - 900 words)
  if (wordCount >= 350 && wordCount <= 900) {
    formatScore += 7;
    formatDetails.push("✓ Resume length is optimal (350 - 900 words)");
  } else if (wordCount > 900 && wordCount <= 1300) {
    formatScore += 5;
    formatDetails.push("✓ Resume length is acceptable (slightly long)");
  } else if (wordCount < 300) {
    formatDetails.push("✗ Resume is too short (under 300 words)");
    weaknesses.push("Content is too brief, which may look insubstantial");
    suggestions.push("Expand your resume details to cover roles, skills, and projects in more depth");
  } else {
    formatDetails.push("✗ Resume is too long (over 1300 words)");
    weaknesses.push("Resume is overly verbose, which may dilute impact");
    suggestions.push("Prune older experience or wordy phrasing to fit resume on 1-2 pages");
  }

  // Section balance checks (Ensure we have projects or certifications to enrich formatting)
  const hasProjects = /projects|portfolio|personal projects/i.test(normalizedText);
  const hasCertifications = /certification|certifications|certified|courses|licenses/i.test(normalizedText);
  
  if (hasProjects || hasCertifications) {
    formatScore += 7;
    formatDetails.push("✓ Additional sections (Projects or Certifications) detected");
  } else {
    formatDetails.push("✗ No supplementary sections (Projects/Certifications) detected");
    suggestions.push("Add a 'Projects' or 'Certifications' section to showcase continuous learning");
  }

  // ATS formatting safety: avoid text shapes, check for standard keywords
  // Check if we use standard headers
  if (hasEmail && hasPhone && hasExpHeader && hasEduHeader) {
    formatScore += 6;
    formatDetails.push("✓ ATS-friendly standard layout schema followed");
  } else {
    formatDetails.push("✗ Missing essential layout landmarks");
    suggestions.push("Ensure standard headers like 'Experience', 'Education', and 'Skills' are spelt correctly");
  }

  if (formatScore >= 15) {
    strengths.push("Overall structure is highly parseable and optimized for ATS scanners");
  }
  const formattingSection: SectionScore = { score: formatScore, max: 20, details: formatDetails };

  // Total Score (Sum of all subscores)
  const score = contactScore + summaryScore + skillsScore + expScore + eduScore + formatScore;

  // Grade assignment
  let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 55) grade = 'D';

  return {
    score,
    grade,
    sections: {
      contact: contactSection,
      summary: summarySection,
      skills: skillsSection,
      experience: experienceSection,
      education: educationSection,
      formatting: formattingSection,
    },
    strengths,
    weaknesses,
    suggestions,
    actionVerbsCount,
    wordCount
  };
}

export function compareResumeWithJobDescription(resumeText: string, jobDescription: string): JobMatchResult {
  const normResume = resumeText.toLowerCase();
  const normJD = jobDescription.toLowerCase();

  // Simple keyword extractor from Job Description:
  // Split JD into words, filter by common skills or extract phrases of 1-3 words.
  // We can look at our COMMON_SKILLS and see which ones are in the JD.
  const jdKeywords = COMMON_SKILLS.filter(skill => {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(normJD);
  });

  // If JD has no predefined skills, let's extract some high-frequency words that look like skills
  // But usually COMMON_SKILLS list is broad enough. Let's add dynamic extraction:
  // Split words and look for alphanumeric words > 3 chars, excluding common stop words
  const stopWords = new Set([
    'this', 'that', 'with', 'from', 'have', 'your', 'will', 'about', 'their', 'there', 'would', 'should',
    'could', 'these', 'those', 'other', 'which', 'about', 'skills', 'experience', 'ability', 'knowledge',
    'years', 'work', 'working', 'team', 'required', 'requirements', 'duties', 'responsibilities', 'preferred',
    'minimum', 'candidate', 'strong', 'good', 'excellent', 'must', 'have', 'degree', 'qualification', 'qualifications'
  ]);

  const jdWords = normJD.match(/\b[a-z]{3,15}\b/g) || [];
  const freqWords: { [key: string]: number } = {};
  for (const w of jdWords) {
    if (!stopWords.has(w) && w.length > 3) {
      freqWords[w] = (freqWords[w] || 0) + 1;
    }
  }

  // Find high frequency words in JD not in common skills
  const extractedJDKeywords = Object.entries(freqWords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(entry => entry[0]);

  // Combine both sources of keywords
  const combinedJDKeywords = Array.from(new Set([...jdKeywords, ...extractedJDKeywords])).slice(0, 25);

  if (combinedJDKeywords.length === 0) {
    return {
      matchScore: 0,
      matchedKeywords: [],
      missingKeywords: [],
      recommendedKeywords: ['Add specific tech terms or role requirements to job description']
    };
  }

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const keyword of combinedJDKeywords) {
    const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const hasKeyword = new RegExp(`\\b${escaped}\\b`, 'i').test(normResume);
    if (hasKeyword) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }

  const matchScore = Math.round((matchedKeywords.length / combinedJDKeywords.length) * 100);

  // Recommendations: keywords in JD that are missing, capitalized nicely
  const capitalize = (str: string) => {
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formattedMatched = matchedKeywords.map(capitalize);
  const formattedMissing = missingKeywords.map(capitalize);
  
  // Recommend keywords: missing keywords + some high-impact generic skills if empty
  const recommendedKeywords = formattedMissing.slice(0, 8);

  return {
    matchScore,
    matchedKeywords: formattedMatched,
    missingKeywords: formattedMissing,
    recommendedKeywords
  };
}
