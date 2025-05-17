import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import {
  getNavigationData,
  simulateProductUpdate,
} from "@/lib/navigation-store";
import { revalidateTag } from "next/cache";

// Set up automatic ISR revalidation every hour
export const revalidate = 3600; // seconds = 1 hour

// Cache the navigation data with a tag for easy invalidation
const getNavigationWithCache = unstable_cache(
  async () => {
    return getNavigationData();
  },
  ["navigation-data-v1"],
  {
    tags: ["navigation"],
    revalidate: 3600,
  }
);

// GET method for fetching navigation data with ISR support
export async function GET() {
  // Simple ISR implementation - no metadata headers needed for demo
  const data = await getNavigationWithCache();

  // Add comprehensive cache control headers for both ISR and browser caching
  const headers = new Headers({
    "Cache-Control":
      "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    Expires: new Date(Date.now() + 3600 * 1000).toUTCString(),
  });

  return NextResponse.json(data, { headers });
}

// POST method for simulating product updates and triggering ISR revalidation
export async function POST() {
  try {
    // Simulate a product update with random variations
    const updatedProductResult = simulateProductUpdate();

    // Add a small delay to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Trigger ISR revalidation by revalidating the tag
    await revalidateTag("navigation");

    // Return response with detailed update info
    return NextResponse.json({
      success: true,
      message: updatedProductResult.updateInfo.message,
      updateDetails: {
        id: updatedProductResult.id,
        title: updatedProductResult.title,
        timestamp: new Date().toISOString(),
      },
      revalidated: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update navigation",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
