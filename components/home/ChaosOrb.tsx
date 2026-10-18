"use client";

import { useEffect, useRef, useState } from "react";
import { useSound } from "@/components/providers/SoundProvider";
import { useReducedMotion } from "@/lib/hooks";

const MOODS = [
  { mouth: "M20 40c4 6 12 6 16 0", label: "delighted" },
  { mouth: "M20 42c4 3 12 3 16 0", label: "content" },
  { mouth: "M20 40c4 8 12 8 16 0", label: "extremely delighted" },
  { mouth: "M22 42c3-2 9-2 12 0", label: "unbothered" },
] as const;

export function ChaosOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [moodIndex, setMoodIndex] = useState(0);
  const [pokes, setPokes] = useState(0);
  const { play } = useSound();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.hypot(dx, dy) || 1;
      const intensity = Math.min(1, distance / 320);
      setEyeOffset({
        x: (dx / distance) * 7 * intensity,
        y: (dy / distance) * 7 * intensity,
      });
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  const poke = () => {
    setMoodIndex((prev) => (prev + 1) % MOODS.length);
    setPokes((prev) => prev + 1);
    play("pop");
    const container = containerRef.current;
    if (container && !reducedMotion) {
      container.classList.remove("animate-wiggle");
      void container.offsetWidth;
      container.classList.add("animate-wiggle");
    }
  };

  const mood = MOODS[moodIndex];

  return (
    <div ref={containerRef} className="relative mx-auto w-fit select-none">
      <div
        aria-hidden="true"
        className="absolute -left-10 -top-6 h-24 w-24 rounded-full bg-blush blur-md"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-8 -right-6 h-28 w-28 rounded-full bg-sage/60 blur-md"
      />
      <svg
        viewBox="0 0 200 200"
        className="relative h-56 w-56 cursor-pointer sm:h-72 sm:w-72"
        onClick={poke}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            poke();
          }
        }}
        aria-label={`Poke the chaos orb. Current mood: ${mood.label}. Pokes so far: ${pokes}.`}
      >
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2.5"
          strokeDasharray="6 8"
          className="animate-spin-slow origin-center"
        />
        <circle cx="100" cy="104" r="64" fill="var(--color-rose)" stroke="var(--color-ink)" strokeWidth="3" />
        <circle cx="80" cy="96" r="14" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2.5" />
        <circle cx="122" cy="96" r="14" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2.5" />
        <circle cx={80 + eyeOffset.x} cy={96 + eyeOffset.y} r="6" fill="var(--color-ink)" />
        <circle cx={122 + eyeOffset.x} cy={96 + eyeOffset.y} r="6" fill="var(--color-ink)" />
        <path
          d={mood.mouth}
          transform="translate(82 4)"
          stroke="var(--color-ink)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="58" cy="118" r="7" fill="var(--color-blush-deep)" opacity="0.8" />
        <circle cx="142" cy="118" r="7" fill="var(--color-blush-deep)" opacity="0.8" />
      </svg>

      <span
        className="absolute -right-4 top-2 rotate-6 rounded-full border-2 border-ink bg-sage px-3 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.14em]"
        style={{ boxShadow: "2px 2px 0 0 var(--color-ink)" }}
      >
        {pokes === 0 ? "poke me" : pokes < 4 ? "again!" : "ok stop"}
      </span>
      <span
        className="absolute -left-6 bottom-4 -rotate-3 rounded-full border-2 border-ink bg-blush px-3 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.14em]"
        style={{ boxShadow: "2px 2px 0 0 var(--color-ink)" }}
      >
        mood: {mood.label}
      </span>
    </div>
  );
}
