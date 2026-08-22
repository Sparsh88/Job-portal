export interface ResumeAnalysisResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  summary: string;
}

// Canonical Technical Skills & Aliases Dictionary
const SKILL_DICTIONARY: { name: string; aliases: string[]; category: string }[] = [
  // AI / ML / Data Science
  { name: 'LLMs', aliases: ['llm', 'llms', 'large language model', 'large language models'], category: 'AI/ML' },
  { name: 'Deep Learning', aliases: ['deep learning', 'dl', 'neural networks', 'deep neural network'], category: 'AI/ML' },
  { name: 'Machine Learning', aliases: ['machine learning', 'ml', 'statistical modeling'], category: 'AI/ML' },
  { name: 'PyTorch', aliases: ['pytorch', 'torch'], category: 'AI/ML' },
  { name: 'TensorFlow', aliases: ['tensorflow', 'tf', 'keras'], category: 'AI/ML' },
  { name: 'NLP', aliases: ['nlp', 'natural language processing', 'spacy', 'nltk', 'transformers'], category: 'AI/ML' },
  { name: 'Computer Vision', aliases: ['computer vision', 'cv', 'opencv', 'object detection'], category: 'AI/ML' },
  { name: 'Transformers', aliases: ['transformers', 'transformer', 'bert', 'gpt', 'huggingface', 'hugging face'], category: 'AI/ML' },
  { name: 'LangChain', aliases: ['langchain', 'lang-chain', 'llamaindex', 'llama-index'], category: 'AI/ML' },
  { name: 'RAG', aliases: ['rag', 'retrieval-augmented generation', 'vector database', 'vector search'], category: 'AI/ML' },
  { name: 'Python', aliases: ['python', 'python3'], category: 'AI/ML' },
  { name: 'Scikit-Learn', aliases: ['scikit-learn', 'sklearn'], category: 'AI/ML' },
  { name: 'Pandas', aliases: ['pandas', 'numpy'], category: 'AI/ML' },
  { name: 'MLOps', aliases: ['mlops', 'model deployment', 'triton', 'onnx', 'tensorrt'], category: 'AI/ML' },
  { name: 'CUDA', aliases: ['cuda', 'gpu acceleration'], category: 'AI/ML' },
  { name: 'Fine-Tuning', aliases: ['fine-tuning', 'finetuning', 'lora', 'qlora', 'peft', 'rlhf'], category: 'AI/ML' },

  // Frontend
  { name: 'React', aliases: ['react', 'reactjs', 'react.js'], category: 'Frontend' },
  { name: 'TypeScript', aliases: ['typescript', 'ts'], category: 'Frontend' },
  { name: 'JavaScript', aliases: ['javascript', 'js', 'es6'], category: 'Frontend' },
  { name: 'Next.js', aliases: ['nextjs', 'next.js', 'next'], category: 'Frontend' },
  { name: 'Vue.js', aliases: ['vue', 'vuejs', 'vue.js', 'nuxt'], category: 'Frontend' },
  { name: 'Angular', aliases: ['angular', 'angularjs'], category: 'Frontend' },
  { name: 'Tailwind CSS', aliases: ['tailwind', 'tailwindcss', 'tailwind css'], category: 'Frontend' },
  { name: 'HTML5/CSS3', aliases: ['html', 'html5', 'css', 'css3', 'sass', 'scss'], category: 'Frontend' },
  { name: 'Redux', aliases: ['redux', 'zustand', 'recoil', 'mobx'], category: 'Frontend' },
  { name: 'GraphQL', aliases: ['graphql', 'apollo'], category: 'Frontend' },

  // Backend
  { name: 'Node.js', aliases: ['node', 'nodejs', 'node.js'], category: 'Backend' },
  { name: 'Express.js', aliases: ['express', 'expressjs', 'express.js'], category: 'Backend' },
  { name: 'NestJS', aliases: ['nestjs', 'nest.js'], category: 'Backend' },
  { name: 'FastAPI', aliases: ['fastapi', 'fast-api', 'flask', 'django'], category: 'Backend' },
  { name: 'Go / Golang', aliases: ['go', 'golang'], category: 'Backend' },
  { name: 'Java', aliases: ['java', 'spring', 'spring boot'], category: 'Backend' },
  { name: 'C++', aliases: ['c++', 'cpp'], category: 'Backend' },
  { name: 'Rust', aliases: ['rust'], category: 'Backend' },
  { name: 'PostgreSQL', aliases: ['postgres', 'postgresql', 'psql'], category: 'Backend' },
  { name: 'MongoDB', aliases: ['mongodb', 'mongo'], category: 'Backend' },
  { name: 'Redis', aliases: ['redis', 'caching'], category: 'Backend' },
  { name: 'Kafka', aliases: ['kafka', 'rabbitmq', 'message queue'], category: 'Backend' },
  { name: 'Microservices', aliases: ['microservices', 'microservice architecture', 'grpc'], category: 'Backend' },
  { name: 'REST APIs', aliases: ['rest', 'restful', 'rest api', 'rest apis'], category: 'Backend' },
  { name: 'SQL', aliases: ['sql', 'mysql', 'relational database'], category: 'Backend' },

  // DevOps & Cloud
  { name: 'Docker', aliases: ['docker', 'containerization'], category: 'DevOps' },
  { name: 'Kubernetes', aliases: ['kubernetes', 'k8s', 'helm'], category: 'DevOps' },
  { name: 'AWS', aliases: ['aws', 'amazon web services', 's3', 'ec2', 'lambda', 'eks'], category: 'DevOps' },
  { name: 'GCP', aliases: ['gcp', 'google cloud', 'google cloud platform'], category: 'DevOps' },
  { name: 'Azure', aliases: ['azure', 'microsoft azure'], category: 'DevOps' },
  { name: 'Terraform', aliases: ['terraform', 'iac', 'infrastructure as code'], category: 'DevOps' },
  { name: 'CI/CD', aliases: ['ci/cd', 'cicd', 'github actions', 'jenkins', 'gitlab ci'], category: 'DevOps' },
  { name: 'Linux', aliases: ['linux', 'unix', 'bash', 'shell scripting'], category: 'DevOps' },

  // Mobile / Testing / Security
  { name: 'React Native', aliases: ['react native', 'flutter', 'ios', 'android', 'swift', 'kotlin'], category: 'Mobile' },
  { name: 'Unit & E2E Testing', aliases: ['jest', 'cypress', 'playwright', 'pytest', 'unit testing'], category: 'Testing' },
  { name: 'Cybersecurity', aliases: ['oauth', 'jwt', 'owasp', 'penetration testing', 'encryption'], category: 'Security' },
];

/**
 * Intelligent Skill Extractor using dictionary lookups and custom regex phrase extraction
 */
export const extractSkillsFromText = (text: string): string[] => {
  if (!text || typeof text !== 'string') return [];
  const lowerText = text.toLowerCase();
  const foundSkills = new Set<string>();

  // 1. Match against known dictionary
  for (const item of SKILL_DICTIONARY) {
    for (const alias of item.aliases) {
      // Regex boundary match: escape special characters
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');
      if (regex.test(lowerText) || lowerText.includes(alias)) {
        foundSkills.add(item.name);
        break;
      }
    }
  }

  // 2. Also extract user comma/bullet-separated explicit custom phrases
  const rawPhrases = text
    .split(/[\n,;•\/\\]+/)
    .map((p) => p.trim())
    .filter((p) => p.length >= 2 && p.length <= 35 && !/^(and|the|with|for|our|your|looking|developer|engineer|role|candidate)$/i.test(p));

  for (const phrase of rawPhrases) {
    const cleanPhrase = phrase.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
    if (cleanPhrase.length >= 2 && cleanPhrase.length <= 25) {
      // Capitalize words nicely
      const formatted = cleanPhrase
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      
      // If it looks like a distinct keyword not already covered
      if (!Array.from(foundSkills).some((s) => s.toLowerCase() === formatted.toLowerCase())) {
        foundSkills.add(formatted);
      }
    }
  }

  return Array.from(foundSkills);
};

/**
 * Compare candidate resume skills against job requirements with realistic match scoring
 */
export const analyzeResumeAndJob = (jobDescription: string, resumeText: string): ResumeAnalysisResult => {
  const reqSkills = extractSkillsFromText(jobDescription);
  const candSkills = extractSkillsFromText(resumeText);

  // If very few requirements extracted, dynamically extract significant keywords from job description
  let effectiveRequired = reqSkills;
  if (effectiveRequired.length === 0) {
    effectiveRequired = jobDescription
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z0-9]/g, ''))
      .filter((w) => w.length > 3 && !/^(with|that|this|have|from|will|must|experience|years|requirements|about|team|work|looking)$/i.test(w))
      .slice(0, 6)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  }

  const candSkillsLower = candSkills.map((s) => s.toLowerCase().trim());
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const req of effectiveRequired) {
    const reqLower = req.toLowerCase().trim();
    // Check direct equality or substring inclusion
    const isMatched = candSkillsLower.some((cand) => {
      if (cand === reqLower) return true;
      if (cand.includes(reqLower) || reqLower.includes(cand)) return true;
      // Check aliases in dictionary
      const dictItem = SKILL_DICTIONARY.find((d) => d.name.toLowerCase() === reqLower || d.aliases.includes(reqLower));
      if (dictItem) {
        return dictItem.aliases.some((a) => cand.includes(a) || cand === a);
      }
      return false;
    });

    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  }

  // Calculate dynamic match score
  let score = 50;
  if (effectiveRequired.length > 0) {
    const ratio = matchedSkills.length / effectiveRequired.length;
    if (matchedSkills.length === 0) {
      score = Math.max(18, Math.round(18 + candSkills.length * 3));
      if (score > 38) score = 38;
    } else {
      score = Math.round(45 + ratio * 48);
      if (candSkills.length >= matchedSkills.length + 2) score += 4;
      if (score > 98) score = 98;
    }
  } else {
    score = candSkills.length > 0 ? 82 : 60;
  }

  // Generate tailored recommendations based on missing skills & domain
  const recommendations: string[] = [];
  const isAI = /ai|ml|machine learning|deep learning|llm|neural|pytorch|model/i.test(jobDescription + ' ' + resumeText);
  const isDevOps = /docker|k8s|kubernetes|cloud|aws|gcp|terraform|ci\/cd/i.test(jobDescription);
  const isBackend = /backend|api|database|sql|postgres|microservices|distributed/i.test(jobDescription);
  const isFrontend = /frontend|ui|ux|react|web|css|javascript|typescript/i.test(jobDescription);

  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 3).join(', ');
    recommendations.push(`Target High-Priority Skills: Highlight hands-on project experience in ${topMissing} to address specific job post gaps.`);
  }

  if (isAI) {
    recommendations.push('AI/ML Focus: Showcase model evaluation benchmarks (e.g. latency, accuracy, perplexity) and fine-tuning or RAG architecture deployments.');
  } else if (isDevOps) {
    recommendations.push('Cloud & DevOps Focus: Include details on automated CI/CD deployment pipelines, container orchestration, and infrastructure cost optimization.');
  } else if (isBackend) {
    recommendations.push('Backend Architecture: Highlight query performance optimization, database indexing, and high-concurrency API benchmarks.');
  } else if (isFrontend) {
    recommendations.push('Frontend Quality: Mention Core Web Vitals optimization, responsive state architecture, and cross-browser testing coverage.');
  }

  recommendations.push('Quantify Impact: Add numerical metrics (e.g., "reduced latency by 35%", "scaled to 50k DAU") in your resume bullet points.');

  return {
    matchScore: score,
    matchedSkills: Array.from(new Set(matchedSkills)),
    missingSkills: Array.from(new Set(missingSkills)),
    recommendations,
    summary:
      score >= 80
        ? 'Excellent candidate alignment! Your skill set closely matches the core technical requirements.'
        : score >= 55
        ? 'Moderate candidate alignment. Adding the missing required skills and metrics will significantly improve your interview odds.'
        : 'Low skill overlap. Consider tailoring your resume with key domain technologies required by this role.',
  };
};

export const calculateSkillMatch = (
  candidateSkills: string[],
  requiredSkills: string[]
): ResumeAnalysisResult => {
  return analyzeResumeAndJob(requiredSkills.join(', '), candidateSkills.join(', '));
};

// Domain-Specific Mock Interview Question Banks
export const INTERVIEW_QUESTIONS_BY_CATEGORY: Record<string, string[]> = {
  'Artificial Intelligence': [
    'How do you mitigate catastrophic forgetting and handle hallucination when fine-tuning or prompting Large Language Models (LLMs)?',
    'Explain the mathematical difference between Transformer self-attention and cross-attention mechanisms, and why FlashAttention improves GPU memory efficiency.',
    'Describe your workflow for training a deep learning model, including data preprocessing, avoiding overfitting with regularization, and optimizing inference latency (e.g., quantization, ONNX, TensorRT).',
    'How do you evaluate generative AI systems (e.g., RAG architectures) using metrics like faithfulness, answer relevancy, and context recall?',
    'What is the architectural difference between Supervised Fine-Tuning (SFT), LoRA/QLoRA parameter-efficient tuning, and RLHF/DPO alignment?',
  ],
  'Frontend Engineering': [
    'Explain how the React Virtual DOM diffing algorithm minimizes DOM mutations, and how React 18 Concurrent features improve UI responsiveness.',
    'How would you diagnose and optimize Core Web Vitals (LCP, INP, CLS) in a large single-page application with heavy component trees?',
    'Describe how you design a resilient global state management architecture and handle asynchronous cache invalidation in modern TypeScript applications.',
    'Explain how utility-first CSS (Tailwind) compares to CSS Modules and CSS-in-JS in terms of runtime overhead, bundle size, and build performance.',
  ],
  'Backend Engineering': [
    'How do you design a high-throughput, low-latency microservices architecture using event-driven communication (e.g., Kafka / RabbitMQ) and distributed caching (Redis)?',
    'Describe a situation where you diagnosed and optimized an expensive PostgreSQL query or resolved deadlocked database transactions under high load.',
    'How do you design a scalable JWT authentication and authorization system with short-lived access tokens, refresh token rotation, and instant revocation?',
    'Explain how you handle distributed transactions and eventual consistency across multiple microservice databases (e.g., Saga pattern, Outbox pattern).',
  ],
  'Software Engineering': [
    'Can you describe a challenging technical architecture decision you made recently, the trade-offs you considered, and the eventual outcome?',
    'How do you design fault-tolerant systems that gracefully degrade during third-party dependency outages or unexpected traffic spikes?',
    'Explain your approach to test-driven development (TDD), CI/CD pipeline automation, and zero-downtime canary deployments.',
    'How do you manage technical debt and balance architectural refactoring with delivering fast business features?',
  ],
  'DevOps & Cloud': [
    'How do you design and manage a zero-downtime Kubernetes deployment pipeline with Helm, GitOps (ArgoCD), and progressive canary rollouts?',
    'Explain your strategy for implementing infrastructure as code (IaC) with Terraform, including state management and drift detection across multi-region cloud environments.',
    'How do you configure comprehensive observability (distributed tracing, Prometheus metrics, ELK logging, and automated alerting) for cloud-native microservices?',
    'Describe how you secure cloud infrastructure against common vulnerabilities (IAM least privilege, VPC peering, secrets management with HashiCorp Vault).',
  ],
  'Data Science & Engineering': [
    'How do you architect a scalable real-time and batch ETL pipeline using Apache Spark, Kafka, and modern cloud data warehouses like Snowflake or BigQuery?',
    'Describe how you ensure data quality, schema evolution, and pipeline idempotency when processing terabytes of unstructured event data daily.',
    'Explain the differences between OLTP and OLAP architectures, columnar storage formats (Parquet/ORC), and partitioning strategies.',
  ],
  'Cybersecurity': [
    'How do you conduct threat modeling and implement defense-in-depth security architecture for public-facing cloud APIs?',
    'Explain the mechanics of OWASP Top 10 vulnerabilities (such as SSRF, SQL Injection, IDOR, and Broken Object Level Authorization) and their remediation.',
    'Describe how you implement zero-trust network access (ZTNA), mTLS between microservices, and automated vulnerability scanning in CI/CD.',
  ],
};

export const generateMockInterviewQuestions = (jobCategory: string): string[] => {
  const normalized = (jobCategory || '').toLowerCase();
  
  if (normalized.includes('ai') || normalized.includes('ml') || normalized.includes('artificial') || normalized.includes('intelligence') || normalized.includes('machine')) {
    return INTERVIEW_QUESTIONS_BY_CATEGORY['Artificial Intelligence'];
  }
  if (normalized.includes('front')) {
    return INTERVIEW_QUESTIONS_BY_CATEGORY['Frontend Engineering'];
  }
  if (normalized.includes('back')) {
    return INTERVIEW_QUESTIONS_BY_CATEGORY['Backend Engineering'];
  }
  if (normalized.includes('devops') || normalized.includes('cloud')) {
    return INTERVIEW_QUESTIONS_BY_CATEGORY['DevOps & Cloud'];
  }
  if (normalized.includes('data')) {
    return INTERVIEW_QUESTIONS_BY_CATEGORY['Data Science & Engineering'];
  }
  if (normalized.includes('security')) {
    return INTERVIEW_QUESTIONS_BY_CATEGORY['Cybersecurity'];
  }
  
  return INTERVIEW_QUESTIONS_BY_CATEGORY['Software Engineering'];
};

export const evaluateInterviewResponse = (question: string, userResponse: string, category?: string) => {
  if (!userResponse || !userResponse.trim()) {
    return {
      score: 0,
      clarity: 'Low',
      feedback: 'No answer was provided. Please type a comprehensive explanation to receive scoring.',
      suggestions: ['Provide a structured answer with technical terminology, concepts, and real-world examples.'],
    };
  }

  const words = userResponse.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lowerAnswer = userResponse.toLowerCase();
  const lowerQuestion = (question || '').toLowerCase();

  let score = 50;

  // Length and depth assessment
  if (wordCount >= 20) score += 15;
  if (wordCount >= 50) score += 15;
  if (wordCount >= 100) score += 8;

  // Keywords and technical signals
  const technicalSignals = [
    'because', 'for example', 'tradeoff', 'trade-off', 'latency', 'scale', 'performance',
    'architecture', 'database', 'optimization', 'cache', 'security', 'pipeline', 'metric',
    'memory', 'algorithm', 'model', 'component', 'state', 'pattern', 'concurrency', 'error handling'
  ];
  let signalsFound = 0;
  for (const sig of technicalSignals) {
    if (lowerAnswer.includes(sig)) signalsFound++;
  }
  score += Math.min(signalsFound * 3, 15);

  // Check relevance to question keywords
  const questionKeywords = lowerQuestion
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ''))
    .filter((w) => w.length > 3 && !/^(explain|describe|what|how|which|your|with|does|when)$/i.test(w));

  let matchedQuestionKeywords = 0;
  for (const kw of questionKeywords) {
    if (lowerAnswer.includes(kw)) matchedQuestionKeywords++;
  }
  if (questionKeywords.length > 0 && matchedQuestionKeywords > 0) {
    score += Math.min(matchedQuestionKeywords * 4, 12);
  }

  if (score > 96) score = 96;
  if (score < 30) score = 30;

  const suggestions: string[] = [];
  if (wordCount < 40) {
    suggestions.push('Elaborate further on architectural trade-offs, edge cases, and failure modes.');
  }
  if (!lowerAnswer.includes('metric') && !lowerAnswer.includes('percent') && !/\d+/.test(lowerAnswer)) {
    suggestions.push('Include quantifiable engineering metrics (e.g., % latency reduction, memory savings, throughput improvements).');
  }
  if (!lowerAnswer.includes('example') && !lowerAnswer.includes('production')) {
    suggestions.push('Anchor your answer with a concrete production scenario or practical system implementation.');
  }

  let feedback = 'Solid technical answer covering the core concepts.';
  if (score >= 85) {
    feedback = 'Exceptional response! You demonstrated strong technical depth, clear structural communication, and an understanding of real-world trade-offs.';
  } else if (score >= 70) {
    feedback = 'Good response! You hit the main technical points. Adding more concrete examples and quantitative metrics would elevate this to a staff/lead level.';
  } else {
    feedback = 'Fair attempt. Consider providing a deeper explanation of the underlying mechanism, trade-offs, and concrete technical solutions.';
  }

  return {
    score,
    clarity: score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low',
    feedback,
    suggestions: suggestions.slice(0, 2),
  };
};
