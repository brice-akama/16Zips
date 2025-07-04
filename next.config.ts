/* eslint-disable */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    minimumCacheTTL: 60, // Cache images for 60 seconds
    dangerouslyAllowSVG: true,
    unoptimized: false, // Set to false to keep Next.js optimization
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },
  

  async headers() {
    return [
      {
        source: '/(.*)', // Apply these headers globally to all routes
        headers: [
       // next.config.js or headers() in middleware
    {
  key: 'Content-Security-Policy',
  value: `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval'
      https://code.jivosite.com
      https://www.googletagmanager.com
      https://www.google-analytics.com
      https://embed.tawk.to
      https://*.tawk.to
      https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://code.jivosite.com https://embed.tawk.to;
    img-src 'self' data: https: blob:;
    connect-src 'self' https: wss:
      https://code.jivosite.com
      wss://*.jivosite.com
      https://embed.tawk.to
      wss://*.tawk.to;
    font-src 'self' https: https://embed.tawk.to;
    media-src 'self' https://code.jivosite.com https://embed.tawk.to;
    frame-src https://www.google.com https://maps.google.com https://embed.tawk.to;
    child-src https://www.google.com https://maps.google.com https://embed.tawk.to;
  `.replace(/\s{2,}/g, ' ').trim(),
},



          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },

          
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', 
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
        ],
      },
    ];
  }
};

export default nextConfig;