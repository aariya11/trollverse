import { pick, type Rng } from "../rng";

const SUBJECTS: readonly string[] = [
  "Local man",
  "Local woman",
  "Neighborhood cat",
  "Retired pigeon",
  "Area teen",
  "Suspicious houseplant",
  "Village baker",
  "Wandering duck",
  "Off-duty mall Santa",
  "Sleep-deprived barista",
  "A very tired mail carrier",
  "Unsupervised Roomba",
];

const ACTIONS: readonly string[] = [
  "declared itself mayor of the bus stop",
  "wins talent show with impressive nap routine",
  "refuses to return borrowed ladder, cites 'emotional support'",
  "opens pop-up stand selling only ice cubes",
  "sets new record for most tabs left open",
  "quietly becomes local hero after returning everyone's pens",
  "announced engagement to a waffle iron",
  "starts rival fish and chips shop out of pure pettiness",
  "negotiates treaty with squirrels over bird feeder rights",
  "accepts award for 'most improved Tuesdays'",
  "successfully delays Monday by popular demand",
  "launches investigation into who left the window open in 1998",
];

const REACTIONS: readonly string[] = [
  "Congratulations to everyone involved, which is all of us.",
  "Neighbors report a strange sense of pride and mild confusion.",
  "Experts say this is fine and we should let it play out.",
  "The town council has scheduled a meeting to schedule another meeting.",
  "Protesters were seen holding signs that said 'we support this, we think'.",
  "Everything continues to be exactly as confusing as before, but faster.",
];

const QUOTES: readonly string[] = [
  "I felt the wind change, and I simply obeyed it.",
  "Honestly? I'd do it again. And I will.",
  "We are all doing our best, some of us in slippers.",
  "I'm not a hero. I'm just aggressively punctual.",
  "The snacks were a deciding factor, I won't lie.",
  "I've been preparing for this moment my entire lunch break.",
  "Look, someone had to say something, and nobody else was going to.",
  "I told them I needed six to eight business minutes.",
];

const ATTRIBUTIONS: readonly string[] = [
  "a resident who wished to remain mildly involved",
  "an eyewitness holding a very small dog",
  "local officials, speaking both at once",
  "a source close to the vending machine",
  "our correspondent, reporting from a kitchen chair",
  "the reigning regional expert on vibes",
];

const LOWER_THIRDS: readonly string[] = [
  "BREAKING: local legend status achieved",
  "LIVE-ish: absolutely nothing is on fire, but tension remains",
  "DEVELOPING: society survives another Tuesday",
  "EXCLUSIVE: it's not that deep, but we covered it anyway",
  "UPDATES: the bus stop has never been more governed",
];

export interface Scenario {
  kicker: string;
  headline: string;
  sub: string;
  quote: string;
  byline: string;
}

export function generateScenario(rng: Rng): Scenario {
  const subject = pick(rng, SUBJECTS);
  const action = pick(rng, ACTIONS);
  const reaction = pick(rng, REACTIONS);
  const quote = pick(rng, QUOTES);
  const attribution = pick(rng, ATTRIBUTIONS);
  const kicker = pick(rng, LOWER_THIRDS);

  return {
    kicker,
    headline: `${subject} ${action}.`,
    sub: reaction,
    quote: `"${quote}" — ${attribution}`,
    byline: "The Trollverse Wire · entirely fictional · mostly",
  };
}
