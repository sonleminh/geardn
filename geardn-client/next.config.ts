import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
  },
  images: {
    domains: [
      'storage.googleapis.com',
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
    ],
  },
};

export default nextConfig;
