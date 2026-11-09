import type { MetadataRoute } from "next";

/** The site's name and icons for phones (home-screen shortcut, Android's tab color). The app itself is the portal. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Hafiz — حافظ",
    short_name: "Hafiz",
    description: "Quran school and halaqa management — إدارة حلقات تحفيظ القرآن الكريم — Kur'an kursu yönetimi",
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#faf8f3",
    theme_color: "#0d3429",
    categories: ["education", "productivity"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icons/hafiz-dark-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/hafiz-dark-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/hafiz-dark-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/hafiz-dark-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
