import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      // Local development — backend API served via Docker or direct
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      // Production — Monstrino API / CDN / MinIO rehosting service
      {
        protocol: "https",
        hostname: "*.monstrino.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
