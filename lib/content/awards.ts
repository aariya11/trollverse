import { chance, fillTemplate, pick, type Rng } from "../rng";

export const AWARD_TITLES: readonly string[] = [
  "Professional Overthinker",
  "CEO of Doing Nothing",
  "Certified Snack Inspector",
  "World Champion Procrastinator",
  "Chief Nap Officer",
  "Head of Extremely Small Talk",
  "Director of Unfinished Projects",
  "Senior Vice President of 'Almost Done'",
  "Regional Manager of Room Temperature Water",
  "Keeper of the Group Chat",
  "Minister of Misplaced Keys",
  "Grandmaster of Side Quests",
  "Chief Vibes Auditor",
  "Ambassador of Second Breakfast",
  "Certified Plant Whisperer, Probationary",
  "Captain of the Last-Minute Save",
  "Distinguished Fellow of Fridge Staring",
  "Honorary Mayor of the Couch",
  "Lead Architect of The Overcomplicated Plan",
  "Chair of the Committee for More Snacks",
];

const TEMPLATES: readonly string[] = [
  "Distinguished {role} of {field}",
  "Honorary President of {field}",
  "Lifetime Achievement in {field}",
  "Certified {role} (Level {level})",
  "Senior {role}, Department of {field}",
];

const ROLES: readonly string[] = [
  "Gremlin",
  "Vibe Curator",
  "Snack Strategist",
  "Meme Historian",
  "Napping Consultant",
  "Chaos Analyst",
  "Emoji Translator",
  "Hype Coordinator",
];

const FIELDS: readonly string[] = [
  "Doing Just Enough",
  "The Art of Almost Leaving the House",
  "Advanced Couch Physics",
  "Strategic Fridge Door Opening",
  "Tiny Triumphs",
  "Extremely Specific Knowledge",
  "Avoiding Eye Contact With Tasks",
  "Snack Logistics",
];

export const AWARD_REASONS: readonly string[] = [
  "for answering 'almost done' for six consecutive business days",
  "for laughing at a joke two hours after everyone else, alone",
  "for replying 'lol' to a message that wasn't a joke",
  "for opening the fridge 14 times in one evening with full confidence",
  "for winning an argument that happened entirely in your head",
  "for setting five alarms and beating none of them",
  "for keeping a plant alive out of pure spite and love",
  "for saying 'I'll sleep early tonight' like a myth worth retelling",
  "for making a to-do list for the to-do list",
  "for clicking 'remind me later' on your own dreams",
  "for explaining a plot twist you hadn't reached yet",
  "for surviving a meeting that absolutely could have been an email",
  "for being the reason the group chat is still alive",
  "for your outstanding commitment to the last-minute save",
  "for excellent service as emotional support to a sleeping laptop",
];

const HONOREES: readonly string[] = [
  "a very good egg",
  "an absolute legend, unofficially",
  "a certified big brain (pending audit)",
  "a source of light, and snacks",
  "the funniest person in at least one room, probably",
  "a professional at making Mondays survivable",
];

export function generateAward(rng: Rng, recipient?: string) {
  const useTitle = chance(rng, 0.5) || !recipient;
  const award = useTitle
    ? pick(rng, AWARD_TITLES)
    : fillTemplate(rng, pick(rng, TEMPLATES), { role: ROLES, field: FIELDS, level: ["3", "7", "9", "12"] });

  const reason = pick(rng, AWARD_REASONS);
  const verdict = pick(rng, HONOREES);

  return {
    award,
    reason: `${reason}. Presented to ${recipient?.trim() || "you"}, who is hereby recognized as ${verdict}.`,
  };
}
