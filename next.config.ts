import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jpftfjhmgdyrnenopays.supabase.co',
      },
    ],
  },
};

export default nextConfig;
