export const profile = {
  name: "Piyush Soni",
  initials: "PS",
  roles: [
    "AI Engineer",
    "LLM & RAG Developer",
    "Multi-Agent Systems",
    "Python Backend",
  ],
  headline:
    "AI Engineer building LLM applications, RAG pipelines & multi-agent systems in Python.",
  summary:
    "I ship features end to end as FastAPI/Flask services with Docker and CI/CD — from business requirements and workflow design through deployment and iteration. Currently teaching Deep Learning & Reinforcement Learning at a university.",
  location: "Jaipur, India",
  email: "sonipiyush8282@gmail.com",
  phone: "+91 8949436157",
  phoneHref: "tel:+918949436157",
  github: "https://github.com/Piyush-soni191098",
  linkedin: "https://linkedin.com/in/piyushsoni19",
  liveProject: "https://stockroom-ebon.vercel.app",
  availability: "Open to remote roles & relocation",
};

export const stats = [
  { value: "2+", label: "Years building" },
  { value: "10+", label: "Internal tools shipped" },
];

export const aboutFacts = [
  { label: "Location", value: "Jaipur, India" },
  { label: "Focus", value: "LLM Apps · RAG · Agents" },
  { label: "Backend", value: "Python · FastAPI · Flask" },
  { label: "Availability", value: "Remote / Relocation" },
];

export const aboutParagraphs = [
  "I'm an AI Engineer with production experience building LLM-powered applications, RAG pipelines, multi-agent orchestration, and document-intelligence tools using the Anthropic Claude, OpenAI, Google Gemini, and AWS Bedrock APIs.",
  "I work end to end — gathering requirements, designing workflows, building backend APIs and frontends, deploying with Docker and CI/CD, then iterating on real usage. I care about grounded, reliable systems: retrieval that actually finds the right context, guardrails that keep outputs safe, and validation that keeps prompts consistent.",
  "Right now I teach Deep Learning and Reinforcement Learning at a university, which keeps my fundamentals sharp and my explanations human.",
];

export const skills = [
  {
    title: "AI & LLM",
    items: [
      "Claude API",
      "OpenAI API",
      "Google Gemini",
      "AWS Bedrock",
      "Prompt engineering",
      "Structured JSON outputs",
      "Tool / function calling",
      "RAG",
      "Multi-agent orchestration",
      "Guardrails & fine-tuning",
    ],
  },
  {
    title: "RAG & Vector DBs",
    items: [
      "LangChain",
      "ChromaDB",
      "FAISS",
      "Embeddings",
      "Semantic retrieval",
      "Hugging Face",
      "Ollama",
    ],
  },
  {
    title: "Languages & Backend",
    items: [
      "Python (OOP)",
      "SQL",
      "JavaScript (AI-assisted)",
      "React (AI-assisted)",
      "HTML / CSS (AI-assisted)",
      "FastAPI",
      "Flask",
      "REST APIs",
      "JWT auth",
      "Role-based access",
    ],
  },
  {
    title: "Data & ML",
    items: [
      "PostgreSQL",
      "Supabase",
      "MySQL",
      "Databricks",
      "Power BI",
      "scikit-learn",
      "NLP",
      "Deep Learning",
      "Reinforcement Learning",
      "PCA · Clustering",
      "Data Engineering",
      "Feature Engineering",
      "Data Analytics",
      "Exploratory Data Analysis",
    ],
  },
  {
    title: "DevOps & Tools",
    items: [
      "Docker",
      "CI/CD",
      "AWS",
      "Vercel",
      "Nginx",
      "PM2 · systemd",
      "Ubuntu Linux",
      "Git & GitHub",
      "Streamlit · Taipy",
    ],
  },
];

export const experience = [
  {
    role: "Trainer — Deep Learning & Reinforcement Learning",
    org: "SPSU · Udaipur, India",
    period: "Sep 2026 — Present",
    points: [
      "Teach neural network fundamentals, model training and evaluation, and core RL concepts (agents, environments, rewards, policies) to university students.",
      "Guide hands-on coding projects and debug student models, connecting theory to real production AI applications.",
    ],
  },
  {
    role: "AI/ML Developer",
    org: "Sara Analytics Pvt. Ltd. · Jaipur, India",
    period: "Sep 2025 — Jul 2026",
    points: [
      "Designed and shipped LLM-powered applications end to end — requirements, workflow design, backend APIs, frontend, deployment, and iteration — using Claude, OpenAI, Gemini, and AWS Bedrock APIs.",
      "Architected PeopleOS, a multi-agent HR platform with a RAG-based orchestration layer unifying recruitment, onboarding, attendance, and employee-information agents behind one chatbot.",
      "Built RAG pipelines and knowledge-retrieval chatbots (LangChain, ChromaDB, Ollama, LM Studio) grounded in company data, plus Lease Compliance Analysis — an LLM workflow that extracts clauses, checks them against rules, flags high-risk terms, and generates reports.",
      "Built TalentScout (LinkedIn Developer API + Zimyo API) for resume screening, candidate-to-role matching, and LLM-based assessment generation; built GL Analyzer to standardize QBO, MIP, and QBD accounting data into structured reports.",
      "Developed FastAPI and Flask REST services with JWT auth and role-based access control; containerized with Docker, set up CI/CD, deployed on Ubuntu with Nginx, PM2, and systemd; managed PostgreSQL databases.",
      "Built Databricks data workflows and ML-based anomaly detection; validated model responses and refined prompts for consistency.",
    ],
  },
  {
    role: "Teaching Assistant (Intern)",
    org: "AlmaBetter · Remote",
    period: "Mar 2025 — Aug 2025",
    points: [
      "Mentored learners in Python, SQL, Statistics, Machine Learning, Excel, and Power BI; ran doubt-resolution sessions and debugged student projects.",
    ],
  },
  {
    role: "Chatbot Developer / AI",
    org: "Adclickr · Jaipur, India",
    period: "Dec 2023 — Feb 2025",
    points: [
      "Built rule-based and NLP-driven Python chatbots with intent recognition and conversation flows, integrated with REST APIs and databases, automating customer support and lead response.",
    ],
  },
];

export const projects = [
  {
    tag: "Live",
    title: "Stockroom — Inventory Management",
    description:
      "Deployed inventory management web app with Supabase as backend and database, hosted on Vercel.",
    stack: ["Supabase", "Vercel", "React"],
    link: "https://stockroom-ebon.vercel.app",
  },
  {
    tag: "AI",
    title: "Bank Statement & Invoice Extractor",
    description:
      "OCR + LLM pipeline converting scanned bank statements and invoices into structured data for reporting and validation.",
    stack: ["AWS Bedrock", "OCR", "LLM"],
  },
  {
    tag: "Agents",
    title: "PeopleOS",
    description:
      "Multi-agent HR platform with a RAG-based orchestration layer unifying recruitment, onboarding, attendance, and employee-info agents behind a single chatbot.",
    stack: ["Multi-agent", "RAG", "FastAPI"],
  },
  {
    tag: "RAG",
    title: "Lease Compliance Analysis",
    description:
      "LLM workflow that extracts clauses from contracts, checks them against regulatory rules, flags high-risk terms, and generates reports.",
    stack: ["LangChain", "ChromaDB", "Claude"],
  },
  {
    tag: "HR Tech",
    title: "TalentScout",
    description:
      "Recruitment pipeline integrating the LinkedIn Developer API and Zimyo API for resume screening, candidate-to-role matching, and LLM-based assessment generation.",
    stack: ["LinkedIn API", "Zimyo API", "LLM"],
  },
  {
    tag: "Data",
    title: "GL Analyzer",
    description:
      "Standardizes QBO, MIP, and QBD accounting data into clean, structured reports.",
    stack: ["Python", "PostgreSQL", "ETL"],
  },
];

export const education = [
  {
    title: "Master of Computer Applications (MCA)",
    org: "IGNOU",
    period: "Feb 2025 — Present",
  },
  {
    title: "Diploma in Data Science & Analytics",
    org: "AlmaBetter",
    period: "2024 — 2025",
  },
  {
    title: "Advanced Certification in Full Stack Data Science & AI",
    org: "IIT Guwahati",
    period: "2023 — 2024",
  },
  {
    title: "Bachelor of Arts (BA)",
    org: "University of Rajasthan, India",
    period: "2017 — 2020",
  },
];

export const certifications = [
  "Generative AI & Prompt Engineering — Udemy",
  "SQL (Intermediate) — HackerRank",
  "Python — HackerRank",
  "Google Analytics — Google",
  "Master Learner — Sertifier",
];

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];
