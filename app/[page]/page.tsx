import { Clock } from "lucide-react";

// Keep ISR revalidation but remove force-static
export const revalidate = 3600;

export default async function Page() {
  // Generate timestamp for ISR demonstration
  const generatedAt = new Date().toLocaleString();

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Product Page</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
          This is a statically generated at {generatedAt} page with ISR
          (Incremental Static Regeneration). It will be revalidated every hour.
        </p>
      </div>
    </div>
  );
}
