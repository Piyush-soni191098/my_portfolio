import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading.jsx";
import { experience } from "../data.js";

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <SectionHeading kicker="03 — Experience" title="Where I've built" />

        <ol className="timeline">
          {experience.map((job, i) => (
            <motion.li
              key={job.role + job.period}
              className="timeline-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className="timeline-dot"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 + 0.15, type: "spring", stiffness: 300 }}
                aria-hidden="true"
              />
              <div className="timeline-card">
                <div className="timeline-top">
                  <h3>{job.role}</h3>
                  <span className="timeline-meta">{job.period}</span>
                </div>
                <p className="timeline-org">{job.org}</p>
                <ul>
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
