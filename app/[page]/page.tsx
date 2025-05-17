// Keep ISR revalidation but remove force-static
export const revalidate = 3600;

// Pre-build specific product pages for ISR
export async function generateStaticParams() {
  return [{ page: "product-1" }, { page: "product-2" }, { page: "product-3" }];
}

export default async function Page({ params }: { params: { page: string } }) {
  // Generate timestamp for ISR demonstration
  const generatedAt = new Date().toLocaleString();

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Product Page slug: {params.page}</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
          This is a statically generated at {generatedAt} page with ISR
          (Incremental Static Regeneration). It will be revalidated every hour.
        </p>
      </div>
    </div>
  );
}
