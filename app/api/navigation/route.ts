import { getNavigationData } from "@/lib/mock-nav";
import { NextResponse } from "next/server";

export const revalidate = 360; // every 5 minutes

export async function GET() {
  // needts to be wrapped in the async funciton in order bundler not to pack it as static
  const data = await getNavigationData();
  return NextResponse.json(data);
}
