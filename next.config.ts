import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Fichiers uploadés via le back office (Vercel Blob)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Miniatures YouTube
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
