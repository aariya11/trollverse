"use client";

import { useCallback, useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useConfetti } from "@/components/ui/Confetti";
import { useSound } from "@/components/providers/SoundProvider";
import { readStore, writeStore, STORE_KEYS } from "@/lib/storage";
import { unlock, type AchievementGlyph } from "@/lib/achievements";
import { Glyph } from "@/components/ui/Glyph";

interface Stage {
  system: string;
  headline: string;
  blurb: string;
  button: string;
  bg: string;
  glyph: AchievementGlyph | "orb";
}

const STAGES: Stage[] = [
  {
    system: "> awaiting input…",
    headline: "A perfectly ordinary button",
    blurb: "It does nothing. It has always done nothing. Pressing it would be pointless. You should definitely press it.",
    button: "Press the button",
    bg: "bg-paper",
    glyph: "orb",
  },
  {
    system: "> input detected. logging to /dev/null",
    headline: "Okay. It did a thing.",
    blurb: "A tiny thing. A formally insignificant thing. The button seems pleased with itself.",
    button: "Press it again",
    bg: "bg-cream",
    glyph: "orb",
  },
  {
    system: "> WARNING: the button is now self-aware",
    headline: "It knows your name",
    blurb: "Well. It knows a name. It wrote 'friend' on a sticky note and taped it to its own forehead, which is honestly sweet.",
    button: "Press it anyway",
    bg: "bg-blush",
    glyph: "blob",
  },
  {
    system: "> alert: productivity levels dropping at an alarming rate",
    headline: "You have been promoted",
    blurb: "Congratulations! You are now Assistant to the Regional Button. The pay is zero, the prestige is immeasurable.",
    button: "Accept the responsibility",
    bg: "bg-paper",
    glyph: "crown",
  },
  {
    system: "> drumroll.exe launched",
    headline: "Something is building",
    blurb: "You can feel it. The air is thick with the promise of absolutely nothing. Keep going.",
    button: "Press with purpose",
    bg: "bg-sage-tint",
    glyph: "spiral",
  },
  {
    system: "> ERROR 404: consequences not found",
    headline: "The button is shaking",
    blurb: "Not with fear. With anticipation. It practiced this in the mirror this morning.",
    button: "Press it now",
    bg: "bg-blush",
    glyph: "zigzag",
  },
  {
    system: "> global chaos index: 3%",
    headline: "Three percent chaos achieved",
    blurb: "Somewhere, a duck quacked slightly louder than planned. Was that you? Technically, yes.",
    button: "Push chaos higher",
    bg: "bg-paper",
    glyph: "bolt",
  },
  {
    system: "> the button is writing its memoirs",
    headline: "Chapter one: 'They pressed me'",
    blurb: "A moving coming-of-age story about a button, its dreams, and the strange human who kept showing up.",
    button: "Contribute to the story",
    bg: "bg-cream",
    glyph: "flower",
  },
  {
    system: "> CRITICAL: nothing critical is happening",
    headline: "The penultimate press",
    blurb: "Legends speak of what happens next. Legends are mostly wrong, but they speak of it constantly.",
    button: "One more time",
    bg: "bg-blush",
    glyph: "star",
  },
  {
    system: "> reaching press number ten. initiating reveal protocol…",
    headline: "Ten presses. Absolute unit.",
    blurb: "The button has prepared a speech. There is confetti involved. We recommend a comfortable seat.",
    button: "See what happens",
    bg: "bg-sage-tint",
    glyph: "crown",
  },
  {
    system: "> reveal complete. no consequences were harmed",
    headline: "That's it. That's the button.",
    blurb: "It was never going to explode. It just wanted to spend time with someone. The internet is a strange, soft place sometimes. Thanks for playing.",
    button: "Return everything to normal",
    bg: "bg-paper",
    glyph: "flower",
  },
];

export function DoomButton() {
  const [stage, setStage] = useState(0);
  const [lines, setLines] = useState<string[]>(["> connection established. button ready."]);
  const [shaking, setShaking] = useState(false);
  const totalPressesRef = useRef(0);
  const toast = useToast();
  const confetti = useConfetti();
  const sound = useSound();

  const press = useCallback(() => {
    if (stage >= STAGES.length - 1) {
      setStage(0);
      setLines(["> system restored. the button waves goodbye."]);
      sound.play("pop");
      toast.push({ title: "Everything is normal again", desc: "The button will be here if you need it. It always is.", tone: "info" });
      return;
    }

    const next = stage + 1;
    const nextStage = STAGES[next];
    setStage(next);
    setLines((prev) => [...prev, nextStage.system].slice(-6));

    totalPressesRef.current = readStore<number>(STORE_KEYS.doomPresses, 0) + 1;
    writeStore(STORE_KEYS.doomPresses, totalPressesRef.current);
    if (totalPressesRef.current >= 5) unlock("button-pressed");

    if (next === STAGES.length - 1) {
      unlock("button-legend");
      confetti.burst();
      sound.play("drumroll");
      window.setTimeout(() => sound.play("win"), 800);
    } else if (next >= 6) {
      sound.play("drumroll");
      setShaking(true);
      window.setTimeout(() => setShaking(false), 460);
    } else {
      sound.play("boop");
    }
  }, [stage, toast, confetti, sound]);

  const current = STAGES[stage];

  return (
    <div className="rounded-3xl border-2 border-ink bg-paper p-6 sm:p-8" style={{ boxShadow: "6px 6px 0 0 var(--color-ink)" }}>
      <div className="grid gap-6 sm:grid-cols-[1fr_240px]">
        <div>
          <p className="label-mono text-rose-deep">The forbidden button</p>
          <h2 className="mt-2 text-2xl sm:text-3xl">{current.headline}</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{current.blurb}</p>

          <div className="mt-6 flex items-center gap-4">
            <div
              key={stage}
              className={`flex h-20 w-20 items-center justify-center rounded-full border-2 border-ink ${current.bg} ${
                shaking ? "animate-shake" : "animate-pop"
              }`}
              style={{ boxShadow: "4px 4px 0 0 var(--color-ink)" }}
              aria-hidden="true"
            >
              <Glyph name={current.glyph} className="h-9 w-9" />
            </div>
            <button type="button" className="btn btn-primary btn-lg" onClick={press}>
              {current.button}
            </button>
          </div>

          <p className="mt-4 font-mono text-xs text-ink-faint">
            Presses this session: {stage} of {STAGES.length - 1}
          </p>
        </div>

        <div className="rounded-2xl border-2 border-ink bg-ink p-4" aria-live="polite">
          <p className="label-mono text-cream/70">System log</p>
          <ul className="mt-3 space-y-2 font-mono text-[0.65rem] leading-relaxed text-sage">
            {lines.map((line, index) => (
              <li key={`${line}-${index}`} className="break-words">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
