import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Revalidate the navigation data
    await res.revalidate("/api/navigation");
    return res.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error revalidating" });
  }
}
