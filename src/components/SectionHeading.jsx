import Reveal from "./Reveal.jsx";

export default function SectionHeading({ kicker, title, lead, center }) {
  return (
    <div className={`section-head${center ? " center" : ""}`}>
      <Reveal variant="right">
        <span className="section-kicker">{kicker}</span>
      </Reveal>
      <Reveal variant="up" delay={0.05}>
        <h2>{title}</h2>
      </Reveal>
      {lead && (
        <Reveal variant="up" delay={0.1}>
          <p className="section-lead">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
