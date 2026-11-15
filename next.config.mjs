/** @type {import('next').NextConfig} */
const nextConfig = {
  // No "x-powered-by: Next.js" on every answer (SEO audit 2026-11-15, T-05).
  poweredByHeader: false,
  // Basic security headers on every page. No Content-Security-Policy yet: start it as Report-Only first (the pages
  // use inline JSON-LD and Next's inline scripts, and Cloudflare adds its own analytics and email scripts).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
        ],
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // app/global-not-found.tsx: the root layout is per language (app/[lang]), so a 404 needs its own document.
    globalNotFound: true,
  },
}

export default nextConfig
