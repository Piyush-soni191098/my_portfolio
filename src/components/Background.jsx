import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="bg-layer" aria-hidden="true">
      <motion.span
        className="blob blob-1"
        animate={{ x: [0, 35, -15, 0], y: [0, -25, 18, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="blob blob-2"
        animate={{ x: [0, -40, 25, 0], y: [0, 32, -20, 0], scale: [1, 0.92, 1.12, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="blob blob-3"
        animate={{ x: [0, 25, -35, 0], y: [0, 28, 24, 0], scale: [1, 1.15, 0.92, 1] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
