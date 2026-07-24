import type { NextConfig } from "next";

// Backend services, proxied through Next so the browser always talks to the
// same origin (no CORS handling required on the services).
//   nexy   — auth/authz (users, orgs, members, tokens)
//   synthy — GitHub integration + indexing (connect, repos, index status)
// Override with NEXY_API_URL / SYNTHY_API_URL in other environments.
const NEXY_API_URL = process.env.NEXY_API_URL ?? "http://localhost:8080";
const SYNTHY_API_URL = process.env.SYNTHY_API_URL ?? "http://localhost:8090";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/nexy/:path*",
        destination: `${NEXY_API_URL}/:path*`,
      },
      {
        source: "/api/synthy/:path*",
        destination: `${SYNTHY_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
