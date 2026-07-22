import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "picsum.photos" },
      { hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
