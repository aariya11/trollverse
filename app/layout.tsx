import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SITE_NAME, SITE_URL, TAGLINE } from "@/lib/seo";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — The Internet Has Lost Its Mind`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "TROLLVERSE is a playground for harmless chaos: random humor, prank links, meme making, collaborative doodles and weird little games. Come bored, leave confused.",
  keywords: [
    "fun website",
    "random humor",
    "prank your friends",
    "meme generator",
    "stupid games",
    "internet chaos",
  ],
  applicationName: SITE_NAME,
  openGraph: {
    title: `${SITE_NAME} — The Internet Has Lost Its Mind`,
    description: TAGLINE,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — The Internet Has Lost Its Mind`,
    description: TAGLINE,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col antialiased">
        <AppProviders>
          <a
            href="#main"
            className="sr-only z-[100] rounded-full border-2 border-ink bg-blush px-4 py-2 font-semibold focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
