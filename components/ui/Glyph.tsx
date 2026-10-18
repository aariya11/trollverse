import type { AchievementGlyph } from "@/lib/achievements";

const glyphs: Record<AchievementGlyph | "orb", { path: React.ReactNode; viewBox: string }> = {
  star: {
    viewBox: "0 0 24 24",
    path: <path d="M12 2.5l2.8 6.2 6.7.7-5 4.6 1.4 6.6L12 17l-5.9 3.6L7.5 14l-5-4.6 6.7-.7z" />,
  },
  spiral: {
    viewBox: "0 0 24 24",
    path: (
      <path d="M12 12a3 3 0 1 0 3 3c0-3-2.5-4-5-4a6 6 0 1 0 6 6c0-5-4.5-7-8-7a9 9 0 1 0 9 9" />
    ),
  },
  blob: {
    viewBox: "0 0 24 24",
    path: (
      <path d="M12 3c4 0 8 2 8 6.5S18 21 12 21 4 14 4 9.5 8 3 12 3z" />
    ),
  },
  flower: {
    viewBox: "0 0 24 24",
    path: (
      <>
        <circle cx="12" cy="6" r="3" />
        <circle cx="18" cy="10" r="3" />
        <circle cx="16" cy="17" r="3" />
        <circle cx="8" cy="17" r="3" />
        <circle cx="6" cy="10" r="3" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),
  },
  zigzag: {
    viewBox: "0 0 24 24",
    path: <path d="M3 16l4-8 4 6 4-9 6 11" />,
  },
  bolt: {
    viewBox: "0 0 24 24",
    path: <path d="M13 2L4 14h6l-1 8 9-12h-6z" />,
  },
  crown: {
    viewBox: "0 0 24 24",
    path: <path d="M3 18h18l-1.5-10-4.5 3.5L12 5 9 11.5 4.5 8z" />,
  },
  orb: {
    viewBox: "0 0 24 24",
    path: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="9" cy="10" r="1" />
        <circle cx="15" cy="10" r="1" />
        <path d="M8.5 14.5c1 1 2.2 1.5 3.5 1.5s2.5-.5 3.5-1.5" />
      </>
    ),
  },
};

export function Glyph({
  name,
  className = "h-6 w-6",
  filled = false,
}: {
  name: AchievementGlyph | "orb";
  className?: string;
  filled?: boolean;
}) {
  const glyph = glyphs[name] ?? glyphs.orb;
  return (
    <svg
      viewBox={glyph.viewBox}
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyph.path}
    </svg>
  );
}
