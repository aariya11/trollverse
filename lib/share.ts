import { QUIZ_PACKS } from "./content/quizzes";

export const SHARE_VERSION = 1 as const;
export const MAX_ENCODED_LENGTH = 8000;
export const MAX_DECODED_LENGTH = 16000;

export interface CardPayload {
  k: "card";
  v: 1;
  title: string;
  body: string;
  extra?: string;
  from?: string;
  tone?: "note" | "compliment";
}

export interface AwardPayload {
  k: "award";
  v: 1;
  to: string;
  award: string;
  reason: string;
  from?: string;
}

export interface LoadPayload {
  k: "load";
  v: 1;
  to: string;
  steps: string[];
  finale: { title: string; body: string };
}

export interface DramaPayload {
  k: "drama";
  v: 1;
  kicker: string;
  headline: string;
  sub: string;
  quote: string;
  byline: string;
}

export interface QuizPayload {
  k: "quiz";
  v: 1;
  pack: string;
  to: string;
  got: number;
  from?: string;
}

export type SharePayload = CardPayload | AwardPayload | LoadPayload | DramaPayload | QuizPayload;
export type ShareKind = SharePayload["k"];

function clean(value: string, max: number): string {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/\r\n/g, "\n")
    .slice(0, max)
    .trim();
}

function asString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = clean(value, max);
  return cleaned.length > 0 ? cleaned : null;
}

function optionalString(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = clean(value, max);
  return cleaned.length > 0 ? cleaned : undefined;
}

export function encodePayload(payload: SharePayload): string {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodePayload(raw: string | null | undefined): SharePayload | null {
  if (!raw || typeof raw !== "string" || raw.length > MAX_ENCODED_LENGTH) return null;
  try {
    const normalized = raw.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    if (binary.length > MAX_DECODED_LENGTH) return null;
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    return validatePayload(JSON.parse(json) as unknown);
  } catch {
    return null;
  }
}

export function validatePayload(value: unknown): SharePayload | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (record.v !== SHARE_VERSION || typeof record.k !== "string") return null;

  switch (record.k) {
    case "card": {
      const title = asString(record.title, 90);
      const body = asString(record.body, 500);
      if (!title || !body) return null;
      return {
        k: "card",
        v: 1,
        title,
        body,
        extra: optionalString(record.extra, 200),
        from: optionalString(record.from, 40),
        tone: record.tone === "compliment" ? "compliment" : undefined,
      };
    }
    case "award": {
      const to = asString(record.to, 60);
      const award = asString(record.award, 90);
      const reason = asString(record.reason, 400);
      if (!to || !award || !reason) return null;
      return { k: "award", v: 1, to, award, reason, from: optionalString(record.from, 40) };
    }
    case "load": {
      const to = asString(record.to, 60);
      if (!to || !Array.isArray(record.steps)) return null;
      const steps = record.steps
        .map((step) => asString(step, 110))
        .filter((step): step is string => step !== null)
        .slice(0, 10);
      if (steps.length === 0) return null;
      const finaleRecord = (record.finale ?? {}) as Record<string, unknown>;
      const finaleTitle = asString(finaleRecord.title, 90) ?? "You've been pranked (politely)";
      const finaleBody = asString(finaleRecord.body, 300) ?? "That was never a real loading screen. It was a joke with extra steps.";
      return { k: "load", v: 1, to, steps, finale: { title: finaleTitle, body: finaleBody } };
    }
    case "drama": {
      const kicker = asString(record.kicker, 90);
      const headline = asString(record.headline, 200);
      const sub = asString(record.sub, 300);
      const quote = asString(record.quote, 300);
      const byline = asString(record.byline, 90);
      if (!kicker || !headline || !sub || !quote || !byline) return null;
      return { k: "drama", v: 1, kicker, headline, sub, quote, byline };
    }
    case "quiz": {
      const pack = asString(record.pack, 30);
      const to = asString(record.to, 60);
      if (!pack || !to || !QUIZ_PACKS.some((p) => p.id === pack)) return null;
      const got = typeof record.got === "number" && Number.isInteger(record.got) ? record.got : 0;
      return {
        k: "quiz",
        v: 1,
        pack,
        to,
        got: Math.max(0, Math.min(9, got)),
        from: optionalString(record.from, 40),
      };
    }
    default:
      return null;
  }
}

export function sharePathFor(kind: ShareKind): string {
  switch (kind) {
    case "card":
      return "/t/card";
    case "award":
      return "/t/award";
    case "load":
      return "/t/loading";
    case "drama":
      return "/t/drama";
    case "quiz":
      return "/t/quiz";
  }
}

export function buildShareLink(payload: SharePayload, baseUrl?: string): string {
  const origin = baseUrl ?? (typeof window !== "undefined" ? window.location.origin : "https://trollverse.example");
  return `${origin}${sharePathFor(payload.k)}?d=${encodePayload(payload)}`;
}
