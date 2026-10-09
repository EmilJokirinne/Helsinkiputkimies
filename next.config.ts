import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    // www → apex is handled in Vercel domain settings; these keep common
    // alternative spellings from producing 404s.
    return [
      { source: "/hinnat", destination: "/putkimiehen-hinnat", permanent: true },
      { source: "/vertailu", destination: "/putkiliikkeiden-vertailu", permanent: true },
      { source: "/ukk", destination: "/usein-kysytyt-kysymykset", permanent: true },
      { source: "/yhteystiedot", destination: "/tarjouspyynto", permanent: true },
      { source: "/putkipalvelut/paivystava-putkimies", destination: "/paivystava-putkimies", permanent: true },
    ];
  },
};

export default nextConfig;
