import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://trollverse.example";

export const SITE_NAME = "TROLLVERSE";
export const TAGLINE = "The internet has lost its mind.";

interface PageMetaOptions {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}

export function pageMeta({ title, description, path = "/", noIndex = false }: PageMetaOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title: `${title} · ${SITE_NAME}`,
      description,
    },
  };
}
