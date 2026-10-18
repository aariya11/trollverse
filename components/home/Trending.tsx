import { mulberry32, pick, pickMany, seedFrom, shuffle } from "@/lib/rng";
import { CHALLENGES, DRAW_PROMPTS, JOKES, WOULD_YOU_RATHER, generateScenario } from "@/lib/content";
import { SectionHeading } from "@/components/ui/Bits";
import { FeedCard, type FeedItem } from "./FeedCard";

function buildFeed(): FeedItem[] {
  const rng = mulberry32(seedFrom("trending", "v3"));

  const jokes = pickMany(rng, JOKES, 3).map<FeedItem>((joke, index) => ({
    id: `trend-joke-${index}-${joke.punchline.length}`,
    kind: "joke",
    category: "Joke",
    title: joke.setup,
    body: "The punchline is loaded and ready. Proceed when brave.",
    punchline: joke.punchline,
  }));

  const polls = pickMany(rng, WOULD_YOU_RATHER, 2).map<FeedItem>((pair, index) => ({
    id: `trend-poll-${index}-${pair.a.length}`,
    kind: "poll",
    category: "Would you rather",
    title: "A completely fair dilemma",
    body: "Both options are slightly cursed. Choose with your heart.",
    options: [pair.a, pair.b],
  }));

  const scenario = generateScenario(rng);
  const drama: FeedItem = {
    id: `trend-drama-${scenario.headline.length}`,
    kind: "drama",
    category: "Fake news",
    title: scenario.headline,
    body: `${scenario.sub}\n\n${scenario.quote}`,
    extra: scenario.byline,
    scenario,
  };

  const prompts = pickMany(rng, DRAW_PROMPTS, 2).map<FeedItem>((promptText, index) => ({
    id: `trend-prompt-${index}-${promptText.length}`,
    kind: "prompt",
    category: "Drawing prompt",
    title: "Today's art assignment",
    body: promptText,
    prompt: promptText,
    extra: "Open Draw Together — bad drawings strongly encouraged.",
  }));

  const challenge = pick(rng, CHALLENGES);
  const challengeItem: FeedItem = {
    id: `trend-challenge-${challenge.id}`,
    kind: "challenge",
    category: "Micro-challenge",
    title: "Small mission, big nonsense",
    body: challenge.text,
    extra: "Or send it to a friend and watch them do it first.",
  };

  return shuffle(rng, [...jokes, ...polls, drama, ...prompts, challengeItem]);
}

export function Trending() {
  const feed = buildFeed();
  return (
    <section id="trending" className="scroll-mt-24 border-y-2 border-ink bg-cream-deep/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading
          kicker="Trending nonsense"
          title="What the universe is currently complaining about"
          blurb="Curated house content, rotated regularly. Clearly labeled, never pretending to be community posts — those arrive when accounts ship."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {feed.map((item) => (
            <FeedCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
