import { chance, fillTemplate, int, mulberry32, pick, pickMany, seedFrom, type Rng } from "./rng";
import {
  ABSURD_TESTS,
  CHALLENGES,
  COMPLIMENT_SIGNATURES,
  COMPLIMENT_TEMPLATES,
  DRAW_PROMPTS,
  HYPOTHETICALS,
  JOKES,
  PERSONALITY_METRICS,
  PERSONALITY_TITLES,
  PERSONALITY_VERDICTS,
  RANDOM_QUESTIONS,
  WOULD_YOU_RATHER,
  generateExcuse,
  generateScenario,
} from "./content";

export type ChaosCategory =
  | "joke"
  | "hypothetical"
  | "personality"
  | "excuse"
  | "scenario"
  | "wyr"
  | "question"
  | "challenge"
  | "prompt"
  | "compliment";

export type Accent = "rose" | "sage" | "blush" | "ink";

export interface ChaosCategoryDef {
  id: ChaosCategory;
  label: string;
  blurb: string;
  accent: Accent;
}

export const CHAOS_CATEGORIES: readonly ChaosCategoryDef[] = [
  { id: "joke", label: "Joke", blurb: "A certified delivery of questionable humor.", accent: "rose" },
  { id: "hypothetical", label: "Hypothetical", blurb: "A weird question you will think about at 2 AM.", accent: "sage" },
  { id: "personality", label: "Absurd Test", blurb: "Science-adjacent personality assessment.", accent: "blush" },
  { id: "excuse", label: "Excuse", blurb: "A fully plausible explanation. Mostly.", accent: "ink" },
  { id: "scenario", label: "Fake News", blurb: "Breaking developments that never happened.", accent: "rose" },
  { id: "wyr", label: "Would You Rather", blurb: "Two options. Both a little cursed.", accent: "sage" },
  { id: "question", label: "Question", blurb: "A conversation starter with no brakes.", accent: "blush" },
  { id: "challenge", label: "Micro-Challenge", blurb: "A tiny creative mission. Do it now.", accent: "ink" },
  { id: "prompt", label: "Drawing Prompt", blurb: "Something to draw badly and proudly.", accent: "rose" },
  { id: "compliment", label: "Compliment", blurb: "A nice thing that happens to be true.", accent: "sage" },
];

export interface ChaosResult {
  id: string;
  category: ChaosCategory;
  label: string;
  title: string;
  body: string;
  extra?: string;
  accent: Accent;
  seed: number;
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

export function categoryDef(category: ChaosCategory): ChaosCategoryDef {
  return CHAOS_CATEGORIES.find((entry) => entry.id === category) ?? CHAOS_CATEGORIES[0];
}

function generateByCategory(category: ChaosCategory, rng: Rng): { title: string; body: string; extra?: string } {
  switch (category) {
    case "joke": {
      const joke = pick(rng, JOKES);
      return {
        title: "Joke Delivery Service",
        body: `${joke.setup}\n\n${joke.punchline}`,
        extra: chance(rng, 0.35) ? "Genuine laughter not guaranteed. Confused wheezing accepted." : undefined,
      };
    }
    case "hypothetical":
      return { title: "Strange Hypothetical", body: pick(rng, HYPOTHETICALS) };
    case "personality": {
      const archetype = pick(rng, PERSONALITY_TITLES);
      const metrics = pickMany(rng, PERSONALITY_METRICS, 3);
      const scores = metrics.map(() => int(rng, 54, 99));
      const verdict = pick(rng, PERSONALITY_VERDICTS);
      return {
        title: pick(rng, ABSURD_TESTS),
        body: `Assessment complete. You are: ${archetype.toUpperCase()}.\n${metrics[0]}: ${scores[0]}% · ${metrics[1]}: ${scores[1]}% · ${metrics[2]}: ${scores[2]}%\nVerdict: you ${verdict}`,
        extra: "This result is 100% made up and somehow still accurate.",
      };
    }
    case "excuse":
      return generateExcuse(rng);
    case "scenario": {
      const scenario = generateScenario(rng);
      return {
        title: scenario.kicker,
        body: `${scenario.headline}\n\n${scenario.sub}\n\n${scenario.quote}`,
        extra: scenario.byline,
      };
    }
    case "wyr": {
      const pair = pick(rng, WOULD_YOU_RATHER);
      return {
        title: "Would You Rather",
        body: `Would you rather ${pair.a} —\n\nor ${pair.b}?`,
        extra: "No third option. That's the rule.",
      };
    }
    case "question":
      return { title: "Icebreaker, But Weird", body: pick(rng, RANDOM_QUESTIONS) };
    case "challenge": {
      const challenge = pick(rng, CHALLENGES);
      return {
        title: `Micro-Challenge · ${challenge.kind === "draw" ? "draw it" : challenge.kind === "friends" ? "bring a friend" : "write it"}`,
        body: challenge.text,
        extra: "Share your result with the chaos launcher on the home page.",
      };
    }
    case "prompt": {
      const template = pick(rng, [
        "Draw: {prompt}",
        "Sketch it fast — {prompt}",
        "Your mission: {prompt}",
      ]);
      return {
        title: "Drawing Prompt",
        body: fillTemplate(rng, template, { prompt: [pick(rng, DRAW_PROMPTS)] }),
        extra: "Open Draw Together to make it real. Bad drawings welcome.",
      };
    }
    case "compliment":
      return {
        title: "Anonymous Compliment",
        body: `${pick(rng, COMPLIMENT_TEMPLATES)}`,
        extra: `— ${pick(rng, COMPLIMENT_SIGNATURES)}`,
      };
  }
}

export function spinChaos(
  category: ChaosCategory | "surprise",
  seed?: number,
  daySalt = 0,
): ChaosResult {
  const resolvedSeed = seed ?? seedFrom(randomSeed(), Date.now(), daySalt);
  const rng = mulberry32(resolvedSeed);

  const resolvedCategory: ChaosCategory =
    category === "surprise"
      ? pick(rng, CHAOS_CATEGORIES).id
      : category;

  const def = categoryDef(resolvedCategory);
  const content = generateByCategory(resolvedCategory, rng);

  return {
    id: `${resolvedCategory}-${resolvedSeed}`,
    category: resolvedCategory,
    label: def.label,
    title: content.title,
    body: content.body,
    extra: content.extra,
    accent: def.accent,
    seed: resolvedSeed,
  };
}

export function accentClasses(accent: Accent): { bg: string; text: string; chip: string } {
  switch (accent) {
    case "rose":
      return { bg: "bg-rose-tint", text: "text-ink", chip: "bg-rose" };
    case "sage":
      return { bg: "bg-sage-tint", text: "text-ink", chip: "bg-sage" };
    case "blush":
      return { bg: "bg-blush", text: "text-ink", chip: "bg-blush-deep" };
    case "ink":
      return { bg: "bg-ink", text: "text-cream", chip: "bg-rose" };
  }
}
