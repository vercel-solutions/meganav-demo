import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Check if the request is for static assets
  const url = request.nextUrl.pathname;

  // Set cache headers for favicon
  if (url.includes("/favicon.ico")) {
    response.headers.set("Cache-Control", "public, max-age=86400, immutable"); // 24 hours
    response.headers.set(
      "Expires",
      new Date(Date.now() + 86400 * 1000).toUTCString()
    );
  }

  // Set cache headers for other static files
  else if (
    url.includes("/_next/static") ||
    url.includes("/images/") ||
    url.endsWith(".svg") ||
    url.endsWith(".png") ||
    url.endsWith(".jpg") ||
    url.endsWith(".jpeg") ||
    url.endsWith(".gif") ||
    url.endsWith(".woff") ||
    url.endsWith(".woff2")
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    ); // 1 year
    response.headers.set(
      "Expires",
      new Date(Date.now() + 31536000 * 1000).toUTCString()
    );
  }

  return response;
}

// Configure the middleware to run for specific paths
export const config = {
  matcher: [
    // Match all static asset paths
    "/favicon.ico",
    "/_next/static/:path*",
    "/images/:path*",
    // Add any other paths that need the middleware
  ],
};
