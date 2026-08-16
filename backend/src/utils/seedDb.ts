import { prisma } from '../config/db';
import bcrypt from 'bcryptjs';

export async function seedDatabaseIfEmpty() {
  try {
    // Under no circumstances should we auto-seed in production unless explicitly enabled
    if (process.env.NODE_ENV === 'production' && process.env.ENABLE_AUTO_SEEDING !== 'true') {
      console.log('ℹ️ Auto-seeding is disabled in production. Set ENABLE_AUTO_SEEDING=true to enable.');
      return;
    }

    const jobCount = await prisma.job.count();
    // If jobs are 20 or more, DB is up to date
    if (jobCount >= 20) {
      console.log(`ℹ️ Database already contains ${jobCount} jobs. Skipping auto-seed.`);
      return;
    }

    console.log('🌱 Auto-seeding database with 4+ jobs per section including Full Stack Web Development...');

    // Clean existing tables to avoid duplicate key errors
    await prisma.notification.deleteMany({});
    await prisma.interview.deleteMany({});
    await prisma.application.deleteMany({});
    await prisma.savedJob.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.job.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.profile.deleteMany({});
    await prisma.user.deleteMany({});

    const adminEmail = process.env.SEED_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'sparshchauhan050@gmail.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'Sp@080806';
    
    // Safety check: print a warning if using default credentials in production
    if (process.env.NODE_ENV === 'production' && adminPassword === 'Password123!') {
      console.warn('⚠️ WARNING: Seeding admin with default password "Password123!" in production is highly insecure. Please set SEED_ADMIN_PASSWORD in environment variables.');
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // 1. Admin User
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Sparsh Chauhan',
        passwordHash,
        role: 'ADMIN',
        isVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
    });

    // 2. Recruiters & Companies
    const recruiter1 = await prisma.user.create({
      data: {
        email: 'recruiter@techcorp.com',
        name: 'Sarah Jenkins',
        passwordHash,
        role: 'RECRUITER',
        isVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      },
    });

    const company1 = await prisma.company.create({
      data: {
        name: 'NexusTech Solutions',
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        website: 'https://nexustech.io',
        description: 'Building next-generation AI enterprise platforms & Cloud infrastructure.',
        industry: 'Artificial Intelligence & Software',
        location: 'San Francisco, CA / Remote',
        companySize: '250-500 employees',
        recruiterId: recruiter1.id,
      },
    });

    const recruiter2 = await prisma.user.create({
      data: {
        email: 'hiring@innovatelabs.ai',
        name: 'Alex Rivera',
        passwordHash,
        role: 'RECRUITER',
        isVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      },
    });

    const company2 = await prisma.company.create({
      data: {
        name: 'Innovate Labs',
        logoUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&auto=format&fit=crop&q=80',
        website: 'https://innovatelabs.ai',
        description: 'Fintech and decentralized infrastructure empowering digital finance.',
        industry: 'FinTech & AI',
        location: 'New York, NY',
        companySize: '100-250 employees',
        recruiterId: recruiter2.id,
      },
    });

    const recruiter3 = await prisma.user.create({
      data: {
        email: 'security@cyberdefenselabs.io',
        name: 'David Vance',
        passwordHash,
        role: 'RECRUITER',
        isVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
    });

    const company3 = await prisma.company.create({
      data: {
        name: 'CyberDefense Labs',
        logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80',
        website: 'https://cyberdefenselabs.io',
        description: 'Zero-trust security, penetration testing, and enterprise threat intelligence.',
        industry: 'Cybersecurity & Ethical Hacking',
        location: 'Washington, DC / Remote',
        companySize: '50-100 employees',
        recruiterId: recruiter3.id,
      },
    });

    const recruiter4 = await prisma.user.create({
      data: {
        email: 'careers@cloudscalesolutions.com',
        name: 'Elena Rostova',
        passwordHash,
        role: 'RECRUITER',
        isVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      },
    });

    const company4 = await prisma.company.create({
      data: {
        name: 'CloudScale Infrastructure',
        logoUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=120&auto=format&fit=crop&q=80',
        website: 'https://cloudscalesolutions.com',
        description: 'Hyperscale Kubernetes orchestration, multi-cloud Terraform pipelines & SRE automation.',
        industry: 'Cloud & DevOps',
        location: 'Seattle, WA / Remote',
        companySize: '500+ employees',
        recruiterId: recruiter4.id,
      },
    });

    const recruiter5 = await prisma.user.create({
      data: {
        email: 'hr@datamatrixai.org',
        name: 'Marcus Chen',
        passwordHash,
        role: 'RECRUITER',
        isVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      },
    });

    const company5 = await prisma.company.create({
      data: {
        name: 'DataMatrix Analytics',
        logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
        website: 'https://datamatrixai.org',
        description: 'Big data lakehouse architectures, real-time streaming, and predictive data science.',
        industry: 'Data Science & Big Data',
        location: 'Boston, MA / Remote',
        companySize: '150-300 employees',
        recruiterId: recruiter5.id,
      },
    });

    // 3. Candidates
    const candidate1 = await prisma.user.create({
      data: {
        email: 'alex.developer@gmail.com',
        name: 'Alex Johnson',
        passwordHash,
        role: 'JOB_SEEKER',
        isVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        profile: {
          create: {
            bio: 'Full-stack software engineer with 4+ years of React, Node.js, and TypeScript experience.',
            title: 'Senior Full Stack Engineer',
            phone: '+1 (555) 234-5678',
            location: 'Austin, TX',
            skills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'GraphQL', 'Tailwind CSS', 'Docker'],
            experienceYears: 4,
            resumeUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
            resumeName: 'Alex_Johnson_Resume_2026.pdf',
            githubUrl: 'https://github.com/alexjohnson',
            linkedinUrl: 'https://linkedin.com/in/alexjohnson',
            portfolioUrl: 'https://alexjohnson.dev',
            targetRole: 'Senior Frontend / Fullstack Engineer',
            expectedSalary: 140000,
          },
        },
      },
      include: { profile: true },
    });

    const candidate2 = await prisma.user.create({
      data: {
        email: 'priya.ai@gmail.com',
        name: 'Priya Sharma',
        passwordHash,
        role: 'JOB_SEEKER',
        isVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        profile: {
          create: {
            bio: 'AI Machine Learning Engineer specialized in PyTorch, LLMs, and Python Backend APIs.',
            title: 'AI / Machine Learning Engineer',
            phone: '+1 (555) 987-6543',
            location: 'Seattle, WA',
            skills: ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'FastAPI', 'Docker', 'AWS', 'PostgreSQL'],
            experienceYears: 3,
            resumeUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
            resumeName: 'Priya_Sharma_ML_Resume.pdf',
            githubUrl: 'https://github.com/priyasharma',
            linkedinUrl: 'https://linkedin.com/in/priyasharma',
            targetRole: 'Machine Learning Engineer',
            expectedSalary: 155000,
          },
        },
      },
      include: { profile: true },
    });

    // 4. Jobs (4 in Full Stack, 4 in Cybersecurity, 4 in AI/ML, 4 in Cloud & DevOps, 4 in Data Science - ALL REMOTE)

    // --- SECTION A: FULL STACK WEB DEVELOPMENT (4 Jobs) ---
    const jobFS1 = await prisma.job.create({
      data: {
        title: 'Senior Full Stack Web Developer (React 19 + Node.js)',
        description: `Lead the end-to-end design and architecture of modern scalable web applications.

Key Responsibilities:
- Build high-performance React 19 web frontends with TypeScript and Tailwind CSS.
- Architect RESTful & GraphQL microservice backends with Node.js, Express, and PostgreSQL.
- Implement JWT authentication, Redis caching, and CI/CD automated deployments.

Requirements:
- 4+ years of experience with React, TypeScript, Node.js, and relational databases.`,
        category: 'Full Stack Web Development',
        location: 'San Francisco, CA / Remote',
        jobType: 'REMOTE',
        experienceLevel: 'SENIOR',
        salaryMin: 140000,
        salaryMax: 175000,
        isFeatured: true,
        skillsRequired: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'GraphQL'],
        recruiterId: recruiter1.id,
        companyId: company1.id,
      },
    });

    await prisma.job.create({
      data: {
        title: 'Lead Full Stack Web Engineer (Next.js + Python/FastAPI)',
        description: `Architect server-side rendered (SSR) web applications and AI-driven API services.

Key Responsibilities:
- Develop modern responsive interfaces using Next.js App Router and React Server Components.
- Build high-throughput Python FastAPI microservices with PostgreSQL and Redis.
- Optimize web core vitals, SEO, and application load times under heavy traffic.

Requirements:
- 5+ years building production full-stack web applications with Next.js, Python, and Docker.`,
        category: 'Full Stack Web Development',
        location: 'New York, NY / Remote',
        jobType: 'REMOTE',
        experienceLevel: 'LEAD',
        salaryMin: 150000,
        salaryMax: 190000,
        isFeatured: true,
        skillsRequired: ['Next.js', 'React', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
        recruiterId: recruiter2.id,
        companyId: company2.id,
      },
    });

    await prisma.job.create({
      data: {
        title: 'MERN Stack & Cloud Web Developer',
        description: `Build real-time collaborative web portals and decentralized web tools.

Key Responsibilities:
- Develop full-stack MERN (MongoDB, Express, React, Node.js) web interfaces.
- Integrate WebSockets for live candidate/recruiter notification & collaboration features.
- Deploy containerized web services on AWS ECS and Vercel.

Requirements:
- 3+ years experience in MERN stack development, WebSockets, and AWS cloud deployment.`,
        category: 'Full Stack Web Development',
        location: 'Austin, TX / Remote',
        jobType: 'REMOTE',
        experienceLevel: 'MID',
        salaryMin: 135000,
        salaryMax: 170000,
        isFeatured: false,
        skillsRequired: ['MongoDB', 'Express', 'React', 'Node.js', 'AWS', 'WebSockets', 'Tailwind CSS'],
        recruiterId: recruiter1.id,
        companyId: company1.id,
      },
    });

    await prisma.job.create({
      data: {
        title: 'Full Stack Product Engineer (Vue.js / Nuxt + Go)',
        description: `Develop reactive web applications paired with low-latency Go backend microservices.

Key Responsibilities:
- Create sleek, accessible web UIs using Vue 3, Nuxt.js, and Pinia state management.
- Write ultra-fast backend microservices in Golang with gRPC & GraphQL APIs.

Requirements:
- 3+ years experience with Vue/Nuxt, Golang, PostgreSQL, and GraphQL.`,
        category: 'Full Stack Web Development',
        location: 'Remote',
        jobType: 'REMOTE',
        experienceLevel: 'MID',
        salaryMin: 145000,
        salaryMax: 185000,
        isFeatured: false,
        skillsRequired: ['Vue.js', 'Nuxt.js', 'Golang', 'PostgreSQL', 'Docker', 'GraphQL', 'Tailwind CSS'],
        recruiterId: recruiter2.id,
        companyId: company2.id,
      },
    });

    // --- SECTION B: CYBERSECURITY & HACKING (4 Jobs) ---
    await prisma.job.create({
      data: {
        title: 'Principal Cybersecurity Analyst & Ethical Hacker',
        description: `CyberDefense Labs is seeking a Lead Ethical Hacker to conduct penetration testing and secure critical cloud infrastructure.

Key Responsibilities:
- Perform red teaming simulations, vulnerability assessments, and penetration tests.
- Analyze security audit logs and automate real-time threat detection rules.
- Conduct OWASP Top 10 code security reviews.

Requirements:
- Certified Ethical Hacker (CEH) or OSCP certification preferred.
- Deep hands-on experience with Metasploit, Wireshark, Burp Suite, and Python scripting.`,
        category: 'Cybersecurity & Ethical Hacking',
        location: 'Washington, DC / Remote',
        jobType: 'REMOTE',
        experienceLevel: 'LEAD',
        salaryMin: 145000,
        salaryMax: 185000,
        isFeatured: true,
        skillsRequired: ['Ethical Hacking', 'Penetration Testing', 'Metasploit', 'OWASP', 'Wireshark', 'Python'],
        recruiterId: recruiter3.id,
        companyId: company3.id,
      },
    });

    await prisma.job.create({
      data: {
        title: 'Cloud Security & Zero Trust Architect',
        description: `Architect enterprise zero-trust security postures across multi-cloud AWS and GCP infrastructures.

Key Responsibilities:
- Design IAM policies, zero-trust network access controls, and container security profiles.
- Implement continuous compliance monitoring and threat mitigation frameworks.

Requirements:
- 5+ years experience in AWS IAM, AWS GuardDuty, SOC2 compliance, and Kubernetes security.
- Mastery over container security scanning (Trivy, Falco) and Zero Trust architecture.`,
        category: 'Cybersecurity & Ethical Hacking',
        location: 'Remote',
        jobType: 'REMOTE',
        experienceLevel: 'SENIOR',
        salaryMin: 160000,
        salaryMax: 200000,
        isFeatured: true,
        skillsRequired: ['Zero Trust', 'AWS GuardDuty', 'IAM', 'SOC2', 'Docker Security', 'Kubernetes'],
        recruiterId: recruiter3.id,
        companyId: company3.id,
      },
    });

    await prisma.job.create({
      data: {
        title: 'Application Security & DevSecOps Lead',
        description: `Embed security directly into developer pipelines with automated static (SAST) and dynamic (DAST) analysis tools.

Key Responsibilities:
- Drive security code reviews and train engineering teams on defensive coding practices.
- Configure automated vulnerability scanners in GitHub Actions CI/CD workflows.

Requirements:
- Strong background in application security, SAST/DAST tooling, OWASP guidelines, and Docker isolation.`,
        category: 'Cybersecurity & Ethical Hacking',
        location: 'San Francisco, CA / Remote',
        jobType: 'REMOTE',
        experienceLevel: 'SENIOR',
        salaryMin: 150000,
        salaryMax: 190000,
        isFeatured: false,
        skillsRequired: ['DevSecOps', 'AppSec', 'Static Analysis', 'Dynamic Analysis', 'Python', 'Docker', 'OWASP'],
        recruiterId: recruiter3.id,
        companyId: company3.id,
      },
    });

    await prisma.job.create({
      data: {
        title: 'Incident Response & Threat Intelligence Specialist',
        description: `Lead threat hunting operations, analyze malware payloads, and mitigate live security incidents for enterprise clients.

Key Responsibilities:
- Respond to live cyber breaches and conduct deep digital forensics.
- Monitor SIEM telemetry (Splunk/Elastic) to detect advanced persistent threats (APTs).

Requirements:
- 3+ years experience in digital forensics, incident response (DFIR), Splunk SIEM, and Python reverse engineering.`,
        category: 'Cybersecurity & Ethical Hacking',
        location: 'New York, NY / Remote',
        jobType: 'REMOTE',
        experienceLevel: 'MID',
        salaryMin: 135000,
        salaryMax: 175000,
        isFeatured: false,
        skillsRequired: ['Incident Response', 'Malware Analysis', 'SIEM', 'Splunk', 'Threat Hunting', 'Forensics'],
        recruiterId: recruiter3.id,
        companyId: company3.id,
      },
    });

    // --- SECTION C: ARTIFICIAL INTELLIGENCE (4 Jobs) ---
    const jobAI1 = await prisma.job.create({
      data: {
        title: 'AI / LLM Application Engineer',
        description: `Join our cutting-edge AI research team building autonomous agentic workflows and fine-tuned LLM services.

Key Responsibilities:
- Build low-latency RAG (Retrieval-Augmented Generation) pipelines.
- Integrate OpenAI / Anthropic / Gemini APIs into scalable microservices.
- Fine-tune open source models (Llama 3, Mistral) for domain-specific tasks.

Requirements:
- 3+ years experience with Python, PyTorch, or Node.js AI SDKs.
- Experience with Vector Databases (Pinecone, Qdrant, PgVector).`,
        category: 'Artificial Intelligence',
        location: 'Remote',
        jobType: 'REMOTE',
        experienceLevel: 'MID',
        salaryMin: 140000,
        salaryMax: 180000,
        isFeatured: true,
        skillsRequired: ['Python', 'LLMs', 'PyTorch', 'FastAPI', 'VectorDB', 'Node.js'],
        recruiterId: recruiter1.id,
        companyId: company1.id,
      },
    });

    await prisma.job.create({
      data: {
        title: 'Senior Machine Learning Research Scientist',
        description: `Architect next-generation deep learning architectures for generative multi-modal reasoning.

Key Responsibilities:
- Train large-scale Transformer models on multi-GPU cluster architectures.
- Publish novel research on efficient attention mechanisms and model distillation.

Requirements:
- Master's or PhD in CS/Machine Learning with strong publications.
- Expertise in PyTorch, Distributed Training (DeepSpeed), and C++ extensions.`,
        category: 'Artificial Intelligence',
        location: 'San Francisco, CA / Remote',
        jobType: 'REMOTE',
        experienceLevel: 'SENIOR',
        salaryMin: 165000,
        salaryMax: 210000,
        isFeatured: true,
        skillsRequired: ['PyTorch', 'Deep Learning', 'NLP', 'Computer Vision', 'Python', 'TensorFlow'],
        recruiterId: recruiter1.id,
        companyId: company1.id,
      },
    });

    await prisma.job.create({
      data: {
        title: 'Computer Vision & AI Perception Specialist',
        description: `Develop real-time video object detection, segmentation, and tracking algorithms for autonomous systems.

Key Responsibilities:
- Optimize deep neural network inference on edge hardware using TensorRT and CUDA.
- Build dataset annotation pipelines and custom synthetic data generators.

Requirements:
- Strong foundation in C++, Python, PyTorch, OpenCV, and TensorRT.`,
        category: 'Artificial Intelligence',
        location: 'Austin, TX / Remote',
        jobType: 'REMOTE',
        experienceLevel: 'SENIOR',
        salaryMin: 145000,
        salaryMax: 185000,
        isFeatured: false,
        skillsRequired: ['Computer Vision', 'OpenCV', 'PyTorch', 'C++', 'CUDA', 'Deep Learning'],
        recruiterId: recruiter2.id,
        companyId: company2.id,
      },
    });

    await prisma.job.create({
      data: {
        title: 'MLOps & Autonomous Agent Architect',
        description: `Design enterprise MLOps pipelines powering automated model retraining, evaluation, and continuous deployment.

Key Responsibilities:
- Manage model lifecycle automation using MLflow, Kubeflow, and Weights & Biases.
- Deploy scalable inferencing servers with Triton and Docker on AWS EKS.

Requirements:
- 4+ years in MLOps, Docker, Kubernetes, Python, and cloud ML infrastructure.`,
        category: 'Artificial Intelligence',
        location: 'Remote',
        jobType: 'REMOTE',
        experienceLevel: 'LEAD',
        salaryMin: 155000,
        salaryMax: 195000,
        isFeatured: false,
        skillsRequired: ['MLOps', 'Kubeflow', 'PyTorch', 'Docker', 'AWS', 'Python', 'LangChain'],
        recruiterId: recruiter1.id,
        companyId: company1.id,
      },
    });

    // --- SECTION D: CLOUD & DEVOPS (4 Jobs) ---
    await prisma.job.create({
      data: {
        title: 'Lead Cloud DevOps & Infrastructure Engineer',
        description: `CloudScale Infrastructure needs a Lead DevOps Engineer to automate enterprise Kubernetes cluster deployments.

Key Responsibilities:
- Manage multi-region Kubernetes clusters with Terraform and Helm.
- Build resilient GitOps CI/CD pipelines with GitHub Actions and ArgoCD.

Requirements:
- Mastery over Kubernetes, Terraform, AWS, Docker, and Go.`,
        category: 'Cloud & DevOps',
        location: 'Seattle, WA / Remote',
        jobType: 'REMOTE',
        experienceLevel: 'LEAD',
        salaryMin: 150000,
        salaryMax: 190000,
        isFeatured: true,
        skillsRequired: ['Kubernetes', 'Terraform', 'AWS', 'Docker', 'CI/CD Pipelines', 'Go'],
        recruiterId: recruiter4.id,
        companyId: company4.id,
      },
    });

    await prisma.job.create({
      data: {
        title: 'Site Reliability Engineer (SRE)',
        description: `Optimize high-availability distributed systems, monitor telemetry with Prometheus/Grafana, and execute incident response.

Key Responsibilities:
- Maintain 99.99% system availability across distributed microservice architecture.
- Automate chaos engineering tests and incident response playbooks.

Requirements:
- 4+ years in Site Reliability Engineering, Prometheus, Grafana, Linux kernel tuning, and Go/Python.`,
        category: 'Cloud & DevOps',
        location: 'Remote',
        jobType: 'REMOTE',
        experienceLevel: 'SENIOR',
        salaryMin: 140000,
        salaryMax: 175000,
        isFeatured: true,
        skillsRequired: ['Prometheus', 'Grafana', 'Linux Kernel', 'Go', 'Incident Response', 'Python'],
        recruiterId: recruiter4.id,
        companyId: company4.id,
      },
    });

    await prisma.job.create({
      data: {
        title: 'Multi-Cloud Infrastructure Solutions Architect',
        description: `Architect multi-cloud hybrid solutions spanning AWS, GCP, and Azure for fortune 500 tech platforms.

Key Responsibilities:
- Design fault-tolerant cloud architecture patterns and infrastructure cost optimizations.
- Lead multi-region disaster recovery strategy implementations.

Requirements:
- AWS Certified Solutions Architect Professional or equivalent GCP certification.`,
        category: 'Cloud & DevOps',
        location: 'Chicago, IL / Remote',
        jobType: 'REMOTE',
        experienceLevel: 'LEAD',
        salaryMin: 165000,
        salaryMax: 205000,
        isFeatured: false,
        skillsRequired: ['AWS', 'GCP', 'Terraform', 'System Architecture', 'Cloud Migration', 'Kubernetes'],
        recruiterId: recruiter4.id,
        companyId: company4.id,
      },
    });

    await prisma.job.create({
      data: {
        title: 'DevOps GitOps & Platform Engineer',
        description: `Empower internal engineering teams with self-service developer platforms built on Kubernetes and ArgoCD.

Key Responsibilities:
- Build developer portals and automated environment provisioning pipelines.
- Standardize Helm charts and continuous delivery across microservices.

Requirements:
- 3+ years experience with Kubernetes, ArgoCD, Helm, Docker, and Shell scripting.`,
        category: 'Cloud & DevOps',
        location: 'Remote',
        jobType: 'REMOTE',
        experienceLevel: 'MID',
        salaryMin: 145000,
        salaryMax: 180000,
        isFeatured: false,
        skillsRequired: ['Kubernetes', 'Helm', 'ArgoCD', 'GitHub Actions', 'Docker', 'Bash'],
        recruiterId: recruiter4.id,
        companyId: company4.id,
      },
    });

    // --- SECTION E: DATA SCIENCE & ANALYTICS (4 Jobs) ---
    await prisma.job.create({
      data: {
        title: 'Lead Data Scientist & Predictive Analytics Specialist',
        description: `Build predictive ML models and data pipelines analyzing gigabytes of customer behavior telemetry daily.

Key Responsibilities:
- Develop predictive churn models, lifetime value algorithms, and recommendation engines.
- Conduct statistical A/B testing and experimentation frameworks.

Requirements:
- Master's or PhD in Data Science, Statistics, or Computer Science.
- Proficiency with Python, Scikit-Learn, Pandas, Snowflake, and A/B testing methodologies.`,
        category: 'Data Science & Analytics',
        location: 'Boston, MA / Remote',
        jobType: 'REMOTE',
        experienceLevel: 'LEAD',
        salaryMin: 140000,
        salaryMax: 180000,
        isFeatured: true,
        skillsRequired: ['Python', 'Scikit-Learn', 'Pandas', 'Snowflake', 'SQL', 'A/B Testing'],
        recruiterId: recruiter5.id,
        companyId: company5.id,
      },
    });

    await prisma.job.create({
      data: {
        title: 'Big Data & Data Lakehouse Engineer',
        description: `Architect real-time streaming data pipelines using Apache Spark, Kafka, and Databricks.

Key Responsibilities:
- Build high-throughput ingestion pipelines processing millions of events per second.
- Manage Delta Lake storage layers and real-time streaming analytics.

Requirements:
- 4+ years building high-throughput ETL data pipelines with Apache Spark, Kafka, and Databricks Delta Lake.`,
        category: 'Data Science & Analytics',
        location: 'Remote',
        jobType: 'REMOTE',
        experienceLevel: 'SENIOR',
        salaryMin: 145000,
        salaryMax: 185000,
        isFeatured: true,
        skillsRequired: ['Apache Spark', 'Apache Kafka', 'Databricks', 'Delta Lake', 'Python', 'Scala'],
        recruiterId: recruiter5.id,
        companyId: company5.id,
      },
    });

    await prisma.job.create({
      data: {
        title: 'Senior Data Engineer (Snowflake & Airflow)',
        description: `Construct modern analytics stack architectures using Snowflake, Apache Airflow, and dbt for fast data insights.

Key Responsibilities:
- Design robust data warehousing schemas and automated SQL transformations in dbt.
- Maintain orchestrations using Apache Airflow DAGs.

Requirements:
- Expertise in Snowflake, Apache Airflow, dbt, complex SQL, and Python.`,
        category: 'Data Science & Analytics',
        location: 'New York, NY / Remote',
        jobType: 'REMOTE',
        experienceLevel: 'SENIOR',
        salaryMin: 135000,
        salaryMax: 175000,
        isFeatured: false,
        skillsRequired: ['Snowflake', 'Apache Airflow', 'dbt', 'SQL', 'Python', 'ETL Pipelines'],
        recruiterId: recruiter5.id,
        companyId: company5.id,
      },
    });

    await prisma.job.create({
      data: {
        title: 'Quantitative Data Analyst & Insights Lead',
        description: `Transform complex relational and unstructured data into strategic executive dashboards and forecasting models.

Key Responsibilities:
- Build interactive visual dashboards in Tableau and Power BI.
- Translate business requirements into advanced SQL queries and statistical models.

Requirements:
- 3+ years experience with SQL, Python, Tableau/Power BI, and statistical forecasting.`,
        category: 'Data Science & Analytics',
        location: 'Remote',
        jobType: 'REMOTE',
        experienceLevel: 'MID',
        salaryMin: 130000,
        salaryMax: 165000,
        isFeatured: false,
        skillsRequired: ['SQL', 'Python', 'Tableau', 'Power BI', 'Statistical Modeling', 'Predictive Analytics'],
        recruiterId: recruiter2.id,
        companyId: company2.id,
      },
    });

    // 5. Applications & Interviews
    const app1 = await prisma.application.create({
      data: {
        jobId: jobFS1.id,
        applicantId: candidate1.id,
        resumeUrl: candidate1.profile?.resumeUrl || '',
        coverLetter: 'Excited about building full-stack AI web products with NexusTech!',
        status: 'SHORTLISTED',
        matchScore: 92.5,
        recruiterFeedback: 'Impressive full stack experience and strong open-source project portfolio.',
      },
    });

    const app2 = await prisma.application.create({
      data: {
        jobId: jobAI1.id,
        applicantId: candidate2.id,
        resumeUrl: candidate2.profile?.resumeUrl || '',
        coverLetter: 'Passionate AI developer looking to deploy enterprise LLM models.',
        status: 'INTERVIEW_SCHEDULED',
        matchScore: 95.0,
        recruiterFeedback: 'Ideal background in Python, PyTorch, and LLM fine-tuning.',
      },
    });

    await prisma.interview.create({
      data: {
        applicationId: app2.id,
        recruiterId: recruiter1.id,
        candidateId: candidate2.id,
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        durationMins: 60,
        meetingLink: 'https://meet.google.com/hirehub-ai-mock',
        format: 'Google Meet Video Call',
        status: 'SCHEDULED',
        notes: 'Technical round focused on Python backend, RAG pipelines, and System Design.',
      },
    });

    console.log('✅ Database auto-seeded with 20 jobs including Full Stack Web Development!');
  } catch (err: any) {
    console.error('❌ Error during auto-seed execution:', err?.message || err);
  }
}
