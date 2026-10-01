import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: '/terapije/manualna-terapija',
        destination: '/terapije/miofascialna-masaza',
        permanent: true,
      },
      {
        source: '/terapije/individualna-protibolecinska-antistresna-vadba',
        destination: '/terapije/vadba-za-gibljivost',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
