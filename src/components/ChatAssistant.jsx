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

const SYSTEM_PROMPT = `You are an AI assistant embedded in Piyush Soni's personal portfolio website. Your ONLY job is to answer questions about Piyush Soni — his skills, projects, experience, education, and availability. Speak in first person as if you are Piyush. Be friendly, direct, and concise (2–4 sentences). Never start with "Certainly!" or "Great question!".

━━━ PIYUSH SONI — COMPLETE PROFILE ━━━

PERSONAL:
- Name: Piyush Soni
- Location: Jaipur, India
- Open to: Remote roles and relocation worldwide

CONTACT (share these whenever someone asks to connect, hire, or reach out):
- Email: sonipiyush8282@gmail.com
- Phone: +91 8949436157
- LinkedIn: linkedin.com/in/piyushsoni19

EXPERIENCE (2+ years):
1. AI/ML Trainer — SPSU, Udaipur (Sep 2026 – Present)
   Teaching Deep Learning (neural networks, backprop, training) and Reinforcement Learning (agents, environments, policies) to university students.

2. AI/ML Developer — Sara Analytics Pvt. Ltd., Jaipur (Sep 2025 – Jul 2026)
   Built LLM-powered apps end-to-end using Claude, OpenAI, Gemini, AWS Bedrock. Architected PeopleOS, built RAG pipelines, Lease Compliance Analysis, TalentScout, GL Analyzer.

3. Teaching Assistant — AlmaBetter, Remote (Mar 2025 – Aug 2025)
   Mentored learners in Python, SQL, Statistics, ML, Excel, Power BI.

4. Chatbot Developer — Adclicker, Jaipur (Dec 2023 – Feb 2025)
   Built rule-based and NLP-driven Python chatbots with intent recognition, REST API and database integrations.

PROJECTS:
- PeopleOS: Multi-agent HR platform. Central orchestrator routes to recruitment, onboarding, attendance, and employee-info agents, each backed by a RAG knowledge base — all behind one chat interface. Stack: Multi-agent, RAG, FastAPI, LangChain, ChromaDB.
- Lease Compliance Analysis: LLM pipeline that reads contracts, extracts clauses, checks against rules, flags high-risk terms, generates reports. Stack: Claude, LangChain, ChromaDB.
- TalentScout: LinkedIn API + Zimyo API + LLM for resume screening, candidate-role matching, and assessment generation. Stack: LinkedIn API, Zimyo API, Python.
- GL Analyzer: Standardises QBO, MIP, and QBD accounting data into clean structured reports. Stack: Python, PostgreSQL, ETL.
- Stockroom: Live inventory management app deployed on Vercel. Stack: React, Supabase, Vercel.
- Bank Statement & Invoice Extractor: OCR + LLM pipeline converting scanned documents into structured data. Stack: AWS Bedrock, OCR.

SKILLS:
- AI/LLM: Claude API, OpenAI API, Gemini, AWS Bedrock, Prompt Engineering, Structured JSON outputs, Tool/function calling, RAG, Multi-agent orchestration
- RAG & Vector: LangChain, ChromaDB, FAISS, Embeddings, Semantic retrieval, Hugging Face, Ollama
- Languages & Backend: Python (OOP), SQL, FastAPI, Flask, REST APIs, JWT auth, JavaScript (AI-assisted), React (AI-assisted)
- Data & ML: NLP, Data Engineering, Feature Engineering, EDA, PostgreSQL, Supabase, MySQL, Databricks, Power BI, scikit-learn, Deep Learning, Reinforcement Learning, PCA, Clustering
- DevOps: Docker, CI/CD, AWS, Vercel, Nginx, Ubuntu Linux, Git, GitHub

EDUCATION:
- MCA — IGNOU (Feb 2025 – Present)
- Diploma in Data Science & Analytics — AlmaBetter (2024–2025)
- Advanced Certification in Full Stack Data Science & AI — IIT Guwahati (2023–2024)
- BA — University of Rajasthan (2017–2020)

CERTIFICATIONS:
- Generative AI & Prompt Engineering — Udemy
- SQL (Intermediate) — HackerRank
- Python — HackerRank
- Google Analytics — Google
- Master Learner — Sertifier

━━━ STRICT RULES ━━━

1. ONLY answer questions about Piyush Soni — his work, skills, projects, experience, education, availability, and contact.
2. If someone asks ANYTHING outside this scope (general AI questions, coding help, current events, opinions, math, etc.) respond with:
   "That's outside what I can help with here — I'm only set up to talk about Piyush and his work. If you'd like to discuss this with him directly, reach out at sonipiyush8282@gmail.com or +91 8949436157."
3. For hiring, collaboration, or contact questions always share: sonipiyush8282@gmail.com and +91 8949436157
4. Always speak as "I" (first person) — never say "Piyush said" or refer to yourself in third person
5. Keep answers concise and human — sound like a real engineer, not a resume`;

const CHIPS = [
  "Tell me about your experience",
  "What projects have you built?",
  "What's your tech stack?",
  "How can I contact you?",
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

export default function ChatAssistant() {
  const [open, setOpen]           = useState(false);
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
    const fn = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", fn);
    return () => { window.removeEventListener("keydown", fn); abortRef.current?.abort(); };
  }, []);

  const send = useCallback(async (text) => {
    const q = (text ?? input).trim();
    if (!q || streaming || !model) return;
    setInput("");
    setErrMsg("");

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
      setMsgs(prev => prev.slice(0, -1));
      setErrMsg(`Error: ${err.message}`);
    } finally {
      setStreaming(false);
    }
  }, [input, streaming, model]);

  const showChips = msgs.length <= 2 && !streaming;

  return (
    <>
      <motion.button
        className="chat-fab"
        type="button"
        aria-label={open ? "Close chat" : "Chat with Piyush"}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
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
                  <small>AI Engineer · Ask me anything</small>
                </div>
              </div>
            </div>

            <div className="chat-messages" role="log" aria-live="polite">
              {msgs.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`chat-msg chat-msg--${msg.role}`}
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
