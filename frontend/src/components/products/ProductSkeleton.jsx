/* ProductSkeleton — dùng trong Shop khi loading */
const ProductSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm animate-pulse">
    {/* Image area */}
    <div className="aspect-[4/5] bg-muted" />

    {/* Info */}
    <div className="p-4 space-y-3">
      <div className="h-2.5 w-16 rounded-full bg-muted" />
      <div className="h-4 w-full rounded-full bg-muted/70" />
      <div className="h-4 w-2/3 rounded-full bg-muted" />
      <div className="mt-1 flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-3.5 w-3.5 rounded-full bg-muted" />
        ))}
      </div>
      <div className="h-5 w-24 rounded-full bg-muted/70" />
    </div>
  </div>
);

export default ProductSkeleton;
