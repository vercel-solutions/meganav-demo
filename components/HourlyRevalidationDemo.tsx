"use client";

import { useState } from "react";
import {
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import { ReactNode } from "react";
import { mutate } from "swr";
import useSWR from "swr";

interface InfoCardProps {
  icon?: LucideIcon;
  title?: string;
  children: ReactNode;
  variant?: "default" | "success" | "error";
}

interface SimulationState {
  lastSimulated: string | null;
  isSimulating: boolean;
  simulationResult: any | null;
  showBeforeAfter: boolean;
  updateSuccess: boolean;
}

// Reusable components
const InfoCard = ({
  icon: Icon,
  title,
  children,
  variant = "default",
}: InfoCardProps) => {
  const baseStyles = "p-3 rounded-md border";
  const variants = {
    default: "bg-secondary dark:bg-secondary",
    success:
      "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30",
  } as const;

  return (
    <div className={`${baseStyles} ${variants[variant]}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-primary dark:text-primary" />}
        {title && <span className="text-sm font-medium">{title}</span>}
      </div>
      {children}
    </div>
  );
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function HourlyRevalidationDemo() {
  const [state, setState] = useState<SimulationState>({
    lastSimulated: null,
    isSimulating: false,
    simulationResult: null,
    showBeforeAfter: false,
    updateSuccess: false,
  });

  // Fetch the latest navigation data
  const { data: nav, isLoading, error } = useSWR("/api/navigation", fetcher);

  const simulateProductUpdate = async () => {
    setState((prev) => ({ ...prev, isSimulating: true, updateSuccess: false }));

    try {
      // Simulate a product update
      await fetch("/api/navigation", {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });

      // Wait for Vercel to revalidate the cache
      await new Promise((res) => setTimeout(res, 1500));

      // Now revalidate SWR cache
      await mutate("/api/navigation");

      const timestamp = new Date().toISOString();

      setState((prev) => ({
        ...prev,
        lastSimulated: timestamp,
        updateSuccess: true,
      }));
    } catch (error) {
      console.error("Failed to simulate update:", error);
      setState((prev) => ({
        ...prev,
        simulationResult: { error: "Failed to simulate update" },
      }));
    } finally {
      setState((prev) => ({ ...prev, isSimulating: false }));
    }
  };

  const toggleBeforeAfter = () => {
    setState((prev) => ({ ...prev, showBeforeAfter: !prev.showBeforeAfter }));
  };

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-4">Navigation Revalidation Demo</h2>
      <div className="space-y-4">
        <p className="text-foreground dark:text-foreground">
          This demo shows how the navigation API automatically revalidates,
          checking for new product data and updating only when changes are
          detected.
        </p>

        <InfoCard
          icon={Clock}
          title="Automatic Revalidation Process"
          variant="default"
        >
          <ol className="space-y-2 text-sm list-decimal list-inside mt-2">
            <li>Fetches the latest product data from the external source</li>
            <li>Compares it with the current navigation data</li>
            <li>Only updates the navigation if new data is available</li>
            <li>Continues serving cached data if no changes are detected</li>
          </ol>
        </InfoCard>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            onClick={simulateProductUpdate}
            disabled={state.isSimulating}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground text-sm rounded-md hover:bg-primary/90 dark:hover:bg-primary/90 transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${state.isSimulating ? "animate-spin" : ""}`}
            />
            <span>
              {state.isSimulating ? "Simulating..." : "Simulate Product Update"}
            </span>
          </button>
        </div>

        {state.lastSimulated && (
          <InfoCard icon={Clock}>
            <span className="text-sm">
              Last updated: {new Date(state.lastSimulated).toLocaleTimeString()}
            </span>
          </InfoCard>
        )}

        {state.simulationResult && (
          <div className="mt-4">
            {state.simulationResult.error ? (
              <InfoCard icon={AlertTriangle} variant="error">
                <span className="text-red-800 dark:text-red-200">
                  Error: {state.simulationResult.error}
                </span>
              </InfoCard>
            ) : (
              <InfoCard icon={CheckCircle} variant="success">
                <span className="text-emerald-800 dark:text-emerald-200">
                  <strong>Update Success:</strong>{" "}
                  {state.simulationResult.message}
                </span>

                <div className="mb-4">
                  <button
                    onClick={toggleBeforeAfter}
                    className="text-sm text-primary dark:text-primary flex items-center mt-2"
                  >
                    <ArrowRight
                      className={`h-3.5 w-3.5 mr-1 transition-transform ${
                        state.showBeforeAfter ? "rotate-90" : ""
                      }`}
                    />
                    {state.showBeforeAfter ? "Hide" : "Show"} before/after
                    comparison
                  </button>

                  {state.showBeforeAfter &&
                    state.simulationResult.updateDetails && (
                      <div className="mt-2 grid grid-cols-2 gap-4 border-t border-border pt-2">
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground dark:text-muted-foreground mb-1">
                            Before:
                          </h4>
                          <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-medium">
                              {state.simulationResult.beforeData?.header?.items?.find(
                                (item: any) => item.title === "Products"
                              )?.dropdown?.items[
                                state.simulationResult.updateDetails.id - 1
                              ]?.title || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground dark:text-muted-foreground mb-1">
                            After:
                          </h4>
                          <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              {state.simulationResult.updateDetails.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                {state.updateSuccess && (
                  <InfoCard variant="success">
                    <p className="text-xs text-emerald-800 dark:text-emerald-200 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      <span>
                        <strong>ISR Success!</strong> The navigation cache has
                        been revalidated with the new product information (
                        {state.simulationResult?.updateDetails?.title}). You can
                        now refresh the page to see the changes in the Products
                        dropdown.
                      </span>
                    </p>
                  </InfoCard>
                )}
              </InfoCard>
            )}
          </div>
        )}
      </div>
      {/* Show latest Products dropdown from navigation data */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">
          Current Products in Navigation:
        </h3>
        {isLoading && <div>Loading navigation...</div>}
        {error && <div>Error loading navigation.</div>}
        {nav &&
        nav.header.items.find((item: any) => item.title === "Products")
          ?.dropdown ? (
          <ul className="list-disc pl-6">
            {nav.header.items
              .find((item: any) => item.title === "Products")
              .dropdown.items.map((dropdownItem: any, idx: number) => (
                <li key={idx}>{dropdownItem.title}</li>
              ))}
          </ul>
        ) : (
          <div>No products found in navigation.</div>
        )}
      </div>
    </div>
  );
}
