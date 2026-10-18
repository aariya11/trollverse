"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useSound } from "@/components/providers/SoundProvider";
import { readStore, writeStore, STORE_KEYS } from "@/lib/storage";
import { unlock } from "@/lib/achievements";
import { useMounted } from "@/lib/hooks";

const CANVAS_SIZE = 1080;
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_IMAGE_DIMENSION = 1400;

const PALETTE = {
  ink: "#2a2321",
  paper: "#fdfaf0",
  cream: "#f6f1dc",
  blush: "#f6d9e0",
  rose: "#c68a8c",
  roseDeep: "#a2636a",
  sage: "#8ca36b",
  sageDeep: "#61793f",
};

const TEXT_COLORS = [
  PALETTE.paper,
  PALETTE.ink,
  PALETTE.rose,
  PALETTE.roseDeep,
  PALETTE.sage,
  PALETTE.sageDeep,
  PALETTE.blush,
];

const TEMPLATES: Array<{ id: string; name: string; bg: string; pattern: "none" | "dots" | "circles" | "stripes" }> = [
  { id: "paper", name: "Clean paper", bg: PALETTE.paper, pattern: "none" },
  { id: "ink", name: "Deep ink", bg: PALETTE.ink, pattern: "circles" },
  { id: "rose", name: "Dusty rose", bg: PALETTE.rose, pattern: "dots" },
  { id: "blush", name: "Blush", bg: PALETTE.blush, pattern: "stripes" },
  { id: "sage", name: "Sage", bg: PALETTE.sage, pattern: "dots" },
  { id: "cream", name: "Cream", bg: PALETTE.cream, pattern: "stripes" },
];

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
  outline: boolean;
  font: "display" | "sans" | "mono";
}

interface MemeDraft {
  templateId: string;
  layers: TextLayer[];
}

function cssFont(variable: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
}

function fontFor(font: TextLayer["font"], weight: number): string {
  if (font === "display") return `${weight} {size}px ${cssFont("--font-bricolage", "Georgia, serif")}`;
  if (font === "mono") return `${weight} {size}px ${cssFont("--font-space-mono", "monospace")}`;
  return `${weight} {size}px ${cssFont("--font-inter", "system-ui, sans-serif")}`;
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    if (!paragraph.trim()) {
      lines.push("");
      continue;
    }
    let current = "";
    for (const word of paragraph.split(/\s+/)) {
      const candidate = current ? `${current} ${word}` : word;
      if (ctx.measureText(candidate).width <= maxWidth) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

let layerCounter = 0;
function newLayer(partial: Partial<TextLayer>): TextLayer {
  layerCounter += 1;
  return {
    id: `layer-${Date.now()}-${layerCounter}`,
    text: "YOUR TEXT HERE",
    x: CANVAS_SIZE / 2,
    y: CANVAS_SIZE / 2,
    size: 64,
    color: PALETTE.paper,
    outline: true,
    font: "display",
    ...partial,
  };
}

export function MemeEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const redrawRef = useRef<() => void>(() => undefined);
  const mounted = useMounted();

  const [templateId, setTemplateId] = useState("paper");
  const [hasImage, setHasImage] = useState(false);
  const [layers, setLayers] = useState<TextLayer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const toast = useToast();
  const sound = useSound();

  const template = TEMPLATES.find((entry) => entry.id === templateId) ?? TEMPLATES[0];
  const selected = layers.find((layer) => layer.id === selectedId) ?? null;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const draft = readStore<MemeDraft | null>(STORE_KEYS.memeDraft, null);
      if (draft && Array.isArray(draft.layers) && draft.layers.length > 0) {
        setLayers(draft.layers);
        if (TEMPLATES.some((entry) => entry.id === draft.templateId)) setTemplateId(draft.templateId);
      } else {
        setLayers([
          newLayer({ text: "WHEN THE CODE COMPILES", y: 140, size: 70 }),
          newLayer({ text: "ON THE FIRST TRY", y: 940, size: 70 }),
        ]);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const image = imageRef.current;
    if (image) {
      ctx.fillStyle = PALETTE.ink;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      const scale = Math.min(CANVAS_SIZE / image.width, CANVAS_SIZE / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      ctx.drawImage(image, (CANVAS_SIZE - width) / 2, (CANVAS_SIZE - height) / 2, width, height);
    } else {
      ctx.fillStyle = template.bg;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      if (template.pattern === "dots") {
        ctx.fillStyle = "rgba(42,35,33,0.14)";
        for (let x = 40; x < CANVAS_SIZE; x += 90) {
          for (let y = 40; y < CANVAS_SIZE; y += 90) {
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (template.pattern === "circles") {
        ctx.strokeStyle = "rgba(198,138,140,0.35)";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(CANVAS_SIZE - 140, 160, 220, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(120, CANVAS_SIZE - 120, 280, 0, Math.PI * 2);
        ctx.stroke();
      } else if (template.pattern === "stripes") {
        ctx.strokeStyle = "rgba(42,35,33,0.08)";
        ctx.lineWidth = 26;
        for (let offset = -CANVAS_SIZE; offset < CANVAS_SIZE * 2; offset += 130) {
          ctx.beginPath();
          ctx.moveTo(offset, -40);
          ctx.lineTo(offset + CANVAS_SIZE, CANVAS_SIZE + 40);
          ctx.stroke();
        }
      }
    }

    for (const layer of layers) {
      ctx.font = fontFor(layer.font, 800).replace("{size}", String(layer.size));
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const lines = wrapLines(ctx, layer.text, CANVAS_SIZE - 100);
      const lineHeight = layer.size * 1.16;
      const startY = layer.y - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        if (layer.outline) {
          ctx.lineWidth = Math.max(6, layer.size / 7);
          ctx.strokeStyle = layer.color === PALETTE.ink ? PALETTE.paper : PALETTE.ink;
          ctx.lineJoin = "round";
          ctx.strokeText(line, layer.x, y);
        }
        ctx.fillStyle = layer.color;
        ctx.fillText(line, layer.x, y);
      });

      if (layer.id === selectedId) {
        const widths = lines.map((line) => ctx.measureText(line).width);
        const boxWidth = Math.max(...widths, 40) + 36;
        const boxHeight = lines.length * lineHeight + 24;
        ctx.setLineDash([14, 10]);
        ctx.strokeStyle = PALETTE.roseDeep;
        ctx.lineWidth = 4;
        ctx.strokeRect(layer.x - boxWidth / 2, layer.y - boxHeight / 2, boxWidth, boxHeight);
        ctx.setLineDash([]);
      }
    }
  }, [layers, selectedId, template]);

  useEffect(() => {
    redrawRef.current = draw;
    const render = () => draw();
    if (document.fonts?.ready) {
      void document.fonts.ready.then(render);
    }
    render();
  }, [draw]);

  const canvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * CANVAS_SIZE,
      y: ((event.clientY - rect.top) / rect.height) * CANVAS_SIZE,
    };
  };

  const hitTest = (px: number, py: number): TextLayer | null => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return null;
    for (let index = layers.length - 1; index >= 0; index--) {
      const layer = layers[index];
      ctx.font = fontFor(layer.font, 800).replace("{size}", String(layer.size));
      const lines = wrapLines(ctx, layer.text, CANVAS_SIZE - 100);
      const widths = lines.map((line) => ctx.measureText(line).width);
      const lineHeight = layer.size * 1.16;
      const boxWidth = Math.max(...widths, 40) + 40;
      const boxHeight = lines.length * lineHeight + 28;
      if (
        px >= layer.x - boxWidth / 2 &&
        px <= layer.x + boxWidth / 2 &&
        py >= layer.y - boxHeight / 2 &&
        py <= layer.y + boxHeight / 2
      ) {
        return layer;
      }
    }
    return null;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = canvasPoint(event);
    const hit = hitTest(point.x, point.y);
    if (hit) {
      setSelectedId(hit.id);
      dragRef.current = { id: hit.id, dx: point.x - hit.x, dy: point.y - hit.y };
      sound.play("click");
    } else {
      setSelectedId(null);
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const point = canvasPoint(event);
    const x = Math.max(60, Math.min(CANVAS_SIZE - 60, point.x - drag.dx));
    const y = Math.max(50, Math.min(CANVAS_SIZE - 50, point.y - drag.dy));
    setLayers((prev) => prev.map((layer) => (layer.id === drag.id ? { ...layer, x, y } : layer)));
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const updateLayer = (id: string, patch: Partial<TextLayer>) => {
    setLayers((prev) => prev.map((layer) => (layer.id === id ? { ...layer, ...patch } : layer)));
  };

  const addLayer = (position: "top" | "middle" | "bottom") => {
    const y = position === "top" ? 150 : position === "bottom" ? CANVAS_SIZE - 150 : CANVAS_SIZE / 2;
    const layer = newLayer({ text: "NEW CAPTION", y, size: position === "middle" ? 56 : 70, color: PALETTE.paper });
    setLayers((prev) => [...prev, layer]);
    setSelectedId(layer.id);
    sound.play("pop");
  };

  const removeLayer = (id: string) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.push({ title: "That file type is not supported", desc: "Use PNG, JPEG, WebP or GIF images.", tone: "warn" });
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.push({ title: "Image is too large", desc: "Keep uploads under 8 MB. Your browser handles the rest locally.", tone: "warn" });
      return;
    }

    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.decoding = "async";
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("decode failed"));
        image.src = url;
      });

      let finalImage: HTMLImageElement | HTMLCanvasElement = image;
      const longest = Math.max(image.width, image.height);
      if (longest > MAX_IMAGE_DIMENSION) {
        const scale = MAX_IMAGE_DIMENSION / longest;
        const offscreen = document.createElement("canvas");
        offscreen.width = Math.round(image.width * scale);
        offscreen.height = Math.round(image.height * scale);
        offscreen.getContext("2d")?.drawImage(image, 0, 0, offscreen.width, offscreen.height);
        finalImage = offscreen;
      }

      if (finalImage instanceof HTMLCanvasElement) {
        const normalized = new Image();
        normalized.decoding = "async";
        await new Promise<void>((resolve) => {
          normalized.onload = () => resolve();
          normalized.src = finalImage.toDataURL("image/png");
        });
        imageRef.current = normalized;
      } else {
        imageRef.current = finalImage;
      }

      setHasImage(true);
      redrawRef.current();
      sound.play("pop");
      toast.push({
        title: "Image added",
        desc: "It never leaves your device — nothing is uploaded to any server.",
        tone: "success",
      });
    } catch {
      toast.push({ title: "Could not read that image", desc: "The file may be corrupted or oddly formatted.", tone: "warn" });
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const removeImage = () => {
    imageRef.current = null;
    setHasImage(false);
    redrawRef.current();
  };

  const exportPng = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSelectedId(null);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    draw();
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "trollverse-meme.png";
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      unlock("meme-architect");
      sound.play("win");
      toast.push({ title: "Meme exported", desc: "PNG saved. Your masterpiece is now portable.", tone: "success" });
    }, "image/png");
  };

  const saveDraft = () => {
    if (hasImage) {
      toast.push({
        title: "Draft saved without the image",
        desc: "Uploaded images are too big for local drafts — captions and layout are saved.",
        tone: "info",
      });
    }
    const draft: MemeDraft = { templateId, layers };
    const ok = writeStore(STORE_KEYS.memeDraft, draft);
    toast.push(
      ok
        ? { title: "Draft saved locally", desc: "It will be here next time, in this browser.", tone: "success" }
        : { title: "Could not save draft", desc: "Storage might be full.", tone: "warn" },
    );
  };

  const reset = () => {
    setLayers([
      newLayer({ text: "WHEN THE CODE COMPILES", y: 140, size: 70 }),
      newLayer({ text: "ON THE FIRST TRY", y: 940, size: 70 }),
    ]);
    setSelectedId(null);
    imageRef.current = null;
    setHasImage(false);
    setTemplateId("paper");
    redrawRef.current();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="canvas-touch w-full rounded-3xl border-2 border-ink bg-paper"
          style={{ boxShadow: "6px 6px 0 0 var(--color-ink)", aspectRatio: "1 / 1" }}
          aria-label="Meme canvas. Drag captions with the mouse or a finger, or use the caption fields in the panel."
        />
        <p className="mt-3 text-center font-mono text-xs text-ink-faint">
          {mounted
            ? "Drag captions directly on the canvas · long-press = select on some browsers"
            : "Loading the studio…"}
        </p>
      </div>

      <div className="space-y-5">
        <section className="rounded-3xl border-2 border-ink bg-paper p-4" style={{ boxShadow: "3px 3px 0 0 var(--color-ink)" }}>
          <h2 className="label-mono text-rose-deep">Background</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {TEMPLATES.map((entry) => (
              <button
                key={entry.id}
                type="button"
                title={entry.name}
                aria-label={`Template: ${entry.name}`}
                aria-pressed={templateId === entry.id && !hasImage}
                onClick={() => {
                  setTemplateId(entry.id);
                  removeImage();
                }}
                className={`h-10 w-10 rounded-xl border-2 border-ink transition-transform hover:-translate-y-0.5 ${
                  templateId === entry.id && !hasImage ? "ring-2 ring-rose-deep ring-offset-2" : ""
                }`}
                style={{ backgroundColor: entry.bg }}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <label className="btn btn-sm btn-sage cursor-pointer">
              Upload image
              <input type="file" accept={ALLOWED_TYPES.join(",")} className="sr-only" onChange={onUpload} />
            </label>
            {hasImage ? (
              <button type="button" className="btn btn-sm btn-paper" onClick={removeImage}>
                Remove image
              </button>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-ink-faint">
            Images stay 100% on your device — validated, resized, never uploaded.
          </p>
        </section>

        <section className="rounded-3xl border-2 border-ink bg-paper p-4" style={{ boxShadow: "3px 3px 0 0 var(--color-ink)" }}>
          <h2 className="label-mono text-rose-deep">Captions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn btn-sm btn-paper" onClick={() => addLayer("top")}>+ Top</button>
            <button type="button" className="btn btn-sm btn-paper" onClick={() => addLayer("middle")}>+ Middle</button>
            <button type="button" className="btn btn-sm btn-paper" onClick={() => addLayer("bottom")}>+ Bottom</button>
          </div>

          <ul className="mt-4 space-y-2">
            {layers.map((layer) => (
              <li key={layer.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedId(layer.id)}
                  className={`min-w-0 flex-1 truncate rounded-xl border-2 px-3 py-2 text-left text-xs font-semibold transition-colors ${
                    selectedId === layer.id ? "border-ink bg-blush" : "border-ink/20 hover:border-ink"
                  }`}
                  aria-pressed={selectedId === layer.id}
                >
                  {layer.text || "(empty caption)"}
                </button>
                <button
                  type="button"
                  onClick={() => removeLayer(layer.id)}
                  aria-label={`Delete caption: ${layer.text}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-paper text-sm font-bold hover:bg-rose-tint"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </section>

        {selected ? (
          <section className="rounded-3xl border-2 border-ink bg-paper p-4 animate-pop" style={{ boxShadow: "3px 3px 0 0 var(--color-ink)" }}>
            <h2 className="label-mono text-rose-deep">Edit selected caption</h2>
            <textarea
              className="input mt-3 min-h-20"
              value={selected.text}
              onChange={(event) => updateLayer(selected.id, { text: event.target.value })}
              maxLength={140}
              aria-label="Caption text"
            />
            <div className="mt-3">
              <label className="label-mono text-ink-soft" htmlFor="size-range">
                Size: {selected.size}px
              </label>
              <input
                id="size-range"
                type="range"
                min={28}
                max={150}
                value={selected.size}
                onChange={(event) => updateLayer(selected.id, { size: Number(event.target.value) })}
                className="mt-1 w-full accent-[#a2636a]"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Text color ${color}`}
                  aria-pressed={selected.color === color}
                  onClick={() => updateLayer(selected.id, { color })}
                  className={`h-8 w-8 rounded-full border-2 border-ink transition-transform hover:-translate-y-0.5 ${
                    selected.color === color ? "ring-2 ring-rose-deep ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["display", "sans", "mono"] as const).map((font) => (
                <button
                  key={font}
                  type="button"
                  className={`chip ${selected.font === font ? "bg-ink text-cream" : "bg-paper hover:bg-blush"}`}
                  onClick={() => updateLayer(selected.id, { font })}
                  aria-pressed={selected.font === font}
                >
                  {font}
                </button>
              ))}
              <button
                type="button"
                className={`chip ${selected.outline ? "bg-ink text-cream" : "bg-paper hover:bg-blush"}`}
                onClick={() => updateLayer(selected.id, { outline: !selected.outline })}
                aria-pressed={selected.outline}
              >
                outline
              </button>
            </div>
          </section>
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-ink/25 px-4 py-3 text-xs text-ink-soft">
            Select a caption (on the canvas or the list) to edit its text, size, color and font.
          </p>
        )}

        <section className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-sm btn-primary" onClick={exportPng}>
            Export PNG
          </button>
          <button type="button" className="btn btn-sm btn-paper" onClick={saveDraft}>
            Save draft
          </button>
          <button type="button" className="btn btn-sm btn-ghost" onClick={reset}>
            Reset studio
          </button>
        </section>
      </div>
    </div>
  );
}
