import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
      <div className="text-9xl font-bold text-secondary dark:text-secondary/30">
        404
      </div>
      <h2 className="text-4xl font-bold">Page Not Found</h2>
      <p className="text-lg text-muted-foreground dark:text-muted-foreground max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/home"
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary dark:bg-primary px-4 py-2 text-sm font-medium text-primary-foreground dark:text-primary-foreground transition-colors hover:bg-primary/90 dark:hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 mt-4"
      >
        Return Home
      </Link>
    </div>
  );
}
