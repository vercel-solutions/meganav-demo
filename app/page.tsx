import { RevalidateButton } from "@/components/revalidate-button";

// Keep ISR revalidation but remove force-static
export const revalidate = 3600;

export default function Page() {
  // Generate timestamp for ISR demonstration
  const generatedAt = new Date().toLocaleString();

  return (
    <div className="space-y-12">
      <h1>MegaNav example</h1>
      <p>This page was generated at {generatedAt}</p>
      <RevalidateButton />
    </div>
  );
}
