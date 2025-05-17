import { Clock } from "lucide-react";

// Keep ISR revalidation but remove force-static
export const revalidate = 3600;

export default async function Page() {
  // Generate timestamp for ISR demonstration
  const generatedAt = new Date().toLocaleString();

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground w-fit before:content-[''] before:block before:w-1.5 before:h-1.5 before:rounded-full before:bg-emerald-500 before:[animation:pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
          <Clock className="h-3.5 w-3.5 mr-1" />
          ISR: Static page — generated at {generatedAt}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <span className="mr-2">Next revalidation:</span>
          <span className="code-inline">export const revalidate = 3600;</span>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Product Page</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
          This is a statically generated page with ISR (Incremental Static
          Regeneration). It will be revalidated every hour or when manually
          triggered.
        </p>
      </div>
    </div>
  );
}
