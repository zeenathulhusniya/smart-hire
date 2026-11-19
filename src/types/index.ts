export const JOB_CATEGORIES = [
  'Java Developer',
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Software Engineering Intern',
  'QA Tester',
  'UI/UX Designer',
  'Graphic Designer',
  'Data Entry',
  'Customer Support',
  'Virtual Assistant',
  'Digital Marketing',
  'Content Writer',
  'Data Analyst',
  'IT Support',
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];

export type EmploymentType =
  | 'Full-time'
  | 'Part-time'
  | 'Internship'
  | 'Freelance'
  | 'Contract';

export type ExperienceLevel =
  | 'Internship'
  | 'Entry-level'
  | 'Junior'
  | 'Mid-level'
  | 'Senior';

export type RemoteStatus = 'FULLY_REMOTE';

export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'REJECTED' | 'EXPIRED';

export interface RemoteJob {
  id: string;
  companyName: string;
  companyLogoText: string;
  companyAccentColor: string;
  jobTitle: string;
  category: JobCategory;
  description: string;
  responsibilities: string[];
  requirements: string[];
  salaryMin: number;
  salaryMax: number;
  currency: 'LKR' | 'USD' | 'GBP' | 'EUR';
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  requiredSkills: string[];
  remoteStatus: RemoteStatus;
  eligibleCountries: string[];
  sriLankaEligible: boolean;
  jobSource: string;
  originalUrl: string;
  verificationStatus: VerificationStatus;
  postedDate: string;
  expiryDate: string;
  lastVerifiedAt: string;
  isDemoSample?: boolean;
}

export type ApplicationStatus =
  | 'Wishlist'
  | 'Applied'
  | 'Under Review'
  | 'Interview'
  | 'Offered'
  | 'Rejected';

export interface JobApplication {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  location: string;
  salary: string;
  applicationDate: string;
  jobUrl: string;
  jobDescription: string;
  notes: string;
  status: ApplicationStatus;
  followUpDate: string;
  createdAt: string;
  updatedAt: string;
  isDemoSample?: boolean;
}

export interface ApplicationActivity {
  id: string;
  applicationId: string;
  companyName: string;
  jobTitle: string;
  action: string;
  timestamp: string;
}

export type InterviewType =
  | 'HR Screening'
  | 'Technical'
  | 'System Design'
  | 'Behavioral'
  | 'Final';

export type InterviewStatus =
  | 'Scheduled'
  | 'Completed'
  | 'Rescheduled'
  | 'Cancelled';

export interface Interview {
  id: string;
  userId: string;
  company: string;
  jobTitle: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: InterviewType;
  meetingLink: string;
  notes: string;
  status: InterviewStatus;
  createdAt: string;
}

export type ReminderType =
  | 'Follow-up'
  | 'Interview'
  | 'Application Deadline';

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description: string;
  reminderType: ReminderType;
  dueDate: string;
  dueTime: string;
  relatedCompany?: string;
  completed: boolean;
  createdAt: string;
}

export interface ResumeAnalysisResult {
  id: string;
  fileName: string;
  targetRole: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  improvementSuggestions: string[];
  recommendedLearningAreas: string[];
  extractedPreview: string;
  analysisSource: 'GEMINI_BACKEND' | 'DEMO_PREVIEW';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language: 'en' | 'ta';
  source: 'GEMINI_BACKEND' | 'DEMO_PREVIEW';
  timestamp: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  targetRole: string;
  experienceLevel: ExperienceLevel;
  bio: string;
  skills: string[];
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  preferredLanguage: 'en' | 'ta';
  emailRemindersEnabled: boolean;
  interviewAlertsEnabled: boolean;
  deadlineAlertsEnabled: boolean;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
  mode: 'LIVE_BACKEND' | 'DEMO_PREVIEW';
}

export interface AnalyticsSummary {
  totalApplications: number;
  appliedCount: number;
  underReviewCount: number;
  wishlistCount: number;
  interviewCount: number;
  offerCount: number;
  rejectionCount: number;
  interviewConversionRate: number;
  offerConversionRate: number;
  statusDistribution: { status: ApplicationStatus; count: number }[];
  monthlyTrends: { month: string; count: number }[];
  weeklyTrends: { week: string; count: number }[];
  companyStats: { company: string; applications: number; interviews: number; offers: number }[];
}
