import { useEffect, useRef } from "react";

const N = 26;
const DIST = 115;
const SPEED = 0.22;

export default function NeuralNet({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let W = 0, H = 0, t = 0;
    let nodes = [];

    const makeNodes = () =>
      Array.from({ length: N }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: 1.8 + Math.random() * 1.6,
        ph: Math.random() * Math.PI * 2,
        sp: 0.7 + Math.random() * 0.9,
        sage: Math.random() > 0.65,
      }));

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      if (!W || !H) return;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      nodes = makeNodes();
    };

    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.016;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < DIST) {
            const alpha = (1 - d / DIST) * 0.22;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle =
              nodes[i].sage || nodes[j].sage
                ? `rgba(26,107,69,${alpha})`
                : `rgba(13,59,39,${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const p = (Math.sin(t * n.sp + n.ph) + 1) / 2;
        const a = 0.28 + p * 0.45;
        const [r, g, b] = n.sage ? [26, 107, 69] : [13, 59, 39];

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 4, 0, 6.28);
        ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.12})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, 6.28);
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };

    init();
    if (W && H) frame();
    const ro = new ResizeObserver(init);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
