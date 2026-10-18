import { pickMany } from "./rng";
import type { AwardPayload, CardPayload, DramaPayload, LoadPayload, QuizPayload } from "./share";
import type { Scenario } from "./content/scenarios";

export function buildCardPayload(input: {
  title: string;
  body: string;
  extra?: string;
  from?: string;
  tone?: "note" | "compliment";
}): CardPayload {
  return {
    k: "card",
    v: 1,
    title: input.title,
    body: input.body,
    extra: input.extra,
    from: input.from?.trim() || undefined,
    tone: input.tone === "compliment" ? "compliment" : undefined,
  };
}

export function buildAwardPayload(input: {
  to: string;
  award: string;
  reason: string;
  from?: string;
}): AwardPayload {
  return {
    k: "award",
    v: 1,
    to: input.to.trim() || "Anonymous Legend",
    award: input.award.trim() || "Certified Mystery Person",
    reason:
      input.reason.trim() ||
      "for services to the group chat that cannot be fully disclosed at this time",
    from: input.from?.trim() || undefined,
  };
}

export function buildLoadPayload(input: {
  to: string;
  steps: string[];
  finaleTitle?: string;
  finaleBody?: string;
}): LoadPayload {
  return {
    k: "load",
    v: 1,
    to: input.to.trim() || "friend",
    steps: input.steps.map((step) => step.trim()).filter(Boolean).slice(0, 10),
    finale: {
      title: input.finaleTitle?.trim() || "GOTCHA — that was a prank loading screen",
      body:
        input.finaleBody?.trim() ||
        "Nothing was actually loading. No files, no downloads, no secrets. Just a joke, delivered with premium efficiency.",
    },
  };
}

export function buildDramaPayload(scenario: Scenario): DramaPayload {
  return {
    k: "drama",
    v: 1,
    kicker: scenario.kicker,
    headline: scenario.headline,
    sub: scenario.sub,
    quote: scenario.quote,
    byline: scenario.byline,
  };
}

export function buildQuizPayload(input: {
  pack: string;
  to: string;
  got: number;
  from?: string;
}): QuizPayload {
  return {
    k: "quiz",
    v: 1,
    pack: input.pack,
    to: input.to.trim() || "you",
    got: input.got,
    from: input.from?.trim() || undefined,
  };
}

export function randomLoadingSteps(pool: readonly string[], count = 6): string[] {
  const rng = () => Math.random();
  return pickMany(rng, pool, count);
}
