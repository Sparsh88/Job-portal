export type Role = 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN';

export interface AIMatchScoreResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  profile?: Profile;
  company?: Company;
}

export interface Profile {
  id: string;
  userId: string;
  bio?: string;
  title?: string;
  phone?: string;
  location?: string;
  skills: string[];
  experienceYears: number;
  resumeUrl?: string;
  resumeName?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  targetRole?: string;
  expectedSalary?: number;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  description: string;
  industry: string;
  location: string;
  companySize: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE';
  salaryMin: number;
  salaryMax: number;
  isFeatured: boolean;
  skillsRequired: string[];
  recruiterId: string;
  companyId: string;
  company: Company;
  aiMatchScore?: number;
  createdAt: string;
  _count?: {
    applications: number;
  };
}

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  applicantId: string;
  applicant?: User;
  resumeUrl?: string;
  coverLetter?: string;
  status: 'APPLIED' | 'IN_REVIEW' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'REJECTED' | 'ACCEPTED';
  matchScore: number;
  recruiterFeedback?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  link?: string;
  createdAt: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  application: Application;
  scheduledAt: string;
  durationMins: number;
  meetingLink?: string;
  format: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}
