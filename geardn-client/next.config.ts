import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'storage.googleapis.com',
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
    ],
  },
};

export default nextConfig;
