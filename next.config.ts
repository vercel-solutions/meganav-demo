import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // Remove unused CSS in production
    removeConsole: process.env.NODE_ENV === "production",
  },

  async headers() {
    return [
      // API Navigation route with proper cache headers
      {
        source: "/api/navigation",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 3600 * 1000).toUTCString(),
          },
        ],
      },
      // Favicon specific cache headers
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, immutable",
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 86400 * 1000).toUTCString(),
          },
        ],
      },
      // Static assets cache (images, fonts, etc)
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // CSS files specific cache headers
      {
        source: "/_next/static/css/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Default cache for other paths
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
