/** @type {import('next').NextConfig} */
const nextConfig = {
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
