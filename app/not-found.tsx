import Link from "next/link";
import { Glyph } from "@/components/ui/Glyph";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:py-28">
      <span className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-ink bg-blush animate-float" style={{ boxShadow: "6px 6px 0 0 var(--color-ink)" }}>
        <Glyph name="orb" className="h-12 w-12" />
      </span>
      <p className="label-mono mt-8 text-rose-deep">404 — confused orb division</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">This page wandered off</h1>
      <p className="mt-4 max-w-md text-ink-soft">
        It was last seen near the chaos engine, mumbling something about &ldquo;checking the links
        one more time&rdquo;. The links did not get checked.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Back to the homepage
        </Link>
        <Link href="/chaos" className="btn btn-paper">
          Spin the chaos engine
        </Link>
        <Link href="/explore" className="btn btn-ghost">
          Browse everything →
        </Link>
      </div>
    </div>
  );
}
