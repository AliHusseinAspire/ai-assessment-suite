import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@assessment/ui'],
  outputFileTracingIncludes: {
    '/**': ['./prisma/generated/client/*'],
  },
};

export default nextConfig;
