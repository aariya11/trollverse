import Link from "next/link";
import { Glyph } from "@/components/ui/Glyph";
import { SectionHeading } from "@/components/ui/Bits";

const ACTIONS: Array<{
  href: string;
  glyph: "spiral" | "zigzag" | "bolt" | "flower" | "blob" | "star" | "crown";
  chip: string;
  title: string;
  blurb: string;
  cta: string;
}> = [
  {
    href: "/chaos?spin=1",
    glyph: "spiral",
    chip: "bg-rose",
    title: "Surprise me",
    blurb: "One click. One random experience from the chaos engine. Results vary dramatically.",
    cta: "Spin it",
  },
  {
    href: "/troll-lab",
    glyph: "zigzag",
    chip: "bg-sage",
    title: "Troll a friend",
    blurb: "Build a fake loading screen, a silly award or a dramatic announcement. Share the link.",
    cta: "Open the lab",
  },
  {
    href: "/chaos?cat=scenario",
    glyph: "bolt",
    chip: "bg-blush-deep",
    title: "Generate something absurd",
    blurb: "Breaking-news-style nonsense about local pigeons and unruly toasters.",
    cta: "Generate",
  },
  {
    href: "/troll-lab?tab=card&template=compliment",
    glyph: "flower",
    chip: "bg-sage",
    title: "Send an anonymous compliment",
    blurb: "A nice thing, delivered by a mystery source. Legitimately lovely. Slightly suspicious.",
    cta: "Be nice",
  },
  {
    href: "/draw?mode=battle",
    glyph: "blob",
    chip: "bg-rose",
    title: "Start a drawing battle",
    blurb: "Sixty seconds, one absurd prompt, zero artistic pressure. Lose with dignity.",
    cta: "Grab a brush",
  },
  {
    href: "/games",
    glyph: "star",
    chip: "bg-blush-deep",
    title: "Play a stupid game",
    blurb: "A button you must not press, and gremlins that need catching. Certified time-wasters.",
    cta: "Waste time",
  },
  {
    href: "/daily",
    glyph: "crown",
    chip: "bg-sage",
    title: "Today's chaos challenge",
    blurb: "A new tiny mission every day. Build a streak. Impress absolutely no one but yourself.",
    cta: "See today's",
  },
];

export function ChaosLauncher() {
  return (
    <section id="launcher" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading
          kicker="Random chaos launcher"
          title="Pick your poison. All buttons work."
          blurb="No dead links, no fake popups. Every card below opens a real experience you can use immediately — no account, no download."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIONS.map((action) => (
            <li key={action.title}>
              <Link href={action.href} className="tile group flex h-full flex-col">
                <span
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-ink ${action.chip}`}
                >
                  <Glyph name={action.glyph} className="h-5 w-5" />
                </span>
                <h3 className="text-xl">{action.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{action.blurb}</p>
                <span className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-rose-deep">
                  {action.cta}{" "}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
