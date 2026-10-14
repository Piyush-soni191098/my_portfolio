import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading.jsx";
import { certifications, education } from "../data.js";
import Reveal, { staggerContainer, staggerItem } from "./Reveal.jsx";

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function Education() {
  return (
    <section className="section" id="education">
      <div className="container">
        <SectionHeading kicker="05 — Education" title="Learning & certifications" />

        <motion.div
          className="edu-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {education.map((edu) => (
            <motion.article key={edu.title} className="edu-card" variants={staggerItem} whileHover={{ y: -5 }}>
              <h3>{edu.title}</h3>
              <p className="edu-org">{edu.org}</p>
              <span className="edu-date">{edu.period}</span>
            </motion.article>
          ))}
        </motion.div>

        <Reveal variant="up" delay={0.1} className="certs">
          <h3>Certifications</h3>
          <ul>
            {certifications.map((cert) => (
              <li key={cert}>{cert}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal variant="up" delay={0.15}>
          <a
            href="/Piyush_Soni_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="resume-link"
          >
            <DownloadIcon />
            Download Resume
          </a>
        </Reveal>
      </div>
    </section>
  );
}
