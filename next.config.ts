import type { NextConfig } from "next";

// The nexy auth API. In dev this is the local Go service; override with
// NEXY_API_URL in other environments. Requests are proxied through Next so the
// browser always talks to the same origin (no CORS handling required on nexy).
const NEXY_API_URL = process.env.NEXY_API_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/nexy/:path*",
        destination: `${NEXY_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
