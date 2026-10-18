export interface QuizOption {
  label: string;
  weight: number;
}

export interface QuizQuestion {
  q: string;
  options: QuizOption[];
}

export interface QuizResult {
  title: string;
  desc: string;
  glyph: "blob" | "star" | "spiral" | "flower" | "zigzag";
}

export interface QuizPack {
  id: string;
  title: string;
  intro: string;
  questions: QuizQuestion[];
  thresholds: number[];
  results: QuizResult[];
}

export const QUIZ_PACKS: readonly QuizPack[] = [
  {
    id: "menace",
    title: "What Kind Of Menace Are You?",
    intro: "Six questions. One verdict. No appeals process.",
    questions: [
      {
        q: "It's 11 PM and you have a 9 AM tomorrow. You are:",
        options: [
          { label: "In bed, respectably, like an adult", weight: 0 },
          { label: "Watching 'one (1) more video'", weight: 1 },
          { label: "Reorganizing a shelf for no reason", weight: 2 },
          { label: "Texting someone 'you up?' about soup", weight: 3 },
        ],
      },
      {
        q: "The printer jams on page 47 of 50. You:",
        options: [
          { label: "Calmly fix it, as printed in the manual", weight: 0 },
          { label: "Speak to it firmly but fairly", weight: 1 },
          { label: "Threaten it with a rival printer", weight: 2 },
          { label: "Begin a quiet rivalry that lasts years", weight: 3 },
        ],
      },
      {
        q: "Your group chat is silent for three days. You:",
        options: [
          { label: "Respect the peace", weight: 0 },
          { label: "Send a meme as a wellness check", weight: 1 },
          { label: "Send a poll about dinner", weight: 2 },
          { label: "Send 'so we all agree time is fake, right?'", weight: 3 },
        ],
      },
      {
        q: "A fly enters your room at 1 AM. The fly's fate is:",
        options: [
          { label: "A peaceful escort out the window", weight: 0 },
          { label: "A duel of wits with a cup", weight: 1 },
          { label: "A dramatic chase scene with commentary", weight: 2 },
          { label: "The fly now pays rent; we have an arrangement", weight: 3 },
        ],
      },
      {
        q: "You're 6 minutes early to something. You:",
        options: [
          { label: "Stand peacefully, glowing with punctuality", weight: 0 },
          { label: "Do a small victory lap in the parking lot", weight: 1 },
          { label: "Fix your hair via a car window reflection", weight: 2 },
          { label: "Enter anyway and act surprised to see everyone", weight: 3 },
        ],
      },
      {
        q: "The elevator door closes as you approach. You:",
        options: [
          { label: "Let it go. It has its own path", weight: 0 },
          { label: "Jog two steps, accept fate", weight: 1 },
          { label: "Lock eyes with someone inside through the glass", weight: 2 },
          { label: "Take the stairs loudly, as a statement", weight: 3 },
        ],
      },
    ],
    thresholds: [4, 9, 14],
    results: [
      {
        title: "Polite Menace",
        desc: "You cause chaos strictly within approved hours and always clean up after it. Society thanks you. Society is slightly suspicious of you.",
        glyph: "flower",
      },
      {
        title: "Freelance Gremlin",
        desc: "Your chaos is small, local, and beloved. You've never started drama, but you have been the reason a dramatic story got a funny ending.",
        glyph: "blob",
      },
      {
        title: "Certified Chaos Agent",
        desc: "You are the reason an innocent Tuesday became 'so, about Tuesday'. Your energy is renewable and slightly hard to schedule around.",
        glyph: "spiral",
      },
      {
        title: "Menace Emeritus",
        desc: "You have transcended ordinary menace. Your chaos is now folklore, told by people who witnessed it and moved out of town to process.",
        glyph: "zigzag",
      },
    ],
  },
  {
    id: "object",
    title: "Which Household Object Is Your Soul?",
    intro: "The Bureau of Domestic Vibes has questions. Please answer honestly.",
    questions: [
      {
        q: "Pick a time of day that feels most like you:",
        options: [
          { label: "7:02 AM — warm, dependable", weight: 0 },
          { label: "2 PM — industrious, unstoppable", weight: 1 },
          { label: "11:59 PM — mysterious, unfinished", weight: 2 },
          { label: "3 AM — knower of secrets", weight: 3 },
        ],
      },
      {
        q: "How do you handle being needed?",
        options: [
          { label: "Show up, do the thing, exceed expectations", weight: 0 },
          { label: "Show up, do the thing, demand attention", weight: 1 },
          { label: "Show up late, do the thing beautifully", weight: 2 },
          { label: "Appear at the exact right moment with eerie precision", weight: 3 },
        ],
      },
      {
        q: "What is your toxic trait, expertly disguised as a virtue?",
        options: [
          { label: "Consistency that borders on smugness", weight: 0 },
          { label: "Enthusiasm nobody asked for and everybody needed", weight: 1 },
          { label: "Vanishing when things get complicated", weight: 2 },
          { label: "Legally owning a spot I don't deserve", weight: 3 },
        ],
      },
      {
        q: "Someone reorganizes you without asking. You:",
        options: [
          { label: "Adapt gracefully, you're flexible", weight: 0 },
          { label: "Rearrange yourself out of spite", weight: 1 },
          { label: "Disappear for two weeks", weight: 2 },
          { label: "Make them question their entire system", weight: 3 },
        ],
      },
      {
        q: "Your legacy in the household will be:",
        options: [
          { label: "Reliability. Quiet, golden reliability.", weight: 0 },
          { label: "Joy, and some unexplained noise at 6 AM", weight: 1 },
          { label: "Mystery. Sweet, endless mystery.", weight: 2 },
          { label: "Being the one thing nobody can throw away", weight: 3 },
        ],
      },
      {
        q: "Choose a goodbye:",
        options: [
          { label: "'See you tomorrow, same time.'", weight: 0 },
          { label: "'I'll be back when you least expect... and deserve it.'", weight: 1 },
          { label: "Silent absence, no forwarding address", weight: 2 },
          { label: "You never said goodbye. I was never really gone.", weight: 3 },
        ],
      },
    ],
    thresholds: [4, 9, 14],
    results: [
      {
        title: "The Toaster",
        desc: "Warm, dependable, slightly dramatic when things get hot. You show up for people at the exact minute they need you, and you announce it.",
        glyph: "star",
      },
      {
        title: "The Roomba",
        desc: "Relentless, optimistic, occasionally stuck under the couch of life. You get things done in ways nobody fully understands but everyone respects.",
        glyph: "spiral",
      },
      {
        title: "The Single Sock",
        desc: "Beloved, essential, chronically unpaired. Your absence is felt instantly. Your return is celebrated like a holiday nobody scheduled.",
        glyph: "flower",
      },
      {
        title: "The Mystery Tupperware Lid",
        desc: "You fit a container everyone forgot they owned. You are the solution to a problem from 2019. You hold secrets, and leftovers, and power.",
        glyph: "blob",
      },
    ],
  },
  {
    id: "wizard",
    title: "Are You A Wizard, Or Just Tired?",
    intro: "A perfectly scientific assessment from the Department of Maybe Magic.",
    questions: [
      {
        q: "You wake up and everyone is being weirdly nice to you. Your first thought:",
        options: [
          { label: "I deserve this, frankly", weight: 0 },
          { label: "What did I do?", weight: 1 },
          { label: "I have cast a spell. It is working.", weight: 2 },
          { label: "I must be dreaming. I will go back to sleep and re-enter this dream.", weight: 3 },
        ],
      },
      {
        q: "A gadget stops working near you. You:",
        options: [
          { label: "Restart it. Classic cure.", weight: 0 },
          { label: "Apologize out loud, sincerely", weight: 1 },
          { label: "Whisper to it in a calm voice", weight: 2 },
          { label: "Accept that you are the reason, and adjust your wardrobe", weight: 3 },
        ],
      },
      {
        q: "Your ideal Friday night contains:",
        options: [
          { label: "Firm plans and good snacks", weight: 0 },
          { label: "Vague plans and excellent snacks", weight: 1 },
          { label: "No plans and mysterious snacks", weight: 2 },
          { label: "Pure horizontal existence under a blanket of destiny", weight: 3 },
        ],
      },
      {
        q: "Someone asks how you're doing. You say:",
        options: [
          { label: "'Good!' (true)", weight: 0 },
          { label: "'Good!' (false but polite)", weight: 1 },
          { label: "'The orb is quiet this week.'", weight: 2 },
          { label: "'Time is a construct and I'm behind on it.'", weight: 3 },
        ],
      },
      {
        q: "You find a mysterious door in your house. Do you open it?",
        options: [
          { label: "First I check the lease", weight: 0 },
          { label: "I knock, politely", weight: 1 },
          { label: "I open it slowly, narrating the moment", weight: 2 },
          { label: "I have already been inside. I came from there.", weight: 3 },
        ],
      },
      {
        q: "Pick a familiar:",
        options: [
          { label: "A very organized calendar", weight: 0 },
          { label: "A cat with opinions", weight: 1 },
          { label: "A houseplant that knows when you lie", weight: 2 },
          { label: "The 5 AM version of yourself, briefly glimpsed", weight: 3 },
        ],
      },
    ],
    thresholds: [4, 9, 14],
    results: [
      {
        title: "Tired Sage",
        desc: "You are not a wizard. You are simply well-rested enough to seem magical and honest enough to say 'thank you'. Rare and excellent.",
        glyph: "flower",
      },
      {
        title: "Relatable Goblin",
        desc: "You are 40% tired and 60% whimsy. You occasionally fix a device by looking at it sternly, then go take a nap to celebrate.",
        glyph: "blob",
      },
      {
        title: "Chaos Mage",
        desc: "Your magic is real, uncontrolled, and mostly directed at group chats and printers. Your spells usually work, nobody knows why, least of all you.",
        glyph: "spiral",
      },
      {
        title: "Extremely Tired Wizard",
        desc: "You are a certified wizard operating at 12% power and somehow still bending reality. Please hydrate. Your spellbook is a nap.",
        glyph: "star",
      },
    ],
  },
];

export function getQuizPack(id: string | null | undefined): QuizPack {
  return QUIZ_PACKS.find((pack) => pack.id === id) ?? QUIZ_PACKS[0];
}

export function scoreToResultIndex(pack: QuizPack, score: number): number {
  return pack.thresholds.filter((threshold) => score >= threshold).length;
}

export function maxScore(pack: QuizPack): number {
  return pack.questions.reduce(
    (sum, question) => sum + Math.max(...question.options.map((option) => option.weight)),
    0,
  );
}
