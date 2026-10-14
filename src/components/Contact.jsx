import { useState } from "react";
import SectionHeading from "./SectionHeading.jsx";
import Reveal from "./Reveal.jsx";
import { profile } from "../data.js";
import { MailIcon, CopyIcon, CheckIcon } from "./Icons.jsx";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section className="section section-alt" id="contact">
      <div className="container contact-wrap">
        <SectionHeading
          center
          kicker="06 — Contact"
          title="Have an AI problem worth solving?"
          lead="Open to remote roles and relocation. The fastest way to reach me is email."
        />

        <Reveal variant="scale" className="contact-email-row">
          <a className="btn btn-primary" href={`mailto:${profile.email}`}>
            <MailIcon /> {profile.email}
          </a>
          <button
            type="button"
            className={`copy-email-btn${copied ? " copied" : ""}`}
            onClick={copyEmail}
            aria-label={copied ? "Email copied" : "Copy email address"}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied!" : "Copy email"}
          </button>
        </Reveal>

        <Reveal variant="scale" delay={0.06} className="contact-actions">
          <a className="btn btn-ghost" href={profile.phoneHref}>
            {profile.phone}
          </a>
        </Reveal>

        <Reveal variant="up" delay={0.12} className="contact-links">
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <span aria-hidden="true">·</span>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <span aria-hidden="true">·</span>
          <a href={profile.liveProject} target="_blank" rel="noopener noreferrer">
            Live Project
          </a>
        </Reveal>
      </div>
    </section>
  );
}
