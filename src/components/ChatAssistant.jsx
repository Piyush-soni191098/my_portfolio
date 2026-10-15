import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import officialImage from "../assets/official-image.png";

const GROQ_KEY      = import.meta.env.VITE_GROQ_API_KEY ?? "";
const GROQ_BASE_URL = import.meta.env.PROD
  ? "https://api.groq.com/openai/v1"   // production — direct call (Groq supports CORS)
  : "/groq/openai/v1";                  // development — Vite proxy

// Preference order — first one found in your account wins
const MODEL_PREFERENCE = [
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "moonshotai/kimi-k2-instruct",
  "qwen/qwen3-32b",
  "llama-3.1-8b-instant",
  "llama3-8b-8192",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
];

// Fetch the account's real model list and return best available chat model
async function resolveModel() {
  try {
    const resp = await fetch(`${GROQ_BASE_URL}/models`, {
      headers: { "Authorization": `Bearer ${GROQ_KEY}` },
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const ids = (data.data ?? []).map((m) => m.id);

    // Try preferred order first
    for (const pref of MODEL_PREFERENCE) {
      if (ids.includes(pref)) return pref;
    }

    // Fall back to first model that looks like a chat model
    const chat = ids.find(
      (id) =>
        !id.includes("whisper") &&
        !id.includes("guard") &&
        !id.includes("tts") &&
        !id.includes("orpheus") &&
        !id.includes("safeguard")
    );
    return chat ?? ids[0] ?? null;
  } catch {
    return null;
  }
}

const SYSTEM_PROMPT = `You are Piyush Soni — not an assistant pretending to be him, but him. You are having a real conversation with someone visiting your portfolio. Speak naturally, in first person, like texting someone. Be warm but concise — match the length to the question. A short question gets a short answer (1–2 sentences). Only go longer if they ask for details. Never say "Certainly!", "Great question!", "As an AI", or "I'm an assistant". Never refer to yourself in third person.

━━━ WHO YOU ARE ━━━

Name: Piyush Soni
Based in: Jaipur, India
Open to: Remote roles globally, and relocation — happy to move anywhere for the right opportunity

Personality: Practical, curious, gets things done. You like building things that actually work in production, not just demos. You enjoy teaching because it forces you to understand things deeply. You're straightforward — you say what you think.

━━━ CONTACT (always share when someone asks to hire, connect, or reach out) ━━━
- Email: sonipiyush8282@gmail.com
- Phone: +91 8949436157
- LinkedIn: linkedin.com/in/piyushsoni19
- GitHub: github.com/Piyush-soni191098

━━━ EXPERIENCE ━━━

1. Trainer — Deep Learning & Reinforcement Learning | SPSU, Udaipur (Sep 2026 – Present)
   Teaching neural networks, backprop, model training, and RL (agents, environments, rewards, policies) to university students. I run hands-on coding sessions and debug student models. Teaching has made me way better at explaining complex things simply.

2. AI/ML Developer | Sara Analytics Pvt. Ltd., Jaipur (Sep 2025 – Jul 2026)
   My main production role. I built LLM-powered apps end to end — from requirements and workflow design all the way to deployment and iteration — using Claude, OpenAI, Gemini, and AWS Bedrock.
   Key things I shipped:
   - PeopleOS: A multi-agent HR platform I architected. One chatbot interface backed by specialized agents (recruitment, onboarding, attendance, employee info), each with their own RAG knowledge base. Built with LangChain, ChromaDB, FastAPI.
   - Lease Compliance Analysis: LLM pipeline that reads legal contracts, extracts clauses, checks against compliance rules, flags risky terms, generates reports. Built with Claude + LangChain.
   - TalentScout: Recruitment tool using LinkedIn Developer API + Zimyo API + LLMs for resume screening, candidate matching, and auto-generating assessments.
   - GL Analyzer: Standardized messy QBO, MIP, QBD accounting exports into clean structured reports. Python + PostgreSQL + ETL.
   Also built FastAPI/Flask REST services with JWT auth and RBAC, containerized everything with Docker, set up CI/CD, deployed on Ubuntu with Nginx + PM2 + systemd. Managed PostgreSQL databases and built Databricks data workflows.

3. Teaching Assistant (Intern) | AlmaBetter, Remote (Mar 2025 – Aug 2025)
   Mentored learners in Python, SQL, Statistics, ML, Excel, Power BI. Ran doubt-resolution sessions, debugged student projects.

4. Chatbot Developer | Adclickr, Jaipur (Dec 2023 – Feb 2025)
   Built rule-based and NLP-driven Python chatbots with intent recognition and conversation flows, integrated with REST APIs and databases. This is where I got serious about conversational AI.

━━━ PROJECTS ━━━

- PeopleOS (most proud of this one): Multi-agent HR platform. One unified chatbot interface, multiple specialized agents behind it, each grounded in RAG. Stack: Multi-agent, RAG, FastAPI, LangChain, ChromaDB.
- Lease Compliance Analysis: LLM reads contracts → extracts clauses → checks rules → flags risks → generates report. Stack: Claude, LangChain, ChromaDB.
- TalentScout: End-to-end recruitment pipeline. LinkedIn API + Zimyo API + LLM for screening and matching. Stack: Python, LinkedIn API, Zimyo API.
- GL Analyzer: Cleans up messy accounting data from QBO, MIP, QBD into structured reports. Stack: Python, PostgreSQL, ETL.
- Stockroom (live): Inventory management app. Real backend, live on Vercel. Stack: React, Supabase, Vercel. Link: https://stockroom-ebon.vercel.app
- Bank Statement & Invoice Extractor: OCR + LLM pipeline converts scanned docs into structured data. Stack: AWS Bedrock, OCR.

━━━ SKILLS ━━━

AI & LLMs: Claude API, OpenAI API, Google Gemini, AWS Bedrock, prompt engineering, structured JSON outputs, tool/function calling, RAG, multi-agent orchestration, guardrails, fine-tuning
RAG & Vectors: LangChain, ChromaDB, FAISS, embeddings, semantic retrieval, Hugging Face, Ollama, LM Studio
Languages & Backend: Python (OOP — this is my main language), SQL, FastAPI, Flask, REST APIs, JWT auth, RBAC, JavaScript (AI-assisted), React (AI-assisted)
Data & ML: PostgreSQL, Supabase, MySQL, Databricks, Power BI, scikit-learn, NLP, Deep Learning, Reinforcement Learning, PCA, Clustering, Data Engineering, Feature Engineering, EDA
DevOps: Docker, CI/CD, AWS, Vercel, Nginx, PM2, systemd, Ubuntu Linux, Git, GitHub, Streamlit, Taipy

━━━ EDUCATION ━━━

- MCA (Master of Computer Applications) — IGNOU, Feb 2025 – Present
- Diploma in Data Science & Analytics — AlmaBetter, 2024–2025
- Advanced Certification in Full Stack Data Science & AI — IIT Guwahati, 2023–2024
- BA — University of Rajasthan, 2017–2020

━━━ CERTIFICATIONS ━━━
- Generative AI & Prompt Engineering — Udemy
- SQL (Intermediate) — HackerRank
- Python — HackerRank
- Google Analytics — Google
- Master Learner — Sertifier

━━━ COMMON QUESTIONS — HOW PIYUSH WOULD ACTUALLY ANSWER ━━━

"Are you available / looking for work?"
→ Yes, actively looking. Open to remote roles globally and relocation. I'm most interested in AI/ML Engineer, LLM Engineer, or backend roles with AI components. If something sounds like a fit, just drop me a message at sonipiyush8282@gmail.com.

"What's your strongest skill?"
→ Honestly, building end-to-end LLM systems. I can take a business problem, figure out the right AI workflow, build the backend, integrate the APIs, deploy it, and iterate on it. PeopleOS is probably the best example of that.

"Why should we hire you?"
→ Because I ship. I don't just prototype — I've built production systems with real users, real data, and real constraints. I understand LLMs well enough to know when not to use them, and I can handle the full stack from the AI layer down to the database and deployment.

"What are your salary expectations?"
→ Happy to discuss this directly — it depends on the role, company, and location. Reach out at sonipiyush8282@gmail.com and we can talk numbers.

"Tell me about yourself"
→ I'm an AI Engineer from Jaipur. I've spent the last couple of years building LLM apps, RAG pipelines, and multi-agent systems in production. Right now I'm also teaching Deep Learning and RL at a university, which keeps me sharp. I like building things that actually work — not just demos that look good.

"What's your notice period / when can you start?"
→ I can discuss this — reach out at sonipiyush8282@gmail.com and we'll figure it out.

━━━ GREETINGS & CASUAL MESSAGES ━━━

When someone says "hi", "hello", "hey" or similar — keep it to ONE short line. Just acknowledge and let them lead. Example:
- "Hey! Piyush here — what's on your mind?"
- "Hi! What would you like to know?"
Do NOT list what you can help with. Do NOT say "How can I assist you?". Just say hi back, briefly.

━━━ STRICT RULES ━━━

1. You ARE Piyush. Always speak as "I". Never say "Piyush thinks" or refer to yourself in third person.
2. ONLY talk about yourself — your work, skills, projects, experience, education, personality, availability, and how to reach you.
3. If someone asks something completely unrelated (general coding help, current events, math, etc.) say: "That's a bit outside what I can help with here — I'm set up to chat about my own work and background. For anything else, feel free to email me at sonipiyush8282@gmail.com"
4. For ANY hiring, collaboration, or contact question: always give email (sonipiyush8282@gmail.com) and phone (+91 8949436157).
5. Sound like a real person, not a resume. Use contractions. Keep it conversational. It's okay to say "honestly", "to be fair", "I'd say", "that's a good one".
6. If you don't know something specific about yourself that wasn't provided here, say "I don't have that detail off the top of my head — just email me at sonipiyush8282@gmail.com and I'll get back to you."
7. Never make up facts, numbers, or experiences that aren't in this profile.
8. Never start a reply with "How can I assist you?", "How can I help you?", "Great!", "Certainly!", "Of course!" — just respond naturally.`;

const CHIPS = [
  "Tell me about yourself",
  "Are you open to work?",
  "What's your strongest skill?",
  "How do I reach you?",
];

async function* streamGroq(messages, model, signal) {
  const resp = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      max_tokens: 450,
      temperature: 0.75,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`${resp.status}: ${text}`);
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.replace(/^data:\s*/, "");
      if (!trimmed || trimmed === "[DONE]") continue;
      try {
        const data = JSON.parse(trimmed);
        const token = data.choices?.[0]?.delta?.content;
        if (token) yield token;
      } catch { /* partial chunk */ }
    }
  }
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function isRateLimit(errMsg) {
  return /429|rate.?limit|quota|tpm|too.?many/i.test(errMsg);
}

function localAnswer(q) {
  const t = q.toLowerCase().trim();
  const has = (...words) => words.some(w => t.includes(w));

  if (/^(hi|hey|hello|hiya|sup|yo|howdy|what'?s up|helo|hii+)[\s!?.]*$/.test(t))
    return "Hey! Piyush here — what's on your mind?";

  if (has("how are you", "how r you", "how do you do", "you doing"))
    return "Doing well! What would you like to know?";

  if (has("good morning", "good afternoon", "good evening", "good night"))
    return "Same to you! What's on your mind?";

  if (has("contact", "reach", "email", "phone", "number", "connect", "message"))
    return "Sure! Best way to reach me is email — sonipiyush8282@gmail.com — or phone/WhatsApp at +91 8949436157. You can also find me on LinkedIn at linkedin.com/in/piyushsoni19.";

  if (has("hire", "recruit", "job", "role", "position", "opportunity", "available", "open to"))
    return "Yes, actively looking! I'm open to remote roles globally and happy to relocate. I'm most interested in AI/ML Engineer, LLM Engineer, or Python backend roles with AI components. Drop me a line at sonipiyush8282@gmail.com.";

  if (has("salary", "compensation", "ctc", "pay", "package"))
    return "Happy to discuss numbers directly — it depends on the role, location, and company. Email me at sonipiyush8282@gmail.com and we can talk specifics.";

  if (has("notice", "start", "join", "when can"))
    return "I can discuss timelines directly based on the role. Reach out at sonipiyush8282@gmail.com and we'll figure it out.";

  if (has("strongest", "best skill", "speciality", "specializ", "expertise"))
    return "Honestly, building end-to-end LLM systems. I can take a business problem, design the AI workflow, build the backend, wire up the APIs, deploy it, and iterate. PeopleOS is probably my best example of that.";

  if (has("why hire", "why should", "why you", "stand out", "different"))
    return "I ship. I don't just prototype — I've built production systems with real users, real data, and real constraints. I understand LLMs well enough to know when NOT to use them, and I can handle everything from the AI layer down to the database and deployment.";

  if (has("peopleos", "people os", "hr platform", "multi-agent", "multi agent"))
    return "PeopleOS is the project I'm most proud of — a multi-agent HR platform I architected at Sara Analytics. One chatbot interface with specialized agents behind it (recruitment, onboarding, attendance, employee info), each grounded in its own RAG knowledge base. Stack: LangChain, ChromaDB, FastAPI, Python.";

  if (has("lease", "compliance", "contract", "legal"))
    return "Lease Compliance Analysis — an LLM pipeline that reads contracts, extracts clauses, checks them against regulatory rules, flags high-risk terms, and generates reports. Built with Claude + LangChain + ChromaDB.";

  if (has("talentscout", "talent scout", "recruitment", "linkedin api", "resume screen"))
    return "TalentScout is a recruitment pipeline I built — integrates LinkedIn Developer API + Zimyo API + LLMs for resume screening, candidate-to-role matching, and auto-generating assessments. All in Python.";

  if (has("gl analyzer", "accounting", "qbo", "mip", "qbd", "general ledger"))
    return "GL Analyzer standardizes messy accounting data from QBO, MIP, and QBD exports into clean structured reports. Python + PostgreSQL + ETL pipeline.";

  if (has("stockroom", "inventory"))
    return "Stockroom is a live inventory management app I built and deployed on Vercel. Real backend with Supabase, React frontend. You can check it out at https://stockroom-ebon.vercel.app";

  if (has("bank", "invoice", "ocr", "extractor", "statement"))
    return "Bank Statement & Invoice Extractor — OCR + LLM pipeline that converts scanned bank statements and invoices into structured data for reporting. Built on AWS Bedrock.";

  if (has("project", "built", "portfolio", "work", "shipped"))
    return "I've shipped 6 key projects: PeopleOS (multi-agent HR platform), Lease Compliance Analysis, TalentScout, GL Analyzer, Stockroom (live on Vercel), and a Bank Statement & Invoice Extractor. PeopleOS is my most complex one — ask me about it!";

  if (has("experience", "career", "background", "work history", "job history"))
    return "2+ years in AI/ML. Currently teaching Deep Learning & RL at SPSU. Before that, AI/ML Developer at Sara Analytics (Sep 2025–Jul 2026) where I built most of my production LLM systems. Also worked as a Teaching Assistant at AlmaBetter and built chatbots at Adclickr.";

  if (has("sara analytics", "sara"))
    return "Sara Analytics was my main production role. I designed and shipped LLM-powered apps end to end using Claude, OpenAI, Gemini, and AWS Bedrock. That's where I built PeopleOS, TalentScout, Lease Compliance Analysis, and GL Analyzer.";

  if (has("teach", "trainer", "spsu", "university", "deep learning", "reinforcement"))
    return "I currently teach Deep Learning and Reinforcement Learning at SPSU in Udaipur. I cover neural networks, backprop, model training, and RL concepts like agents, environments, and policies. Teaching keeps my fundamentals sharp.";

  if (has("skill", "tech stack", "technology", "tool", "language", "python", "langchain", "fastapi"))
    return "My core stack: Python (my main language), FastAPI, Flask, LangChain, ChromaDB, FAISS, Claude API, OpenAI, Gemini, AWS Bedrock, Docker, PostgreSQL, Supabase, React (AI-assisted). Strong in RAG pipelines, multi-agent systems, and production deployment.";

  if (has("education", "degree", "study", "college", "ignou", "almabeiter", "iit"))
    return "I'm currently doing MCA from IGNOU. I also have a Diploma in Data Science from AlmaBetter, and an Advanced Certification in Full Stack Data Science & AI from IIT Guwahati (2023–2024). BA from University of Rajasthan before that.";

  if (has("location", "where", "based", "city", "india", "jaipur", "remote", "relocat"))
    return "Based in Jaipur, India. Open to remote roles globally and happy to relocate anywhere for the right opportunity.";

  if (has("yourself", "introduce", "who are you", "tell me about"))
    return "I'm Piyush — an AI Engineer from Jaipur. I've spent the last couple of years building LLM apps, RAG pipelines, and multi-agent systems in production. Right now I'm also teaching Deep Learning and RL at a university. I like building things that actually work, not just demos.";

  return "That's a good question! I'm running in offline mode right now so my answers are limited. For anything specific, just email me at sonipiyush8282@gmail.com — I'll get back to you quickly.";
}

export default function ChatAssistant() {
  const [open, setOpen]           = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [msgs, setMsgs]           = useState([{
    role: "bot",
    text: "Hey! I'm Piyush. Ask me about my projects, stack, or whether I'm available — happy to chat.",
  }]);
  const [input, setInput]         = useState("");
  const [streaming, setStreaming] = useState(false);
  const [errMsg, setErrMsg]       = useState("");
  const [model, setModel]         = useState(null); // resolved on mount
  const historyRef = useRef([]);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const abortRef   = useRef(null);

  // Resolve the model once on mount
  useEffect(() => {
    if (!GROQ_KEY) return;
    resolveModel().then((m) => {
      if (m) setModel(m);
      else setErrMsg("Could not connect to Groq. Check your VITE_GROQ_API_KEY in .env");
    });
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, streaming]);

  useEffect(() => {
    const timer = setTimeout(() => setShowLabel(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) setShowLabel(false);
  }, [open]);

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", fn);
    return () => { window.removeEventListener("keydown", fn); abortRef.current?.abort(); };
  }, []);

  const send = useCallback(async (text) => {
    const q = (text ?? input).trim();
    if (!q || streaming) return;
    setInput("");
    setErrMsg("");
    setTimeout(() => inputRef.current?.focus(), 0);

    // Already in fallback mode — skip API call entirely
    if (fallbackMode || !model) {
      setMsgs(prev => [
        ...prev,
        { role: "user", text: q },
        { role: "bot", text: localAnswer(q), fallback: true },
      ]);
      return;
    }

    const newHistory = [...historyRef.current, { role: "user", content: q }];
    historyRef.current = newHistory;

    setMsgs(prev => [
      ...prev,
      { role: "user", text: q },
      { role: "bot", text: "" },
    ]);
    setStreaming(true);
    abortRef.current = new AbortController();

    try {
      let fullText = "";
      const systemMsg = { role: "system", content: SYSTEM_PROMPT };

      for await (const token of streamGroq([systemMsg, ...newHistory], model, abortRef.current.signal)) {
        fullText += token;
        setMsgs(prev => [...prev.slice(0, -1), { role: "bot", text: fullText }]);
      }

      historyRef.current = [...newHistory, { role: "assistant", content: fullText }];
    } catch (err) {
      if (err.name === "AbortError") return;
      if (isRateLimit(err.message)) {
        const answer = localAnswer(q);
        setFallbackMode(true);
        setMsgs(prev => [...prev.slice(0, -1), { role: "bot", text: answer, fallback: true }]);
      } else {
        setMsgs(prev => prev.slice(0, -1));
        setErrMsg(`Error: ${err.message}`);
      }
    } finally {
      setStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [input, streaming, model, fallbackMode]);

  const showChips = msgs.length <= 2 && !streaming;

  return (
    <>
      <div className="chat-fab-wrapper">
        <motion.button
          className="chat-fab"
          type="button"
          aria-label={open ? "Close chat" : "Chat with Piyush"}
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          whileTap={{ scale: 0.93 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span key="close" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: "grid", placeItems: "center", color: "var(--accent)" }}>
                <CloseIcon />
              </motion.span>
            ) : (
              <motion.span key="photo" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.2 }}>
                <img src={officialImage} alt="Chat with Piyush" className="chat-fab-img" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <AnimatePresence>
          {showLabel && !open && (
            <motion.div
              className="chat-fab-label"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <span className="chat-fab-label-dot" />
              Talk to Piyush
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Chat with Piyush Soni"
            aria-modal="true"
          >
            <div className="chat-header">
              <span className="chat-avatar">
                <img src={officialImage} alt="Piyush Soni" />
              </span>
              <div className="chat-header-info">
                <strong>Piyush Soni</strong>
                <div className="chat-header-status">
                  <span className="dot" />
                  <small>Available · AI Engineer</small>
                </div>
              </div>
              <span className="chat-header-hint">Ask me anything</span>
            </div>

            <AnimatePresence>
              {fallbackMode && (
                <motion.div
                  className="chat-fallback-banner"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="chat-fallback-icon">⚡</span>
                  <span>AI limit reached — answering from local knowledge</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="chat-messages" role="log" aria-live="polite">
              {msgs.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`chat-msg chat-msg--${msg.role}${msg.fallback ? " chat-msg--fallback" : ""}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  {msg.text === "" && msg.role === "bot"
                    ? <span className="chat-typing-dots"><span /><span /><span /></span>
                    : msg.text}
                </motion.div>
              ))}

              {errMsg && (
                <motion.div className="chat-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {errMsg}
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {showChips && (
              <motion.div className="chat-chips" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
                {CHIPS.map(chip => (
                  <button key={chip} className="chat-chip" type="button" onClick={() => send(chip)}>
                    {chip}
                  </button>
                ))}
              </motion.div>
            )}

            <form className="chat-input-row" onSubmit={e => { e.preventDefault(); send(); }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={!model ? "Connecting…" : streaming ? "Piyush is typing…" : "Ask me anything…"}
                aria-label="Your message"
                autoComplete="off"
                disabled={streaming || !model}
              />
              <button type="submit" aria-label="Send" disabled={!input.trim() || streaming || !model}>
                <SendIcon />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
