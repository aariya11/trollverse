"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { SoundToggle } from "./SoundToggle";
import { Avatar } from "./Avatar";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/ui/Glyph";
import { readGuest } from "@/lib/guest";
import { useClientValue } from "@/lib/hooks";

const LINKS = [
  { href: "/chaos", label: "Chaos" },
  { href: "/troll-lab", label: "Troll Lab" },
  { href: "/meme-studio", label: "Meme Studio" },
  { href: "/draw", label: "Draw Together" },
  { href: "/games", label: "Games" },
  { href: "/daily", label: "Daily" },
];

const EXTRA_LINKS = [
  { href: "/explore", label: "Explore everything" },
  { href: "/t", label: "Prank links" },
  { href: "/profile", label: "Your profile" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const seed = useClientValue<number | null>(() => readGuest()?.seed ?? null, () => null);

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 border-b-2 transition-[background-color,border-color] duration-200 ${
        scrolled ? "border-ink bg-cream/90 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6" aria-label="Main">
        <Logo />

        <ul className="ml-4 hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                    active
                      ? "border-ink bg-blush"
                      : "border-transparent hover:border-ink hover:bg-paper"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2.5">
          <SoundToggle />
          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-paper transition-transform hover:-translate-y-0.5"
            style={{ boxShadow: "2px 2px 0 0 var(--color-ink)" }}
            aria-label="Your guest profile"
          >
            {seed !== null ? (
              <Avatar seed={seed} size={34} className="border-0" />
            ) : (
              <Glyph name="orb" className="h-5 w-5 text-ink" />
            )}
          </Link>
          <Button href="/chaos?spin=1" variant="accent" size="sm" className="hidden sm:inline-flex">
            Surprise me
          </Button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-paper lg:hidden"
            style={{ boxShadow: "2px 2px 0 0 var(--color-ink)" }}
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 rounded bg-ink transition-transform duration-200 ${
                  open ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-5 rounded bg-ink transition-opacity duration-200 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-3 h-0.5 w-5 rounded bg-ink transition-transform duration-200 ${
                  open ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-16 z-40 overflow-y-auto border-t-2 border-ink bg-cream px-6 pb-10 pt-6 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3.5 font-display text-2xl font-bold ${
                      active ? "border-ink bg-blush" : "border-transparent hover:border-ink hover:bg-paper"
                    }`}
                  >
                    {link.label}
                    <span aria-hidden="true" className="text-rose-deep">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 border-t-2 border-dashed border-ink/25 pt-5">
            <ul className="flex flex-col gap-2.5">
              {EXTRA_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-semibold text-ink-soft hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Button href="/chaos?spin=1" variant="accent" size="lg" className="mt-6 w-full">
            Surprise me
          </Button>
        </div>
      ) : null}
    </header>
  );
}
