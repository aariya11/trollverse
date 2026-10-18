import { mulberry32, seedFrom } from "@/lib/rng";
import { generateScenario } from "@/lib/content/scenarios";

export function Ticker() {
  const rng = mulberry32(seedFrom("ticker", "v2"));
  const headlines = Array.from({ length: 9 }, () => generateScenario(rng).headline.replace(/\.$/, ""));

  const items = headlines;
  const row = [...items, ...items];

  return (
    <div className="overflow-hidden border-y-2 border-ink bg-ink text-cream" aria-label="Absurd headline ticker">
      <div className="flex w-max animate-marquee group">
        <div className="flex shrink-0 items-center group-hover:[animation-play-state:paused]">
          {row.map((headline, index) => (
            <span
              key={`${headline}-${index}`}
              className="label-mono flex items-center gap-6 py-3 pr-6 text-cream/85"
            >
              <span aria-hidden="true" className="text-rose">
                ✦
              </span>
              {headline}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
