import { NextResponse } from "next/server";
import { mockNavigationData } from "@/lib/mock-nav";

// Set up automatic ISR revalidation every hour
export const revalidate = 3600; // seconds = 1 hour

// GET method for fetching navigation data with ISR support
export async function GET() {
  const data = mockNavigationData;

  return NextResponse.json(data);
}
