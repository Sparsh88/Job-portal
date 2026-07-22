export interface ResumeAnalysisResult {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  summary: string;
}

export const calculateSkillMatch = (
  candidateSkills: string[],
  requiredSkills: string[]
): ResumeAnalysisResult => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchScore: 85,
      matchingSkills: candidateSkills,
      missingSkills: [],
      recommendations: ['Highlight relevant project experience to stand out.'],
      summary: 'Strong candidate alignment based on general background.',
    };
  }

  const candidateSkillsLower = candidateSkills.map((s) => s.toLowerCase().trim());
  const requiredSkillsLower = requiredSkills.map((s) => s.toLowerCase().trim());

  const matchingSkills = requiredSkills.filter((skill) =>
    candidateSkillsLower.includes(skill.toLowerCase().trim())
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !candidateSkillsLower.includes(skill.toLowerCase().trim())
  );

  const matchRatio = matchingSkills.length / requiredSkills.length;
  // Calculate score between 55% and 98%
  let score = Math.round(55 + matchRatio * 43);
  if (candidateSkills.length > 5) score += 3;
  if (score > 98) score = 98;

  const recommendations: string[] = [];
  if (missingSkills.length > 0) {
    recommendations.push(`Consider acquiring or highlighting experience in: ${missingSkills.join(', ')}.`);
  }
  recommendations.push('Tailor your bullet points with quantitative results (e.g., improved latency by 35%).');
  recommendations.push('Add a modern GitHub repository or live demo link in your profile.');

  return {
    matchScore: score,
    matchingSkills,
    missingSkills,
    recommendations,
    summary:
      score > 80
        ? 'Excellent candidate fit! Your tech stack heavily overlaps with key job requirements.'
        : 'Good match potential. Adding missing core skills could boost your interview odds.',
  };
};

export const generateMockInterviewQuestions = (jobCategory: string) => {
  const defaultQuestions = [
    {
      id: 1,
      question: 'Can you describe a challenging technical architecture decision you made recently and its outcome?',
      category: 'System Design',
    },
    {
      id: 2,
      question: 'How do you optimize slow SQL queries or API endpoints in production environments?',
      category: 'Performance Tuning',
    },
    {
      id: 3,
      question: 'Describe how you manage state and async side effects in high-traffic frontend applications.',
      category: 'Frontend Engineering',
    },
    {
      id: 4,
      question: 'How do you handle disagreement with team members regarding code design or technical debt?',
      category: 'Behavioral & Leadership',
    },
  ];
  return defaultQuestions;
};

export const evaluateInterviewResponse = (userResponse: string) => {
  const wordCount = userResponse.trim().split(/\s+/).length;
  let score = 75;
  if (wordCount > 40) score += 15;
  if (userResponse.toLowerCase().includes('result') || userResponse.toLowerCase().includes('metrics')) score += 5;

  return {
    score: Math.min(score, 96),
    clarity: 'High',
    feedback: 'Strong response structure using clear technical terminology and problem-solving flow.',
    suggestions: ['Include quantifiable metrics (e.g. % performance increase) to strengthen credibility.'],
  };
};
