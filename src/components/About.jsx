import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { aboutFacts, aboutParagraphs } from "../data.js";

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHeading
          kicker="01 — About"
          title="Turning complex AI problems into plain-language products"
        />
        <div className="about-grid">
          <Reveal variant="up" className="about-text">
            {aboutParagraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>

          <Reveal variant="left" delay={0.1} className="about-side">
            <ul className="fact-list">
              {aboutFacts.map((f) => (
                <li key={f.label}>
                  <span>{f.label}</span>
                  <strong>{f.value}</strong>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
