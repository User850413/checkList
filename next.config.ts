import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  env: {
    PUBLIC_URL: process.env.PUBLIC_URL || '',
  },
};

export default nextConfig;
