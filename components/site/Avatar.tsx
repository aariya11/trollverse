import { avatarFor, type AvatarSpec } from "@/lib/guest";

function Face({ face }: { face: AvatarSpec["face"] }) {
  switch (face) {
    case "wink":
      return (
        <>
          <circle cx="34" cy="40" r="3.4" fill="#2a2321" />
          <path d="M50 40c2-3 6-3 8 0" stroke="#2a2321" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M34 54c3.6 4 9.4 4 13 0" stroke="#2a2321" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        </>
      );
    case "zigzag":
      return (
        <>
          <circle cx="34" cy="40" r="3.4" fill="#2a2321" />
          <circle cx="54" cy="40" r="3.4" fill="#2a2321" />
          <path d="M33 56l5-4 5 4 5-4 5 4" stroke="#2a2321" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case "surprised":
      return (
        <>
          <circle cx="34" cy="39" r="4" fill="#2a2321" />
          <circle cx="54" cy="39" r="4" fill="#2a2321" />
          <circle cx="44" cy="56" r="4.4" stroke="#2a2321" strokeWidth="2.4" fill="none" />
        </>
      );
    default:
      return (
        <>
          <circle cx="34" cy="40" r="3.4" fill="#2a2321" />
          <circle cx="54" cy="40" r="3.4" fill="#2a2321" />
          <path d="M33 53c4 4.6 10 4.6 14 0" stroke="#2a2321" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        </>
      );
  }
}

function Accessory({ accessory }: { accessory: AvatarSpec["accessory"] }) {
  switch (accessory) {
    case "antenna":
      return (
        <>
          <path d="M44 22v-8" stroke="#2a2321" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="44" cy="11" r="3.2" fill="#c68a8c" stroke="#2a2321" strokeWidth="2" />
        </>
      );
    case "hat":
      return (
        <>
          <path d="M27 28l17-14 17 14z" fill="#8ca36b" stroke="#2a2321" strokeWidth="2.4" strokeLinejoin="round" />
          <rect x="30" y="26" width="28" height="5" rx="2.5" fill="#2a2321" />
        </>
      );
    case "glasses":
      return (
        <>
          <circle cx="34" cy="40" r="8" stroke="#2a2321" strokeWidth="2.4" fill="none" />
          <circle cx="54" cy="40" r="8" stroke="#2a2321" strokeWidth="2.4" fill="none" />
          <path d="M42 40h4" stroke="#2a2321" strokeWidth="2.4" />
        </>
      );
    default:
      return null;
  }
}

export function Avatar({
  seed,
  size = 44,
  className = "",
}: {
  seed: number;
  size?: number;
  className?: string;
}) {
  const spec = avatarFor(seed);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 88 88"
      className={`rounded-full border-2 border-ink ${className}`}
      role="img"
      aria-label="Your generated guest avatar"
    >
      <circle cx="44" cy="44" r="43" fill={spec.bg} />
      <Face face={spec.face} />
      <Accessory accessory={spec.accessory} />
    </svg>
  );
}
