import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server build for Railway (Node). To switch back to static export
  // (Cloudflare Pages / Netlify), set output: "export".
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
