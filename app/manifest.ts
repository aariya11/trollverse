import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TROLLVERSE — The Internet Has Lost Its Mind",
    short_name: "TROLLVERSE",
    description:
      "A playground for harmless chaos: random humor, prank links, meme making, doodle battles and weird little games.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1dc",
    theme_color: "#c68a8c",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
