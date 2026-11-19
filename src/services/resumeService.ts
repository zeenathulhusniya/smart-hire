import { ResumeAnalysisResult } from '../types';
import { generateId } from '../utils/formatters';
import { apiRequest } from './apiClient';

const COMMON_TECH_KEYWORDS = [
  'Java',
  'Java 21',
  'Spring Boot',
  'Spring Security',
  'Hibernate',
  'JPA',
  'MySQL',
  'PostgreSQL',
  'SQL',
  'React',
  'TypeScript',
  'JavaScript',
  'HTML5',
  'CSS3',
  'Tailwind CSS',
  'REST API',
  'JWT',
  'Docker',
  'Git',
  'JUnit',
  'Mockito',
  'Maven',
  'Postman',
  'Swagger',
  'Selenium',
  'QA Testing',
  'Figma',
  'UI/UX',
  'Linux',
  'Python',
  'Node.js',
  'SEO',
  'Data Analysis',
  'Customer Support',
];

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  return COMMON_TECH_KEYWORDS.filter((kw) => {
    const escaped = kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(lower);
  });
}

function buildDemoPreviewAnalysis(
  fileName: string,
  targetRole: string,
  resumeText: string,
  jobDescription: string
): ResumeAnalysisResult {
  const jdSkills = extractKeywords(jobDescription);
  const resumeSkills = extractKeywords(resumeText);

  const effectiveJdSkills =
    jdSkills.length > 0
      ? jdSkills
      : ['Java', 'Spring Boot', 'MySQL', 'React', 'TypeScript', 'REST API', 'Git'];

  const matchedSkills = effectiveJdSkills.filter((skill) =>
    resumeSkills.some((rs) => rs.toLowerCase() === skill.toLowerCase())
  );
  const missingSkills = effectiveJdSkills.filter(
    (skill) => !matchedSkills.some((ms) => ms.toLowerCase() === skill.toLowerCase())
  );

  const ratio =
    effectiveJdSkills.length > 0
      ? matchedSkills.length / effectiveJdSkills.length
      : 0;
  const matchScore = Math.min(96, Math.max(22, Math.round(ratio * 85 + (resumeText.length > 300 ? 12 : 4))));

  const strengths: string[] = [];
  if (matchedSkills.length > 0) {
    strengths.push(
      `Direct skill alignment detected for ${matchedSkills.slice(0, 4).join(', ')}.`
    );
  }
  if (/project|github|internship|developed|built|api/i.test(resumeText)) {
    strengths.push('Includes hands-on implementation or project verbs relevant to remote technical hiring.');
  }
  if (strengths.length === 0) {
    strengths.push('PDF uploaded and text structure inspected successfully.');
  }

  const improvementSuggestions = [
    'Quantify project outcomes (e.g., API latency improvements, test coverage %, or active users).',
    'Include a dedicated "Remote Readiness" line highlighting async collaboration tools (Git, Jira, Swagger).',
    missingSkills.length > 0
      ? `Add evidence or personal projects demonstrating ${missingSkills.slice(0, 3).join(', ')}.`
      : 'Tailor your professional summary to explicitly mention availability for Sri Lanka remote work.',
  ];

  const recommendedLearningAreas =
    missingSkills.length > 0
      ? missingSkills.map((s) => `${s} fundamentals & hands-on mini project`)
      : ['Docker containerization & CI/CD pipelines', 'System design basics for remote interviews'];

  return {
    id: generateId('res'),
    fileName,
    targetRole: targetRole || 'Remote Software Role',
    matchScore,
    matchedSkills,
    missingSkills,
    strengths,
    improvementSuggestions,
    recommendedLearningAreas,
    extractedPreview: resumeText.slice(0, 800),
    analysisSource: 'DEMO_PREVIEW',
    createdAt: new Date().toISOString(),
  };
}

export const resumeService = {
  async analyzeResume(params: {
    file: File | null;
    resumeText: string;
    targetRole: string;
    jobDescription: string;
  }): Promise<ResumeAnalysisResult> {
    try {
      const formData = new FormData();
      if (params.file) {
        formData.append('file', params.file);
      }
      formData.append('resumeText', params.resumeText);
      formData.append('targetRole', params.targetRole);
      formData.append('jobDescription', params.jobDescription);

      return await apiRequest<ResumeAnalysisResult>('/resume/analyze', {
        method: 'POST',
        body: formData,
      });
    } catch {
      return buildDemoPreviewAnalysis(
        params.file?.name || 'pasted-resume.pdf',
        params.targetRole,
        params.resumeText,
        params.jobDescription
      );
    }
  },

  async fetchHistory(): Promise<ResumeAnalysisResult[] | null> {
    try {
      return await apiRequest<ResumeAnalysisResult[]>('/resume/history', {
        method: 'GET',
      });
    } catch {
      return null;
    }
  },
};
