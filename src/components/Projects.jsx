import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading.jsx";
import { projects } from "../data.js";
import { staggerContainer, staggerItem } from "./Reveal.jsx";

export default function Projects() {
  return (
    <section className="section section-alt" id="projects">
      <div className="container">
        <SectionHeading kicker="04 — Projects" title="Selected work" />

        <motion.ol
          className="project-list"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.08 }}
          style={{ listStyle: "none", padding: 0 }}
        >
          {projects.map((project, i) => (
            <motion.li
              key={project.title}
              className="project-entry"
              variants={staggerItem}
            >
              <span className="project-index">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div>
                <div className="project-entry-head">
                  <h3>{project.title}</h3>
                  <span className="project-entry-tag">{project.tag}</span>
                </div>

                <p className="project-entry-desc">{project.description}</p>

                <ul className="project-stack">
                  {project.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
