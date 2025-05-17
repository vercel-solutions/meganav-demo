"use client";

export function RevalidateButton() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Headless CMS Demo</h2>
      <p className="text-muted-foreground">
        Click the button below to simulate a change in the headless CMS. This
        will trigger a revalidation of the navigation data.
      </p>
      <button
        onClick={() => fetch("/api/revalidate")}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
      >
        Simulate Headless CMS Change
      </button>
    </section>
  );
}
