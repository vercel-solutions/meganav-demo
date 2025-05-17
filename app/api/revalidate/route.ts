import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    revalidatePath("/api/navigation");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
