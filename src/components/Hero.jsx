import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal, { staggerContainer, staggerItem } from "./Reveal.jsx";
import {
  ArrowDown,
  ArrowRight,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
} from "./Icons.jsx";
import { profile, stats } from "../data.js";
import officialImage from "../assets/official-image.png";

function RotatingRole() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % profile.roles.length),
      2600
    );
    return () => clearInterval(id);
  }, []);

  return (
    <span className="rotator" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span
          key={profile.roles[index]}
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -18, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {profile.roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <motion.div
          className="hero-copy"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.p className="eyebrow" variants={staggerItem}>
            <span className="dot" /> {profile.availability}
          </motion.p>

          <motion.h1 variants={staggerItem}>
            Hi, I'm <span className="grad">{profile.name}</span>
          </motion.h1>

          <motion.p className="hero-title" variants={staggerItem}>
            <RotatingRole />
          </motion.p>

          <motion.p className="hero-sub" variants={staggerItem}>
            {profile.summary}
          </motion.p>

          <motion.div className="hero-actions" variants={staggerItem}>
            <a className="btn btn-primary" href="#projects">
              View my work <ArrowRight />
            </a>
            <a className="btn btn-ghost" href={`mailto:${profile.email}`}>
              Get in touch
            </a>
          </motion.div>

          <motion.ul className="hero-socials" variants={staggerItem} aria-label="Social links">
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GithubIcon />
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedinIcon />
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} aria-label="Email">
                <MailIcon />
              </a>
            </li>
          </motion.ul>
        </motion.div>

        <Reveal variant="scale" className="hero-visual" amount={0.1}>
          <div className="avatar-card">
            <div className="avatar-ring">
              <img
                src={officialImage}
                alt={`${profile.name} — ${profile.roles[0]}`}
                className="avatar-img"
                loading="eager"
              />
            </div>
            <div className="avatar-status">
              <span className="dot" /> Available for work
            </div>
            <div className="avatar-meta">
              <strong>{profile.name}</strong>
              <span>AI Engineer · {profile.location}</span>
            </div>
          </div>

          <div className="hero-stats">
            {stats.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <motion.a
        className="scroll-cue"
        href="#about"
        aria-label="Scroll to about"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown />
      </motion.a>
    </section>
  );
}
