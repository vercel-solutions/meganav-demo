"use client";

import { RefreshCw } from "lucide-react";

export function RefreshButton() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <button
      onClick={handleRefresh}
      className="flex items-center justify-center space-x-2 px-4 py-2 bg-secondary dark:bg-secondary text-secondary-foreground dark:text-secondary-foreground text-sm rounded-md hover:bg-secondary/80 dark:hover:bg-secondary/80 transition-colors"
      aria-label="Refresh page"
    >
      <RefreshCw className="h-4 w-4 mr-1" />
      <span>Refresh Page</span>
    </button>
  );
}
