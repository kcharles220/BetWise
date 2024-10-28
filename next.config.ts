import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/luukhopman/football-logos/blob/master/logos/**',
      },
    ],
  },
};

export default nextConfig;
