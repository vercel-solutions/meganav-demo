import { Clock } from "lucide-react";
import { HourlyRevalidationDemo } from "@/components/HourlyRevalidationDemo";

// Keep ISR revalidation but remove force-static
export const revalidate = 3600;

// Hardcoded welcome message - moved from navigation data
const WELCOME_MESSAGE = {
  title: "Welcome to MegaNav Demo!!",
  description: "A demonstration of Next.js with ISR and CSS-driven navigation",
};

export default function Page() {
  // Generate timestamp for ISR demonstration
  const generatedAt = new Date().toLocaleString();

  return (
    <div className="space-y-12">
      <div className="relative flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground w-fit before:content-[''] before:block before:w-1.5 before:h-1.5 before:rounded-full before:bg-emerald-500 before:[animation:pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
        <Clock className="h-3.5 w-3.5 mr-1" />
        ISR: Static page — generated at {generatedAt}
      </div>

      <div className="space-y-6 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight">
          {WELCOME_MESSAGE.title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {WELCOME_MESSAGE.description}
        </p>
      </div>

      {/* Add the Hourly Revalidation Demo */}
      <HourlyRevalidationDemo />
    </div>
  );
}
