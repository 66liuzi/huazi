import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/huazi',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
