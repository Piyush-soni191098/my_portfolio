import { profile } from "../data.js";
import { ArrowUp } from "./Icons.jsx";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>
          © {year} {profile.name}. Built with React, Vite &amp; Framer Motion.
        </p>
        <a href="#top" className="to-top">
          Back to top <ArrowUp />
        </a>
      </div>
    </footer>
  );
}
