import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve images as-is (no server-side optimizer). Keeps the remote Unsplash
    // avatar and the local logos working without extra infra.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
