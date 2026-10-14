import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "./SectionHeading.jsx";
import { skills } from "../data.js";
import { staggerContainer, staggerItem } from "./Reveal.jsx";

const ALL = "All";

export default function Skills() {
  const [active, setActive] = useState(ALL);
  const tabs = [ALL, ...skills.map((g) => g.title)];
  const visible = active === ALL ? skills : skills.filter((g) => g.title === active);

  return (
    <section className="section section-alt" id="skills">
      <div className="container">
        <SectionHeading kicker="02 — Skills" title="Tools I use to ship" />

        <div className="skills-tabs" role="tablist" aria-label="Skill categories">
          {tabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={active === tab}
              className={`skills-tab${active === tab ? " active" : ""}`}
              onClick={() => setActive(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="skills-grid"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            {visible.map((group) => (
              <motion.article
                key={group.title}
                className="skill-card"
                variants={staggerItem}
                whileHover={{ y: -6 }}
              >
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <motion.li
                      key={item}
                      whileHover={{ scale: 1.06, color: "var(--accent)" }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
