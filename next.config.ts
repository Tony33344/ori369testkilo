import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/rezervacija',
        destination: '/kontakt',
      },
      {
        source: '/rezervacija/:path*',
        destination: '/kontakt',
      },
    ];
  },
};

export default nextConfig;
