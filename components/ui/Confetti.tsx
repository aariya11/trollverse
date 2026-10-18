"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";

interface ConfettiContextValue {
  burst: (options?: { x?: number; y?: number; count?: number }) => void;
}

const ConfettiContext = createContext<ConfettiContextValue>({ burst: () => undefined });

export function useConfetti(): ConfettiContextValue {
  return useContext(ConfettiContext);
}

const COLORS = ["#c68a8c", "#a2636a", "#8ca36b", "#61793f", "#f6d9e0", "#2a2321", "#fdfaf0"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  shape: "rect" | "circle";
}

export function ConfettiProvider({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const tickRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    function tick() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const particles = particlesRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      let alive = false;
      for (const particle of particles) {
        particle.vy += 0.12;
        particle.vx *= 0.995;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.spin;

        if (particle.y < window.innerHeight + 40) {
          alive = true;
        } else {
          continue;
        }

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.fillStyle = particle.color;
        if (particle.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
        }
        ctx.restore();
      }
      ctx.restore();

      particlesRef.current = particles.filter((p) => p.y < window.innerHeight + 40);

      if (alive) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    }
    tickRef.current = tick;
  }, []);

  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }, []);

  const burst = useCallback(
    (options?: { x?: number; y?: number; count?: number }) => {
      if (typeof window === "undefined") return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      if (!canvasRef.current) return;
      sizeCanvas();

      const x = options?.x ?? window.innerWidth / 2;
      const y = options?.y ?? window.innerHeight * 0.35;
      const count = options?.count ?? 110;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const speed = 4 + Math.random() * 8;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          size: 6 + Math.random() * 8,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.3,
          shape: Math.random() > 0.5 ? "rect" : "circle",
        });
      }

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => tickRef.current());
      }
    },
    [sizeCanvas],
  );

  useEffect(() => {
    const onCelebrate = () => burst();
    const onResize = () => sizeCanvas();
    window.addEventListener("trollverse:celebrate", onCelebrate);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("trollverse:celebrate", onCelebrate);
      window.removeEventListener("resize", onResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [burst, sizeCanvas]);

  const value = useMemo(() => ({ burst }), [burst]);

  return (
    <ConfettiContext.Provider value={value}>
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80]"
      />
    </ConfettiContext.Provider>
  );
}
