"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useConfetti } from "@/components/ui/Confetti";
import { useSound } from "@/components/providers/SoundProvider";
import { unlock } from "@/lib/achievements";
import { copyText } from "@/lib/clipboard";
import { useMounted } from "@/lib/hooks";
import { DRAW_PROMPTS, DRAW_BATTLE_PROMPTS } from "@/lib/content/prompts";

const PAPER = "#fdfaf0";
const BRUSH_COLORS = ["#2a2321", "#a2636a", "#c68a8c", "#61793f", "#8ca36b", "#edc3cf", "#f6d9e0"];
const BRUSH_SIZES = [4, 10, 20, 34];
const HISTORY_LIMIT = 30;
const BATTLE_SECONDS = 60;

interface StrokePoint {
  x: number;
  y: number;
}

function randomOf<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function DoodleStudio({ initialPrompt, battle }: { initialPrompt: string | null; battle: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const drawingRef = useRef(false);
  const lastPointRef = useRef<StrokePoint | null>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const mounted = useMounted();

  const [prompt, setPrompt] = useState<string>(
    () => initialPrompt ?? randomOf(battle ? DRAW_BATTLE_PROMPTS : DRAW_PROMPTS),
  );
  const [color, setColor] = useState(BRUSH_COLORS[0]);
  const [size, setSize] = useState(BRUSH_SIZES[1]);
  const [erasing, setErasing] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [started, setStarted] = useState(!battle);
  const [secondsLeft, setSecondsLeft] = useState(BATTLE_SECONDS);
  const [timeUp, setTimeUp] = useState(false);
  const secondsRef = useRef(BATTLE_SECONDS);

  const toast = useToast();
  const confetti = useConfetti();
  const sound = useSound();

  const fillPaper = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }, []);

  const loadState = useCallback((dataUrl: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const image = new Image();
    image.onload = () => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    };
    image.src = dataUrl;
  }, []);

  const commit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const snapshot = canvas.toDataURL("image/png");
    const history = historyRef.current.slice(0, historyIndexRef.current + 1);
    history.push(snapshot);
    while (history.length > HISTORY_LIMIT) history.shift();
    historyRef.current = history;
    historyIndexRef.current = history.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = parent.clientWidth;
    const height = Math.round(Math.min(width * 0.68, window.innerHeight * 0.62, 620));
    sizeRef.current = { width, height };
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    fillPaper();
  }, [fillPaper]);

  useEffect(() => {
    setupCanvas();
    commit();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      const current = historyRef.current[historyIndexRef.current];
      setupCanvas();
      if (current) loadState(current);
    });
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!battle || !started || timeUp) return;
    const interval = window.setInterval(() => {
      const next = Math.max(0, secondsRef.current - 1);
      secondsRef.current = next;
      setSecondsLeft(next);
      if (next <= 5 && next > 0) sound.play("tick");
      if (next === 0) {
        window.clearInterval(interval);
        setTimeUp(true);
        sound.play("whoosh");
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [battle, started, timeUp, sound]);

  const pointerPoint = (event: React.PointerEvent<HTMLCanvasElement>): StrokePoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * sizeRef.current.width,
      y: ((event.clientY - rect.top) / rect.height) * sizeRef.current.height,
    };
  };

  const drawSegment = (from: StrokePoint, to: StrokePoint) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = erasing ? PAPER : color;
    ctx.lineWidth = erasing ? Math.max(size * 1.8, 18) : size;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (timeUp || (battle && !started)) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    const point = pointerPoint(event);
    lastPointRef.current = point;
    drawSegment(point, { x: point.x + 0.01, y: point.y + 0.01 });
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const point = pointerPoint(event);
    const last = lastPointRef.current;
    if (last) drawSegment(last, point);
    lastPointRef.current = point;
  };

  const endStroke = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    commit();
  };

  const undo = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    loadState(historyRef.current[historyIndexRef.current]);
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(true);
    sound.play("click");
  };

  const redo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    loadState(historyRef.current[historyIndexRef.current]);
    setCanUndo(true);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    sound.play("click");
  };

  const clear = () => {
    fillPaper();
    commit();
    sound.play("boop");
  };

  const rerollPrompt = () => {
    setPrompt(randomOf(battle ? DRAW_BATTLE_PROMPTS : DRAW_PROMPTS));
    sound.play("pop");
  };

  const exportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "trollverse-doodle.png";
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      unlock("doodle-goblin");
      confetti.burst({ count: 70 });
      sound.play("win");
      toast.push({ title: "Doodle exported", desc: "PNG saved to your downloads. Frame-worthy, frankly.", tone: "success" });
    }, "image/png");
  };

  const copyChallenge = async () => {
    const link = `${window.location.origin}/draw?prompt=${encodeURIComponent(prompt)}${battle ? "&mode=battle" : ""}`;
    const ok = await copyText(link);
    toast.push(
      ok
        ? { title: "Challenge link copied", desc: "Send it to a friend and compare masterpieces.", tone: "success" }
        : { title: "Could not copy", desc: "Your browser blocked the clipboard — copy the link from the address bar.", tone: "warn" },
    );
  };

  const startBattle = () => {
    secondsRef.current = BATTLE_SECONDS;
    setStarted(true);
    setSecondsLeft(BATTLE_SECONDS);
    sound.play("whoosh");
  };

  const restartBattle = () => {
    secondsRef.current = BATTLE_SECONDS;
    setStarted(false);
    setTimeUp(false);
    setSecondsLeft(BATTLE_SECONDS);
    clear();
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex-1 rounded-2xl border-2 border-ink bg-paper px-4 py-3" style={{ boxShadow: "3px 3px 0 0 var(--color-ink)" }}>
            <p className="label-mono text-rose-deep">{battle ? "Battle prompt" : "Today's prompt"}</p>
            <p className="mt-1 font-display text-lg font-bold leading-snug">{prompt}</p>
          </div>
          {battle ? (
            <div
              className={`rounded-2xl border-2 border-ink px-4 py-3 text-center ${
                timeUp ? "bg-rose text-ink" : secondsLeft <= 10 && started ? "bg-blush animate-pulse-soft" : "bg-sage-tint"
              }`}
              style={{ boxShadow: "3px 3px 0 0 var(--color-ink)" }}
              aria-live="polite"
            >
              <p className="label-mono text-ink-soft">Timer</p>
              <p className="font-mono text-2xl font-bold tabular-nums">
                {minutes}:{String(seconds).padStart(2, "0")}
              </p>
            </div>
          ) : null}
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            onPointerLeave={endStroke}
            className="canvas-touch w-full rounded-3xl border-2 border-ink"
            style={{ boxShadow: "6px 6px 0 0 var(--color-ink)", backgroundColor: PAPER }}
            role="img"
            aria-label={`Drawing canvas. Prompt: ${prompt}`}
          />

          {battle && !started ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-ink/55 p-6">
              <div className="max-w-sm rounded-3xl border-2 border-ink bg-paper p-6 text-center animate-pop" style={{ boxShadow: "5px 5px 0 0 var(--color-ink)" }}>
                <p className="label-mono text-rose-deep">Doodle battle</p>
                <p className="mt-2 text-lg font-bold">You have 60 seconds to draw:</p>
                <p className="mt-2 font-display text-xl text-rose-deep">{prompt}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button type="button" className="btn btn-sm btn-primary" onClick={startBattle}>
                    Start the timer
                  </button>
                  <button type="button" className="btn btn-sm btn-paper" onClick={rerollPrompt}>
                    Different prompt
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {timeUp ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-ink/55 p-6">
              <div className="max-w-sm rounded-3xl border-2 border-ink bg-blush p-6 text-center animate-pop" style={{ boxShadow: "5px 5px 0 0 var(--color-ink)" }}>
                <p className="label-mono text-rose-deep">Time!</p>
                <p className="mt-2 text-lg font-bold">Sixty seconds of pure vision, captured.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button type="button" className="btn btn-sm btn-primary" onClick={exportPng}>
                    Export my doodle
                  </button>
                  <button type="button" className="btn btn-sm btn-paper" onClick={restartBattle}>
                    Run it back
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <p className="mt-3 text-center font-mono text-xs text-ink-faint">
          {mounted
            ? "Draw with mouse or finger · nothing is uploaded anywhere"
            : "Warming up the pencils…"}
        </p>
      </div>

      <div className="space-y-5">
        <section className="rounded-3xl border-2 border-ink bg-paper p-4" style={{ boxShadow: "3px 3px 0 0 var(--color-ink)" }}>
          <h2 className="label-mono text-rose-deep">Tools</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className={`chip ${!erasing ? "bg-ink text-cream" : "bg-paper hover:bg-blush"}`}
              onClick={() => setErasing(false)}
              aria-pressed={!erasing}
            >
              Pen
            </button>
            <button
              type="button"
              className={`chip ${erasing ? "bg-ink text-cream" : "bg-paper hover:bg-blush"}`}
              onClick={() => setErasing(true)}
              aria-pressed={erasing}
            >
              Eraser
            </button>
            <button type="button" className="chip bg-paper hover:bg-blush" onClick={undo} disabled={!canUndo}>
              Undo
            </button>
            <button type="button" className="chip bg-paper hover:bg-blush" onClick={redo} disabled={!canRedo}>
              Redo
            </button>
            <button type="button" className="chip bg-paper hover:bg-rose-tint" onClick={clear}>
              Clear
            </button>
          </div>

          <h3 className="label-mono mt-5 text-rose-deep">Colors</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {BRUSH_COLORS.map((brushColor) => (
              <button
                key={brushColor}
                type="button"
                aria-label={`Color ${brushColor}`}
                aria-pressed={color === brushColor && !erasing}
                onClick={() => {
                  setColor(brushColor);
                  setErasing(false);
                }}
                className={`h-9 w-9 rounded-full border-2 border-ink transition-transform hover:-translate-y-0.5 ${
                  color === brushColor && !erasing ? "ring-2 ring-rose-deep ring-offset-2" : ""
                }`}
                style={{ backgroundColor: brushColor }}
              />
            ))}
          </div>

          <h3 className="label-mono mt-5 text-rose-deep">Brush size</h3>
          <div className="mt-2 flex gap-2">
            {BRUSH_SIZES.map((brushSize) => (
              <button
                key={brushSize}
                type="button"
                className={`flex h-10 flex-1 items-center justify-center rounded-xl border-2 transition-colors ${
                  size === brushSize ? "border-ink bg-blush" : "border-ink/20 hover:border-ink"
                }`}
                onClick={() => setSize(brushSize)}
                aria-pressed={size === brushSize}
                aria-label={`Brush size ${brushSize}`}
              >
                <span
                  className="rounded-full bg-ink"
                  style={{ width: Math.min(brushSize, 22), height: Math.min(brushSize, 22) }}
                />
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border-2 border-ink bg-paper p-4" style={{ boxShadow: "3px 3px 0 0 var(--color-ink)" }}>
          <h2 className="label-mono text-rose-deep">Finishing moves</h2>
          <div className="mt-3 flex flex-col gap-2">
            <button type="button" className="btn btn-sm btn-primary" onClick={exportPng}>
              Export PNG
            </button>
            <button type="button" className="btn btn-sm btn-sage" onClick={copyChallenge}>
              Copy challenge link
            </button>
            {!battle ? (
              <button type="button" className="btn btn-sm btn-paper" onClick={rerollPrompt}>
                New prompt
              </button>
            ) : null}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-faint">
            Battle mode gives a friend the same prompt and 60 seconds. Compare results, remain
            friends.
          </p>
        </section>
      </div>
    </div>
  );
}
