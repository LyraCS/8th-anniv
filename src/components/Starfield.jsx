// src/components/Starfield.jsx
import { useEffect, useRef } from "react";

export default function Starfield() {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    let anim;

    // setup stars with flicker params
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.5,
      baseAlpha: Math.random() * 0.5 + 0.3, // baseline brightness
      flickerSpeed: Math.random() * 2 + 1.2, // speed multiplier
      flickerOffset: Math.random() * Math.PI * 2, // phase offset
    }));

    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);

      const t = Date.now() * 0.002; // global time
      for (const star of stars) {
        const flicker =
          Math.sin(t * star.flickerSpeed + star.flickerOffset) * 0.3;
        const alpha = Math.max(
          0,
          Math.min(1, star.baseAlpha + flicker) // clamp 0–1
        );

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }

      anim = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(anim);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}
