import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  images: {
    domains: ['images-na.ssl-images-amazon.com', 'm.media-amazon.com'],
  },
};

export default nextConfig;
