import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */



  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      //the image will be coming from imagekit.io
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      }
    ],
  },

  experimental: {
    allowedDevOrigins: ["*"],
  },

  typescript:{
    ignoreBuildErrors: true,
  },
  
  eslint:{
    ignoreDuringBuilds: true,
  }



  
};

export default nextConfig;




/*This setup ensures only images from these trusted sources can be used, preventing security risks.*/