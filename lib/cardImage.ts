"use client";

export type CardVariant = "award" | "card" | "drama" | "compliment";

export interface CardSpec {
  variant: CardVariant;
  kicker?: string;
  title: string;
  body?: string;
  extra?: string;
  quote?: string;
  byline?: string;
  from?: string;
}

const PALETTE = {
  cream: "#f6f1dc",
  paper: "#fdfaf0",
  blush: "#f6d9e0",
  rose: "#c68a8c",
  roseDeep: "#a2636a",
  sage: "#8ca36b",
  sageDeep: "#61793f",
  sageTint: "#e2e8d2",
  ink: "#2a2321",
  inkSoft: "#6b5c55",
};

function cssFont(variable: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    if (paragraph.trim() === "") {
      lines.push("");
      continue;
    }
    const words = paragraph.split(/\s+/);
    let current = "";
    for (const word of words) {
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

interface DrawColumns {
  ctx: CanvasRenderingContext2D;
  lines: string[];
  x: number;
  y: number;
  lineHeight: number;
}

function drawLines({ ctx, lines, x, y, lineHeight }: DrawColumns): number {
  let cursor = y;
  for (const line of lines) {
    ctx.fillText(line, x, cursor);
    cursor += lineHeight;
  }
  return cursor;
}

function drawSticker(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  bg: string,
  fg: string,
  mono: string,
): void {
  ctx.save();
  ctx.font = `700 24px ${mono}`;
  const width = ctx.measureText(text.toUpperCase()).width + 44;
  ctx.translate(x, y);
  ctx.rotate(-0.03);
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(0, 0, width, 52, 26);
  ctx.fill();
  ctx.strokeStyle = PALETTE.ink;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = fg;
  ctx.textBaseline = "middle";
  ctx.fillText(text.toUpperCase(), 22, 28);
  ctx.restore();
}

function drawFrame(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.strokeStyle = PALETTE.ink;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(24, 24, width - 48, height - 48, 32);
  ctx.stroke();
}

async function withFonts(callback: () => void): Promise<void> {
  try {
    if (document.fonts?.ready) await document.fonts.ready;
  } catch {
    /* fonts API unavailable */
  }
  callback();
}

export async function renderCardToCanvas(spec: CardSpec): Promise<HTMLCanvasElement> {
  const display = cssFont("--font-bricolage", "Georgia, serif");
  const sans = cssFont("--font-inter", "system-ui, sans-serif");
  const mono = cssFont("--font-space-mono", "monospace");

  const isDrama = spec.variant === "drama";
  const width = 1200;
  const height = isDrama ? 675 : 1200;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  await withFonts(() => {
    const bg =
      spec.variant === "award"
        ? PALETTE.blush
        : spec.variant === "compliment"
          ? PALETTE.sageTint
          : spec.variant === "drama"
            ? PALETTE.ink
            : PALETTE.paper;

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = spec.variant === "drama" ? PALETTE.rose : PALETTE.ink;
    ctx.globalAlpha = 0.14;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(width - 120, 140, 180, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(90, height - 120, 240, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    if (spec.variant === "award") {
      drawFrame(ctx, width, height);
      drawSticker(ctx, spec.kicker ?? "Official-ish certificate", 64, 64, PALETTE.rose, PALETTE.ink, mono);

      ctx.fillStyle = PALETTE.inkSoft;
      ctx.font = `600 30px ${sans}`;
      ctx.fillText("This document certifies that", 64, 240);

      ctx.fillStyle = PALETTE.roseDeep;
      ctx.font = `800 96px ${display}`;
      const nameLines = wrapText(ctx, spec.title, width - 160);
      let cursor = drawLines({ ctx, lines: nameLines.slice(0, 2), x: 64, y: 360, lineHeight: 104 });

      ctx.fillStyle = PALETTE.ink;
      ctx.font = `700 44px ${sans}`;
      const awardLines = wrapText(ctx, spec.body ?? "", width - 200);
      cursor += 40;
      cursor = drawLines({ ctx, lines: awardLines.slice(0, 4), x: 64, y: cursor, lineHeight: 58 });

      if (spec.extra) {
        ctx.fillStyle = PALETTE.inkSoft;
        ctx.font = `500 28px ${sans}`;
        const extraLines = wrapText(ctx, spec.extra, width - 200);
        drawLines({ ctx, lines: extraLines.slice(0, 4), x: 64, y: cursor + 60, lineHeight: 40 });
      }

      ctx.fillStyle = PALETTE.ink;
      ctx.font = `700 26px ${mono}`;
      ctx.fillText(spec.from ? `Awarded by ${spec.from}` : "Awarded by an anonymous menace", 64, height - 90);
      ctx.textAlign = "right";
      ctx.fillStyle = PALETTE.roseDeep;
      ctx.fillText("TROLLVERSE", width - 64, height - 90);
      ctx.textAlign = "left";
      return;
    }

    if (spec.variant === "drama") {
      ctx.fillStyle = PALETTE.rose;
      ctx.font = `700 30px ${mono}`;
      ctx.fillText((spec.kicker ?? "breaking-ish news").toUpperCase().slice(0, 60), 72, 120);

      ctx.fillStyle = PALETTE.cream;
      ctx.font = `800 68px ${display}`;
      const headlineLines = wrapText(ctx, spec.title, width - 144);
      const cursor = drawLines({ ctx, lines: headlineLines.slice(0, 3), x: 72, y: 230, lineHeight: 78 });

      ctx.fillStyle = "rgba(246, 241, 220, 0.82)";
      ctx.font = `500 32px ${sans}`;
      const subLines = wrapText(ctx, spec.body ?? "", width - 144);
      drawLines({ ctx, lines: subLines.slice(0, 3), x: 72, y: cursor + 26, lineHeight: 44 });

      if (spec.quote) {
        ctx.fillStyle = PALETTE.sage;
        ctx.font = `600 30px ${sans}`;
        const quoteLines = wrapText(ctx, spec.quote, width - 144);
        drawLines({ ctx, lines: quoteLines.slice(0, 2), x: 72, y: height - 120, lineHeight: 40 });
      }

      ctx.fillStyle = PALETTE.rose;
      ctx.font = `600 24px ${mono}`;
      ctx.fillText(spec.byline ?? "The Trollverse Wire · entirely fictional · mostly", 72, height - 56);
      return;
    }

    drawFrame(ctx, width, height);
    drawSticker(
      ctx,
      spec.kicker ?? (spec.variant === "compliment" ? "A nice thing" : "A message from the void"),
      64,
      64,
      spec.variant === "compliment" ? PALETTE.sage : PALETTE.rose,
      PALETTE.ink,
      mono,
    );

    ctx.fillStyle = PALETTE.ink;
    ctx.font = `800 76px ${display}`;
    const titleLines = wrapText(ctx, spec.title, width - 160);
    let cursor = drawLines({ ctx, lines: titleLines.slice(0, 3), x: 64, y: 300, lineHeight: 88 });

    ctx.font = `500 40px ${sans}`;
    ctx.fillStyle = PALETTE.ink;
    const bodyLines = wrapText(ctx, spec.body ?? "", width - 160);
    cursor = drawLines({ ctx, lines: bodyLines.slice(0, 8), x: 64, y: cursor + 48, lineHeight: 56 });

    if (spec.extra) {
      ctx.fillStyle = PALETTE.inkSoft;
      ctx.font = `500 30px ${sans}`;
      const extraLines = wrapText(ctx, spec.extra, width - 200);
      drawLines({ ctx, lines: extraLines.slice(0, 3), x: 64, y: Math.min(cursor + 50, height - 220), lineHeight: 42 });
    }

    ctx.font = `700 26px ${mono}`;
    ctx.fillStyle = PALETTE.inkSoft;
    ctx.fillText(spec.from ? `From ${spec.from}` : "From a friend in the TROLLVERSE", 64, height - 90);
    ctx.textAlign = "right";
    ctx.fillStyle = PALETTE.roseDeep;
    ctx.fillText("TROLLVERSE", width - 64, height - 90);
    ctx.textAlign = "left";
  });

  return canvas;
}

export async function downloadCardImage(spec: CardSpec, filename = "trollverse-card.png"): Promise<void> {
  const canvas = await renderCardToCanvas(spec);
  await new Promise<void>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }
      resolve();
    }, "image/png");
  });
}
