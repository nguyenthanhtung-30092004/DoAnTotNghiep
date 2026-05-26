/* ProductSkeleton — dùng trong Shop khi loading */
const ProductSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white animate-pulse">
    {/* Image area */}
    <div className="aspect-square bg-slate-100" />

    {/* Info */}
    <div className="p-3.5 space-y-2.5">
      <div className="h-2.5 w-16 rounded-full bg-slate-100" />
      <div className="h-4 w-full rounded-full bg-slate-200" />
      <div className="h-4 w-2/3 rounded-full bg-slate-100" />
      <div className="mt-1 flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-3.5 w-3.5 rounded-full bg-slate-100" />
        ))}
      </div>
      <div className="h-5 w-24 rounded-full bg-slate-200" />
    </div>
  </div>
);

export default ProductSkeleton;
